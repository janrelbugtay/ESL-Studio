const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const targetStr = `                        if (clickedB.isClick) {
                            const nextI = this.slots.findIndex(s => !s.filled);
                            const wordText = clickedB.wordText.toLowerCase();
                            
                            if (nextI !== -1) {
                                if (this.slots[nextI].w === wordText) {
                                    this.correct(clickedB, this.slots[nextI]);
                                } else {
                                    this.wrong(clickedB, this.slots[nextI]);
                                }
                            }
                        } else {
                            this.checkDrop(clickedB, e.clientX, e.clientY);
                        }`;

const replacement = `                        if (!clickedB.isClick) {
                            // Only handle drops here, clicks are handled by the native click event listener on the element
                            const cx = e.clientX !== undefined ? e.clientX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0);
                            const cy = e.clientY !== undefined ? e.clientY : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : 0);
                            this.checkDrop(clickedB, cx, cy);
                        }`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched pointerup.");
