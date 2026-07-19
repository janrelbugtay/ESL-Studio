const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace(/if\(clickedB\.w\.toLowerCase\(\) === slot\.w\)/g, "if(clickedB.el.innerText.toLowerCase() === slot.w)");
html = html.replace(/if\(b\.w\.toLowerCase\(\) === slot\.w\)/g, "if(b.el.innerText.toLowerCase() === slot.w)");

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched dragging bug");
