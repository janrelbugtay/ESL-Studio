const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const wrongRegex = /wrong\(b,\s*slot\)\s*\{[\s\S]*?updateScore\(\);\n\s*\}\n\s*updateHints\(\)/;

const oldWrongStr = `            wrong(b, slot) {
                if (slot) {
                    slot.el.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                    slot.el.style.borderColor = '#ef4444';
                    
                    let xMark = slot.el.querySelector('.wrong-x-slot');
                    if (!xMark) {
                        xMark = document.createElement('div');
                        xMark.className = 'wrong-x-slot absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-red-500 font-black z-20 pointer-events-none drop-shadow-md';
                        xMark.innerText = '❌';
                        slot.el.appendChild(xMark);
                    }
                    
                    setTimeout(() => {
                        slot.el.style.backgroundColor = '';
                        slot.el.style.borderColor = '';
                        if(xMark) xMark.remove();
                    }, 800);
                }
                
                Audio.wrong(); Mascot.react('sad');
                this.combo = 0; this.mistakes++; this.updateScore();
                
                b.el.style.borderColor = '#ef4444';
                b.el.style.color = '#ef4444';
                b.shakeTime = 400; // 400ms shake
                b.isError = true;
                b.vy = -12; b.vx = (Math.random()-0.5)*20;
                
                setTimeout(() => {
                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                    b.isError = false;
                }, 800);
                
                this.checkComboEffects();
            },`;

const newWrongStr = `            wrong(b, slot) {
                if (!slot) return;
                
                // 1. Temporarily snap it to the slot so it appears in the box
                b.snapped = true;
                slot.filled = true;
                
                b.el.style.transform = 'none'; 
                b.el.style.position = 'relative';
                b.el.style.left = 'auto'; 
                b.el.style.top = 'auto';
                b.el.classList.add('snapped');
                slot.el.innerHTML = ''; 
                slot.el.appendChild(b.el);

                // 2. Mark it wrong visually
                slot.el.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                slot.el.style.borderColor = '#ef4444';
                b.el.style.borderColor = '#ef4444';
                b.el.style.color = '#ef4444';
                
                let xMark = document.createElement('div');
                xMark.className = 'wrong-x-slot absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-red-500 font-black z-20 pointer-events-none drop-shadow-md';
                xMark.innerText = '❌';
                slot.el.appendChild(xMark);
                
                Audio.wrong(); Mascot.react('sad');
                this.combo = 0; this.mistakes++; this.updateScore();
                
                b.shakeTime = 800; // shake the whole time it's in the slot
                b.isError = true;
                
                // 3. Wait 800ms, then pop it back out
                setTimeout(() => {
                    if (xMark) xMark.remove();
                    slot.el.style.backgroundColor = '';
                    slot.el.style.borderColor = '';
                    
                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                    b.isError = false;
                    
                    // Only unsnap if user hasn't already pulled it out manually
                    if (b.snapped && b.el.parentElement === slot.el) {
                        this.unsnap(b);
                        // Add an extra bounce when it pops out
                        b.vy = -15; 
                        b.vx = (Math.random()-0.5)*20;
                    }
                }, 800);
                
                this.checkComboEffects();
            },`;

// Read the file and replace the whole wrong() method.
// Let's use a simpler replace strategy: string search and slice.

let code2 = code.substring(0, code.indexOf('wrong(b, slot) {'));
let code3 = code.substring(code.indexOf('updateHints() {'));

code = code2 + newWrongStr + "\n            " + code3;
fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched wrong()");
