const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(/className = 'word-slot shadow-inner';/g, "className = 'word-slot shadow-inner relative';");

fs.writeFileSync('public/bubble-sentence.html', code);
