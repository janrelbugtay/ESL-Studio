import fs from 'fs';
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const setupDragRegex = /setupDrag\(\)\s*\{[\s\S]*?checkDrop\(b, cx, cy\)/;
const newSetupDrag = `setupDrag() {
                const doc = document.getElementById('screen-game');
                doc.addEventListener('pointerdown', e => {
                    if(e.target.classList.contains('bubble-word') && !e.target.classList.contains('snapped')) {
                        const clickedB = this.bubbles.find(b => b.el === e.target);
                        if(!clickedB) return;
                        
                        const nextI = this.slots.findIndex(s => !s.filled);
                        if(nextI !== -1) {
                            const slot = this.slots[nextI];
                            if(clickedB.w.toLowerCase() === slot.w) {
                                this.correct(clickedB, slot);
                            } else {
                                this.wrong(clickedB);
                            }
                        }
                    }
                });
            },
            checkDrop(b, cx, cy)`;

html = html.replace(setupDragRegex, newSetupDrag);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched setupDrag");
