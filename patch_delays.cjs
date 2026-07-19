const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace('this.levelTimeout = setTimeout(()=>this.idxComplete(), 1000);', 'this.levelTimeout = setTimeout(()=>this.idxComplete(), 500);');
html = html.replace('else { this.levelTimeout = setTimeout(()=>this.loadLevel(), 1500); }', 'else { this.levelTimeout = setTimeout(()=>this.loadLevel(), 800); }');

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched delays");
