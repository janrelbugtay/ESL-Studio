const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(".wrong-shake {", ".bubble-word.wrong-shake {");

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched CSS specificity");
