const fs = require('fs');
const html = fs.readFileSync('public/bubble-sentence.html', 'utf8');
const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let match;
let count = 0;
while ((match = scriptRegex.exec(html)) !== null) {
    count++;
    const scriptContent = match[1];
    try {
        new Function(scriptContent);
        console.log(`Script ${count} is syntactically valid.`);
    } catch (e) {
        console.log(`Syntax Error in script ${count}:`, e.message);
    }
}
