const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const match = code.match(/<canvas id="particle-canvas"[^>]*><\/canvas>/);
if (!match) {
    console.log("Canvas missing!");
} else {
    console.log("Canvas is present: " + match[0]);
}
