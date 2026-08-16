const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const pdReplace = `
                doc.addEventListener('pointerdown', e => {
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
                        const cx = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                        const cy = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
                        
                        this.dragOff = { x: cx - r.left, y: cy - r.top };
                        clickedB.el.classList.add('dragging');
                        clickedB.vx = 0; clickedB.vy = 0;
                        
                        clickedB.startX = cx;
                        clickedB.startY = cy;
                        clickedB.isClick = true;
                    }
                });
`;

let start = code.indexOf("doc.addEventListener('pointerdown', e => {");
let end = code.indexOf("window.addEventListener('pointermove', e => {");
if (start !== -1 && end !== -1) {
    let before = code.substring(0, start);
    let after = code.substring(end);
    code = before + pdReplace + "                " + after;
    fs.writeFileSync('public/bubble-sentence.html', code);
    console.log("Patched pointerdown!");
} else {
    console.log("Could not find pointerdown.");
}
