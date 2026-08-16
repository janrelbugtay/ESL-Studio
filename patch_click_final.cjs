const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// 1. Remove native click listeners
const clickListenerRegex = /\/\/ Direct click listener[\s\S]*?\{passive: true\}\);/g;
code = code.replace(clickListenerRegex, "");

// 2. Put logic back in pointerup
const pointerupRegex = /window\.addEventListener\('pointerup', e => \{[\s\S]*?this\.checkDrop\(clickedB, cx, cy\);\n\s*\}\n\s*\}\n\s*\}\);/g;

const newPointerup = `window.addEventListener('pointerup', e => {
                    if(this.dragB) {
                        const clickedB = this.dragB;
                        this.dragB.el.classList.remove('dragging');
                        this.dragB = null;
                        
                        if (clickedB.isClick) {
                            const nextI = this.slots.findIndex(s => !s.filled);
                            if (nextI !== -1) {
                                if (this.slots[nextI].w === clickedB.wordText.toLowerCase()) {
                                    this.correct(clickedB, this.slots[nextI]);
                                } else {
                                    this.wrong(clickedB, this.slots[nextI]);
                                }
                            }
                        } else {
                            this.checkDrop(clickedB, e.clientX, e.clientY);
                        }
                    }
                });`;
code = code.replace(pointerupRegex, newPointerup);

// 3. Fix pointermove isClick logic
const pointermoveRegex = /window\.addEventListener\('pointermove', e => \{[\s\S]*?\{passive: false\}\);/g;
const newPointermove = `window.addEventListener('pointermove', e => {
                    if(this.dragB) {
                        const bnds = document.getElementById('physics-area').getBoundingClientRect();
                        let newX = e.clientX - bnds.left - this.dragOff.x;
                        let newY = e.clientY - bnds.top - this.dragOff.y;
                        this.dragB.x = newX;
                        this.dragB.y = newY;
                        
                        // Jitter tolerance
                        const dist = Math.hypot(e.clientX - this.dragB.startX, e.clientY - this.dragB.startY);
                        if (dist > 25) {
                            this.dragB.isClick = false;
                        }
                    }
                });`;
code = code.replace(pointermoveRegex, newPointermove);

// 4. Fix pointerdown (restore unsnap logic and simplify coords)
const pointerdownRegex = /doc\.addEventListener\('pointerdown', e => \{[\s\S]*?\}\n\s*\}\);/g;
const newPointerdown = `doc.addEventListener('pointerdown', e => {
                    let target = e.target;
                    if (target.nodeType === 3) target = target.parentNode;
                    const targetEl = target.closest ? target.closest('.bubble-word') : null;
                    if(targetEl) {
                        const clickedB = this.bubbles.find(b => b.el === targetEl);
                        if(!clickedB) return;
                        
                        if (clickedB.snapped) {
                            this.unsnap(clickedB);
                            return;
                        }
                        
                        this.dragB = clickedB;
                        const r = clickedB.el.getBoundingClientRect();
                        this.dragOff = { x: e.clientX - r.left, y: e.clientY - r.top };
                        clickedB.el.classList.add('dragging');
                        clickedB.vx = 0; clickedB.vy = 0;
                        
                        clickedB.startX = e.clientX;
                        clickedB.startY = e.clientY;
                        clickedB.isClick = true;
                    }
                });`;
code = code.replace(pointerdownRegex, newPointerdown);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Restored robust pointer events.");
