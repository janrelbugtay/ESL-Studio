const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const targetStr = `                        if (clickedB.snapped) {
                            this.unsnap(clickedB);
                            return;
                        }`;

code = code.replace(targetStr, `
                        if (clickedB.snapped) {
                            // Let the native click handler deal with unsnapping
                            return;
                        }
`);
fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched pointerdown unsnap.");
