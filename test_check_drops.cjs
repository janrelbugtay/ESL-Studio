const fs = require('fs');
const html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

if (!html.includes('checkDrop(b, cx, cy)')) {
    console.log("checkDrop is missing!");
}
if (!html.includes('correct(b, slot)')) {
    console.log("correct is missing!");
}
if (!html.includes('wrong(b, slot)')) {
    console.log("wrong is missing!");
}
if (!html.includes('unsnap(b)')) {
    console.log("unsnap is missing!");
}

console.log("done checking");
