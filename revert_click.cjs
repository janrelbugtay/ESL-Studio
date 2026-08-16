const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(/\/\/ Robust click handler for mobile[\s\S]*?el\.addEventListener\('pointerdown', e => \{/, "el.addEventListener('pointerdown', e => {");

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Reverted click robust");
