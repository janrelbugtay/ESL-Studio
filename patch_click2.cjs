const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const replacement = `
                window.addEventListener('pointermove', e => {
                    if(this.dragB) {
                        const bnds = document.getElementById('physics-area').getBoundingClientRect();
                        // Support touch coordinates if clientX is missing (rare but safe)
                        const cx = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                        const cy = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
                        
                        let newX = cx - bnds.left - this.dragOff.x;
                        let newY = cy - bnds.top - this.dragOff.y;
                        this.dragB.x = newX;
                        this.dragB.y = newY;
                        
                        if(Math.abs(cx - this.dragB.startX) > 40 || Math.abs(cy - this.dragB.startY) > 40) {
                            this.dragB.isClick = false;
                        }
                    }
                }, {passive: false});

                window.addEventListener('pointercancel', e => {
                    if (this.dragB) {
                        this.dragB.el.classList.remove('dragging');
                        this.dragB = null;
                    }
                });

                window.addEventListener('pointerup', e => {
`;

// Replace pointermove block
let start = code.indexOf("window.addEventListener('pointermove', e => {");
let end = code.indexOf("window.addEventListener('pointerup', e => {");
if (start !== -1 && end !== -1) {
    let before = code.substring(0, start);
    let after = code.substring(end + "window.addEventListener('pointerup', e => {".length);
    code = before + replacement + after;
    fs.writeFileSync('public/bubble-sentence.html', code);
    console.log("Patched pointer events!");
} else {
    console.log("Could not find pointer events.");
}
