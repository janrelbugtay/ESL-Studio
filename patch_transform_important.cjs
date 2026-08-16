const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace("position: relative; transform: none !important;", "position: relative;");

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched transform important");
