import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { parts: [{ text: 'A cute cat' }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    console.log("Success");
  } catch (e) { console.error(e.message); }
}
run();
