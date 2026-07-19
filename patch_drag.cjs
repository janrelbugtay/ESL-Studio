const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace("if(Math.abs(e.clientX - this.dragB.startX) > 15 || Math.abs(e.clientY - this.dragB.startY) > 15)", 
"if(Math.abs(e.clientX - this.dragB.startX) > 30 || Math.abs(e.clientY - this.dragB.startY) > 30)");

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched drag threshold");
