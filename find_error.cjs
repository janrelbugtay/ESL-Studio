const fs = require('fs');
const html = fs.readFileSync('public/bubble-sentence.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const code = scriptMatch[1];
const acorn = require('acorn');
try {
  acorn.parse(code, { ecmaVersion: 2020 });
} catch (e) {
  console.log("Error at line:", e.loc.line, "col:", e.loc.column);
  const lines = code.split('\n');
  console.log(lines[e.loc.line - 1]);
}
