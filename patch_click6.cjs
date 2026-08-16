const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const targetStr = `                    this.bubbles.push({
                        el, wordText: w,
                        x: bx,
                        y: by,
                        w: bR.width || 100, h: bR.height || 40,
                        vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4,
                        snapped: false, scaleX: 1, scaleY: 1,
                        shakeTime: 0
                    });`;

const replacement = targetStr + `
                    
                    // Direct click listener for maximum reliability
                    el.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const b = this.bubbles.find(bb => bb.el === el);
                        if (!b) return;
                        
                        // Ignore if we just dragged it
                        if (!b.isClick && !b.snapped) return; 

                        if (b.snapped) {
                            this.unsnap(b);
                        } else {
                            const nextI = this.slots.findIndex(s => !s.filled);
                            if (nextI !== -1) {
                                if (this.slots[nextI].w === b.wordText.toLowerCase()) {
                                    this.correct(b, this.slots[nextI]);
                                } else {
                                    this.wrong(b, this.slots[nextI]);
                                }
                            }
                        }
                    });
                    
                    el.addEventListener('touchstart', (e) => {
                         // Reset isClick on touch start
                         const b = this.bubbles.find(bb => bb.el === el);
                         if (b) b.isClick = true;
                    }, {passive: true});
`;

code = code.replace(targetStr, replacement);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched bubble creation.");
