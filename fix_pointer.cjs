const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(/<canvas id="particle-canvas"><\/canvas>/, `<canvas id="particle-canvas" style="pointer-events: none;"></canvas>`);

fs.writeFileSync('public/bubble-sentence.html', code);
