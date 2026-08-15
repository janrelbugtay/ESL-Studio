const fs = require('fs');
const file = 'public/bubble-sentence.html';
let code = fs.readFileSync(file, 'utf8');

const targetCheckDrop = `            checkDrop(b, cx, cy) {
                const pad = 30; // Generous hit area
                const wordText = b.wordText.toLowerCase();
                
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

const newCheckDrop = `            checkDrop(b, cx, cy) {
                const pad = 30; // Generous hit area
                const wordText = b.wordText.toLowerCase();
                
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

                // If they dropped it anywhere else, act like a click and drop into the next available slot
                const nextI = this.slots.findIndex(s => !s.filled);
                if (nextI !== -1) {
                    if (this.slots[nextI].w === wordText) {
                        this.correct(b, this.slots[nextI]);
                    } else {
                        this.wrong(b, this.slots[nextI]);
                    }
                }
            },`;

code = code.replace(targetCheckDrop, newCheckDrop);

fs.writeFileSync(file, code);
console.log("Patched checkDrop");
