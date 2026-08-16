const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const wrongInAir = `
            wrong(b, slot) {
                // DO NOT snap into the box. Just show error on the bubble itself!
                
                // Play error sound and Mascot reaction
                Audio.wrong(); Mascot.react('sad');
                this.combo = 0; this.mistakes++; this.updateScore();
                
                // Visual error state on the floating bubble
                b.el.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
                b.el.style.borderColor = '#991b1b';
                b.el.style.color = 'white';
                b.el.classList.add('wrong-shake'); // CSS shake
                
                let xMark = document.createElement('div');
                xMark.className = 'wrong-x-mark';
                xMark.innerText = '❌';
                b.el.appendChild(xMark);
                
                b.isError = true;
                
                // Wait 800ms, then remove error state
                setTimeout(() => {
                    if (xMark) xMark.remove();
                    b.el.style.backgroundColor = '';
                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                    b.el.classList.remove('wrong-shake');
                    
                    b.isError = false;
                }, 800);
                
                this.checkComboEffects();
            },
`;

code = code.replace(/wrong\(b, slot\) \{[\s\S]*?this\.checkComboEffects\(\);\s*\},/, wrongInAir.trim() + ",");

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched wrong in air");
