const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldPointerUp = `                window.addEventListener('pointerup', e => {
                    if(this.dragB) {
                        const clickedB = this.dragB;
                        this.dragB.el.classList.remove('dragging');
                        this.dragB = null;
                        
                        if (clickedB.isClick) {
                            // On click, find if this word belongs to the CURRENT next slot
                            const nextI = this.slots.findIndex(s => !s.filled);
                            if(nextI !== -1) {
                                const slot = this.slots[nextI];
                                if(clickedB.el.innerText.toLowerCase() === slot.w) {
                                    this.correct(clickedB, slot);
                                } else {
                                    this.wrong(clickedB, slot);
                                }
                            }
                        } else {
                            this.checkDrop(clickedB, e.clientX, e.clientY);
                        }
                    }
                });`;

const newPointerUp = `                window.addEventListener('pointerup', e => {
                    if(this.dragB) {
                        const clickedB = this.dragB;
                        this.dragB.el.classList.remove('dragging');
                        this.dragB = null;
                        
                        if (clickedB.isClick) {
                            // First, see if it matches the STRICT next slot
                            const nextI = this.slots.findIndex(s => !s.filled);
                            let matched = false;
                            if (nextI !== -1 && this.slots[nextI].w === clickedB.el.innerText.toLowerCase()) {
                                this.correct(clickedB, this.slots[nextI]);
                                matched = true;
                            } else {
                                // If not the next slot, maybe it belongs in ANY empty slot? 
                                // Let's allow it to snap to the FIRST empty slot it matches!
                                const anyMatch = this.slots.find(s => !s.filled && s.w === clickedB.el.innerText.toLowerCase());
                                if (anyMatch) {
                                    this.correct(clickedB, anyMatch);
                                    matched = true;
                                }
                            }
                            
                            // If no match found, trigger wrong on the first empty slot to show it's wrong
                            if (!matched && nextI !== -1) {
                                this.wrong(clickedB, this.slots[nextI]);
                            }
                        } else {
                            this.checkDrop(clickedB, e.clientX, e.clientY);
                        }
                    }
                });`;

html = html.replace(oldPointerUp, newPointerUp);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched to allow clicking any matching slot");
