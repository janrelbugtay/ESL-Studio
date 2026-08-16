const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const wrongInBox = `
            wrong(b, slot) {
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

                // Play snap effect so they know it landed in the box
                Audio.snap();
                const r = slot.el.getBoundingClientRect();
                Particles.spawn(r.left + r.width/2, r.top + r.height/2, 20, '#ef4444');

                // 2. Mark it wrong visually
                slot.el.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                slot.el.style.borderColor = '#ef4444';
                b.el.style.borderColor = '#ef4444';
                b.el.style.color = '#7f1d1d';
                b.el.style.background = 'radial-gradient(circle at 30% 30%, #fecaca, #f87171)';
                
                let xMark = document.createElement('div');
                xMark.className = 'wrong-x-mark';
                xMark.innerText = '❌';
                // Append X to the bubble itself so it's guaranteed to be visible and centered!
                b.el.appendChild(xMark);
                
                setTimeout(() => Audio.wrong(), 200); // Play wrong sound right after snap
                Mascot.react('sad');
                this.combo = 0; this.mistakes++; this.updateScore();
                
                b.el.classList.add('wrong-shake'); // CSS shake
                b.isError = true;
                
                // 3. Wait 800ms, then pop it back out
                setTimeout(() => {
                    if (xMark) xMark.remove();
                    slot.el.style.backgroundColor = '';
                    slot.el.style.borderColor = '';
                    
                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                    b.el.style.background = ''; b.el.classList.remove('wrong-shake');
                    
                    // Only unsnap if user hasn't already pulled it out manually
                    if (b.snapped && b.el.parentElement === slot.el) {
                        this.unsnap(b);
                        // Add an extra bounce when it pops out
                        b.vy = -15; 
                        b.vx = (Math.random()-0.5)*20;
                    }
                    
                    b.isError = false;
                }, 800);
                
                this.checkComboEffects();
            },
`;

code = code.replace(/wrong\(b, slot\) \{[\s\S]*?this\.checkComboEffects\(\);\s*\},/, wrongInBox.trim() + ",");

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched wrong in box");
