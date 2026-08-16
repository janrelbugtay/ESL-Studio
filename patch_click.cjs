const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// Replace the pointerdown/move/up logic for clicks to use a robust click event,
// or just increase the tolerance for isClick.
code = code.replace(/Math\.abs\(e\.clientX - this\.dragB\.startX\) > 30/g, 'Math.abs(e.clientX - this.dragB.startX) > 100');
code = code.replace(/Math\.abs\(e\.clientY - this\.dragB\.startY\) > 30/g, 'Math.abs(e.clientY - this.dragB.startY) > 100');

fs.writeFileSync('public/bubble-sentence.html', code);
