const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldCreate = `                    this.bubbles.push({
                        el, text: w,
                        x: bx,
                        y: by,
                        w: bR.width || 100, h: bR.height || 40,
                        vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4,
                        snapped: false, scaleX: 1, scaleY: 1,
                        shakeTime: 0
                    });`;

const newCreate = `                    this.bubbles.push({
                        el, wordText: w,
                        x: bx,
                        y: by,
                        w: bR.width || 100, h: bR.height || 40,
                        vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4,
                        snapped: false, scaleX: 1, scaleY: 1,
                        shakeTime: 0
                    });`;

html = html.replace(oldCreate, newCreate);

// Fix in pointerup
html = html.replace('const wordText = clickedB.text.toLowerCase();', 'const wordText = clickedB.wordText.toLowerCase();');

// Fix in checkDrop
html = html.replace('const wordText = b.w.toLowerCase();', 'const wordText = b.wordText.toLowerCase();');
html = html.replace('const wordText = b.text.toLowerCase();', 'const wordText = b.wordText.toLowerCase();');

// Fix anywhere else b.text.toLowerCase() is used
html = html.replace(/b\.text\.toLowerCase\(\)/g, 'b.wordText.toLowerCase()');

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Fixed error");
