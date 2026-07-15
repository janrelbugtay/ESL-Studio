import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: { parts: [{ text: 'A cute cat' }] }
    });
    console.log("Success");
  } catch (e) { console.error(e.message); }
}
run();
