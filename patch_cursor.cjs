const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace('cursor: grab;', 'cursor: pointer;');
html = html.replace('.bubble-word.dragging {', '.bubble-word.dragging { cursor: grabbing;');

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched cursor");
