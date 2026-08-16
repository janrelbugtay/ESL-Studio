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

const replacement = targetStr + `
                    
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

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacement);
    fs.writeFileSync('public/bubble-sentence.html', code);
    console.log("Patched push!");
} else {
    console.log("Could not find push string.");
}
