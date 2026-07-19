const fs = require('fs');
const html = fs.readFileSync('public/bubble-sentence.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const code = scriptMatch[1];
const lines = code.split('\n');
for (let i = Math.max(0, 183 - 10); i < 183 + 10; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
