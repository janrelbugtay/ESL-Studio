const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace(
  "this.ctx.globalAlpha = p.life; this.ctx.fillStyle = p.color;",
  "this.ctx.globalAlpha = p.life; this.ctx.fillStyle = p.color; this.ctx.strokeStyle = p.color; this.ctx.lineWidth = 2;"
);

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Fixed stroke");
