import re

with open('server.ts', 'r') as f:
    content = f.read()

old_gen = """      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });
      
      let text = response.text?.trim() || "";
      if (text.startsWith("```json")) {
        text = text.substring(7);
      }
      if (text.startsWith("```")) {
        text = text.substring(3);
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }
      
      const questions = JSON.parse(text);"""

new_gen = """      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      let text = response.text?.trim() || "";
      const questions = JSON.parse(text);"""

content = content.replace(old_gen, new_gen)

with open('server.ts', 'w') as f:
    f.write(content)
