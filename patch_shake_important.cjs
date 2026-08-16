const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');
code = code.replace(/animation: wrong-shake 0\.4s ease-in-out infinite;/, "animation: wrong-shake 0.4s ease-in-out infinite !important;");
fs.writeFileSync('public/bubble-sentence.html', code);
