const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldPointerDown = `                doc.addEventListener('pointerdown', e => {
                    if(e.target.classList.contains('bubble-word')) {
                        const clickedB = this.bubbles.find(b => b.el === e.target);
                        if(!clickedB) return;
                        
                        if (clickedB.snapped) {
                            this.unsnap(clickedB);
                            return;
                        }
                        
                        // We set up drag
                        this.dragB = clickedB;
                        const r = clickedB.el.getBoundingClientRect();
                        this.dragOff = { x: e.clientX - r.left, y: e.clientY - r.top };
                        clickedB.el.classList.add('dragging');
                        clickedB.vx = 0; clickedB.vy = 0;
                        
                        // Also treat as click if it doesn't move much
                        clickedB.startX = e.clientX;
                        clickedB.startY = e.clientY;
                        clickedB.isClick = true;
                    }
                });`;

const newPointerDown = `                doc.addEventListener('pointerdown', e => {
                    const targetEl = e.target.closest('.bubble-word');
                    if(targetEl) {
                        const clickedB = this.bubbles.find(b => b.el === targetEl);
                        if(!clickedB) return;
                        
                        if (clickedB.snapped) {
                            this.unsnap(clickedB);
                            return;
                        }
                        
                        // We set up drag
                        this.dragB = clickedB;
                        const r = clickedB.el.getBoundingClientRect();
                        this.dragOff = { x: e.clientX - r.left, y: e.clientY - r.top };
                        clickedB.el.classList.add('dragging');
                        clickedB.vx = 0; clickedB.vy = 0;
                        
                        // Also treat as click if it doesn't move much
                        clickedB.startX = e.clientX;
                        clickedB.startY = e.clientY;
                        clickedB.isClick = true;
                    }
                });`;

html = html.replace(oldPointerDown, newPointerDown);

const oldPointerUp = `                window.addEventListener('pointerup', e => {
                    if(this.dragB) {
                        const clickedB = this.dragB;
                        this.dragB.el.classList.remove('dragging');
                        this.dragB = null;
                        
                        const nextI = this.slots.findIndex(s => !s.filled);
                        if(nextI !== -1) {
                            const slot = this.slots[nextI];
                            
                            if (clickedB.isClick) {
                                if(clickedB.el.innerText.toLowerCase() === slot.w) {
                                    this.correct(clickedB, slot);
                                } else {
                                    this.wrong(clickedB, slot);
                                }
                            } else {
                                this.checkDrop(clickedB, e.clientX, e.clientY);
                            }
                        }
                    }
                });`;

const newPointerUp = `                window.addEventListener('pointerup', e => {
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

html = html.replace(oldPointerUp, newPointerUp);

// Also update pointermove tolerance from 5 to 15
html = html.replace('if(Math.abs(e.clientX - this.dragB.startX) > 5 || Math.abs(e.clientY - this.dragB.startY) > 5)', 'if(Math.abs(e.clientX - this.dragB.startX) > 15 || Math.abs(e.clientY - this.dragB.startY) > 15)');

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched clicking");
