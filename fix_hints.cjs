const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace(/b\.el\.innerText\.toLowerCase\(\)/g, 'b.text.toLowerCase()');

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Fixed innerText in hints");
