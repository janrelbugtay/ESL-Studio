const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const toRemove = `
                    // Add a reliable native click handler fallback
                    el.addEventListener('click', (e) => {
                        const b = this.bubbles.find(bb => bb.el === el);
                        if(!b) return;
                        if (this.dragB === b) return; // currently dragging
                        
                        // Handle native click snap if pointerup somehow failed
                        if (!b.snapped) {
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
`;

code = code.replace(toRemove, "");
fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Removed native click fallback.");
