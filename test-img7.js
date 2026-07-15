import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: { parts: [{ text: 'A cute cat' }] },
      config: { imageConfig: { outputMimeType: "image/jpeg" } }
    });
    console.log("Success image with lite 2");
  } catch (e) { console.error(e.message); }
}
run();
