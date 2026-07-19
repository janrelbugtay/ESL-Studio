const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldCheckDrop = `            checkDrop(b, cx, cy) {
                const pad = 30; // Generous hit area
                
                // First check if they dropped it on ANY empty slot
                for (let slot of this.slots) {
                    if (slot.filled) continue;
                    const r = slot.el.getBoundingClientRect();
                    if(cx > r.left-pad && cx < r.right+pad && cy > r.top-pad && cy < r.bottom+pad) {
                        if(b.el.innerText.toLowerCase() === slot.w) {
                            this.correct(b, slot);
                            return;
                        } else {
                            this.wrong(b, slot);
                            return; // dropped on wrong slot
                        }
                    }
                }
                
                // If they didn't drop it on any specific slot but dropped it generally near the container?
                // Let's keep it strictly requiring dragging over a slot for dragging.
            },`;

const newCheckDrop = `            checkDrop(b, cx, cy) {
                const pad = 30; // Generous hit area
                const wordText = b.w.toLowerCase();
                
                // First check if they dropped it on ANY empty slot
                for (let slot of this.slots) {
                    if (slot.filled) continue;
                    const r = slot.el.getBoundingClientRect();
                    if(cx > r.left-pad && cx < r.right+pad && cy > r.top-pad && cy < r.bottom+pad) {
                        if(wordText === slot.w) {
                            this.correct(b, slot);
                            return;
                        } else {
                            this.wrong(b, slot);
                            return; // dropped on wrong slot
                        }
                    }
                }
            },`;

html = html.replace(oldCheckDrop, newCheckDrop);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched checkDrop 2");
