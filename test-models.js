import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.list();
    console.log(response);
  } catch (e) { console.error(e.message); }
}
run();
