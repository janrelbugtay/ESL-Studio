const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace('.bubble-word { transform-origin: center; pointer-events: auto;', '.bubble-word { transform-origin: center; pointer-events: auto; touch-action: none; user-select: none; cursor: pointer;');

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched bubble css");
