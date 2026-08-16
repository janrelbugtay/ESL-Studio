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

const newCode = targetStr + `
                    
                    // Bind pointerdown directly to the element to avoid pointer-events bubbling bugs on mobile
                    el.addEventListener('pointerdown', e => {
                        e.stopPropagation();
                        // Also optionally prevent default to stop scrolling, but touch-action:none handles that
                        const clickedB = this.bubbles.find(bb => bb.el === el);
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
                    });
`;
code = code.replace(targetStr, newCode);

// Remove the pointerdown from doc in setupDrag
const removeDocPointerdownRegex = /doc\.addEventListener\('pointerdown', e => \{[\s\S]*?\}\n\s*\}\);/g;
code = code.replace(removeDocPointerdownRegex, "// (pointerdown is now bound directly to bubbles)");

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched direct pointer events.");
