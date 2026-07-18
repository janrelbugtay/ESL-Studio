import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, GenerateVideosOperation } from "@google/genai";
import multer from "multer";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Emoji Generation Endpoint (gemini-3.1-flash)
  app.post("/api/generate-emoji", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Prompt is required" });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `You are an emoji generator. Reply with EXACTLY ONE emoji that best represents the following text, and nothing else. Text: "${prompt}"`,
      });
      
      const emoji = response.text?.trim();
      res.json({ emoji });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Image Generation Endpoint (gemini-3-pro-image-preview)
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt, size } = req.body;
      if (!prompt) return res.status(400).json({ error: "Prompt is required" });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        },
      });
      
      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
      
      if (imageUrl) {
        res.json({ imageUrl });
      } else {
        res.status(500).json({ error: "Failed to generate image" });
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Video Generation Start Endpoint (veo-3.1-fast-generate-preview)
  app.post("/api/generate-video", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "Image is required" });
      const aspectRatio = req.body.aspectRatio || "16:9";

      // Note: Model requested by user is veo-3.1-fast-generate-preview, 
      // but according to the docs we can just pass the string.
      const operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        image: {
          imageBytes: req.file.buffer.toString('base64'),
          mimeType: req.file.mimetype,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      res.json({ operationName: operation.name });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Video Polling Endpoint
  app.post("/api/video-status", async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) return res.status(400).json({ error: "Operation name required" });

      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });
      
      res.json({ done: updated.done });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Video Download Endpoint
  app.get("/api/video-download", async (req, res) => {
    try {
      const operationName = req.query.operationName as string;
      if (!operationName) return res.status(400).json({ error: "Operation name required" });

      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });
      
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) return res.status(404).json({ error: "Video not ready or not found" });

      const videoRes = await fetch(uri, {
        headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY! },
      });
      
      res.setHeader('Content-Type', 'video/mp4');
      if (videoRes.body) {
        // We use Node's readable web streams
        const nodeStream = require('stream').Readable.fromWeb(videoRes.body);
        nodeStream.pipe(res);
      } else {
        res.status(500).json({ error: "Empty response body from video URL" });
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Image Analysis Endpoint (gemini-3.1-pro-preview)
  app.post("/api/analyze-image", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "Image is required" });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype,
              }
            },
            {
              text: "Analyze this image and describe what you see in detail. If it contains text, summarize it. If it contains objects or characters, identify them."
            }
          ]
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Mystery Box Questions Generation Endpoint
  app.post("/api/generate-mystery-box-questions", async (req, res) => {
    try {
      const { topic, level, type } = req.body;
      if (!topic || !level || !type) return res.status(400).json({ error: "Topic, level, and type are required" });

      const prompt = `Generate exactly 26 questions for an ESL game about "${topic}". The English proficiency level is Cambridge ${level}. 
      The question type should be ${type === 'mcq' ? 'Multiple Choice' : type === 'fib' ? 'Fill in the Blanks' : 'a mix of Multiple Choice and Fill in the Blanks'}.

      Respond ONLY with a valid JSON array of exactly 26 objects. Do not wrap in markdown tags like \`\`\`json.
      
      If the type is Multiple Choice (mcq), use this format:
      {
        "type": "mcq",
        "question": "The question text?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctOptionIndex": 0 // index of the correct option (0-3)
      }
      
      If the type is Fill in the Blanks (fib), use this format:
      {
        "type": "fib",
        "question": "The sentence with a ____ blank.",
        "answer": "correct word"
      }
      
      Ensure the English is natural, accurate, and perfectly matches the Cambridge ${level} level. 
      The JSON array MUST have exactly 26 objects.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      let text = response.text?.trim() || "";
      let questions = JSON.parse(text);
      
      // Ensure exactly 26 questions
      if (Array.isArray(questions)) {
        if (questions.length > 26) {
          questions = questions.slice(0, 26);
        } else while (questions.length < 26) {
          // duplicate the last question to fill up if model failed to generate enough
          questions.push({...questions[questions.length - 1]});
        }
      }

      res.json({ questions });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
