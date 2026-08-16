const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(/border-radius: 50%; transform: rotate\(-20deg\); \n        \}/, "border-radius: 50%; transform: rotate(-20deg); pointer-events: none;\n        }");

fs.writeFileSync('public/bubble-sentence.html', code);
