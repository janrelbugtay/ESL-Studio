const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(/e\.stopPropagation\(\);\n                        \/\/ Also optionally prevent default to stop scrolling, but touch-action:none handles that/, "e.stopPropagation();\n                        e.preventDefault();");

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Added preventDefault.");
