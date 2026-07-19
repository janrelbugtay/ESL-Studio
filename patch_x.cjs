const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldWrong = `            wrong(b, slot) {
                if (slot) {
                    slot.el.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                    slot.el.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        slot.el.style.backgroundColor = '';
                        slot.el.style.borderColor = '';
                    }, 400);
                }
                Audio.wrong(); Mascot.react('sad');
                this.combo = 0; this.mistakes++; this.updateScore();
                
                // Visual feedback
                b.el.style.borderColor = '#ef4444';
                b.el.style.color = '#ef4444';
                b.shakeTime = 400; // 400ms shake
                
                setTimeout(() => {
                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                }, 400);
            },`;

const newWrong = `            wrong(b, slot) {
                if (slot) {
                    slot.el.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                    slot.el.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        slot.el.style.backgroundColor = '';
                        slot.el.style.borderColor = '';
                    }, 400);
                }
                Audio.wrong(); Mascot.react('sad');
                this.combo = 0; this.mistakes++; this.updateScore();
                
                // Visual feedback with an X
                b.el.style.borderColor = '#ef4444';
                b.el.style.color = '#ef4444';
                b.shakeTime = 400; // 400ms shake
                
                let xMark = b.el.querySelector('.wrong-x');
                if (!xMark) {
                    xMark = document.createElement('div');
                    xMark.className = 'wrong-x absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-red-500 font-black z-20 pointer-events-none drop-shadow-md opacity-0 transition-opacity';
                    xMark.innerText = '❌';
                    b.el.appendChild(xMark);
                }
                
                // Show the X
                requestAnimationFrame(() => {
                    if(xMark) {
                        xMark.style.opacity = '1';
                        xMark.style.transform = 'translate(-50%, -50%) scale(1.5)';
                        setTimeout(() => {
                            if(xMark) xMark.style.transform = 'translate(-50%, -50%) scale(1)';
                        }, 100);
                    }
                });
                
                setTimeout(() => {
                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                    if (xMark) xMark.style.opacity = '0';
                }, 800);
            },`;

html = html.replace(oldWrong, newWrong);

const oldPointerUp = `                window.addEventListener('pointerup', e => {
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

const newPointerUp = `                window.addEventListener('pointerup', e => {
                    if(this.dragB) {
                        const clickedB = this.dragB;
                        this.dragB.el.classList.remove('dragging');
                        this.dragB = null;
                        
                        if (clickedB.isClick) {
                            // First, see if it matches the STRICT next slot
                            const nextI = this.slots.findIndex(s => !s.filled);
                            let matched = false;
                            // Clean the text from the element (remove the ❌ if it's there)
                            // We use the word property instead of innerText
                            const wordText = clickedB.w.toLowerCase();
                            
                            if (nextI !== -1 && this.slots[nextI].w === wordText) {
                                this.correct(clickedB, this.slots[nextI]);
                                matched = true;
                            } else {
                                // If not the next slot, maybe it belongs in ANY empty slot? 
                                const anyMatch = this.slots.find(s => !s.filled && s.w === wordText);
                                if (anyMatch) {
                                    this.correct(clickedB, anyMatch);
                                    matched = true;
                                }
                            }
                            
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
console.log("Patched wrong X and pointer up");
