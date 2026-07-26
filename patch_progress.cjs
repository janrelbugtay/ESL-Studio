const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(
    `document.getElementById('ui-progress').style.width = \`\${(this.idx/this.sents.length)*100}%\`;`,
    `if(document.getElementById('ui-progress')) document.getElementById('ui-progress').style.width = \`\${(this.idx/this.sents.length)*100}%\`;`
);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched progress reference");
