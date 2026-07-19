const fs = require('fs');
const html = fs.readFileSync('public/bubble-sentence.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  const code = scriptMatch[1];
  try {
    new Function(code);
    console.log("No syntax errors.");
  } catch (e) {
    console.error("Syntax Error:", e);
  }
}
