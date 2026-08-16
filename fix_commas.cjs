const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(/\},,,,/g, "},");

fs.writeFileSync('public/bubble-sentence.html', code);
