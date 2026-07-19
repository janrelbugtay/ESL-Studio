const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace(/opacity-0 group-hover:opacity-100/g, 'opacity-70 hover:opacity-100');

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched pencil visibility");
