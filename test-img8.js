import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: { parts: [{ text: 'A cute cat' }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    console.log("Success with gemini-3.1-flash-lite-image");
  } catch (e) { console.error(e.message); }
}
run();
