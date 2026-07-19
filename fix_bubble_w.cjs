const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldCreate = `                    this.bubbles.push({
                        el, w,
                        x: bx,
                        y: by,
                        w: bR.width || 100, h: bR.height || 40,
                        vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4,
                        snapped: false, scaleX: 1, scaleY: 1,
                        shakeTime: 0
                    });`;

const newCreate = `                    this.bubbles.push({
                        el, text: w,
                        x: bx,
                        y: by,
                        w: bR.width || 100, h: bR.height || 40,
                        vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4,
                        snapped: false, scaleX: 1, scaleY: 1,
                        shakeTime: 0
                    });`;

html = html.replace(oldCreate, newCreate);

// Now change `b.w.toLowerCase()` to `b.text.toLowerCase()`
html = html.replace(/clickedB\.w\.toLowerCase\(\)/g, 'clickedB.text.toLowerCase()');
html = html.replace(/b\.w\.toLowerCase\(\)/g, 'b.text.toLowerCase()');

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Fixed b.w overwrite");
