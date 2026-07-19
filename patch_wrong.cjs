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
                
                let xMark = b.el.querySelector('.wrong-x');
                if (!xMark) {
                    xMark = document.createElement('div');
                    xMark.className = 'wrong-x absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-red-500 font-black z-20 pointer-events-none drop-shadow-md opacity-0 transition-opacity duration-200';
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
                
                // Force a temporary fast speed
                b.isError = true;
                b.vy = -12; b.vx = (Math.random()-0.5)*20;
                
                setTimeout(() => {
                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                    b.isError = false;
                    if(xMark) xMark.style.opacity = '0';
                }, 800);
                
                this.checkComboEffects();
            },`;

const newWrong = `            wrong(b, slot) {
                if (slot) {
                    b.snapped = true; // Temporary snap
                    b.el.style.transform = 'none';
                    b.el.style.position = 'relative';
                    b.el.style.left = 'auto';
                    b.el.style.top = 'auto';
                    b.el.classList.add('snapped');
                    slot.el.appendChild(b.el);
                    
                    slot.el.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                    slot.el.style.borderColor = '#ef4444';
                }
                
                Audio.wrong(); Mascot.react('sad');
                this.combo = 0; this.mistakes++; this.updateScore();
                
                // Visual feedback
                b.el.style.borderColor = '#ef4444';
                b.el.style.color = '#ef4444';
                b.shakeTime = 400; // 400ms shake
                
                let xMark = b.el.querySelector('.wrong-x');
                if (!xMark) {
                    xMark = document.createElement('div');
                    xMark.className = 'wrong-x absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-red-500 font-black z-20 pointer-events-none drop-shadow-md opacity-0 transition-opacity duration-200';
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
                
                if (!slot) {
                    b.isError = true;
                    b.vy = -12; b.vx = (Math.random()-0.5)*20;
                }
                
                setTimeout(() => {
                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                    b.isError = false;
                    if(xMark) xMark.style.opacity = '0';
                    
                    if (slot) {
                        slot.el.style.backgroundColor = '';
                        slot.el.style.borderColor = '';
                        
                        b.snapped = false;
                        b.el.classList.remove('snapped');
                        b.el.style.position = 'absolute';
                        const area = document.getElementById('physics-area');
                        area.appendChild(b.el);
                        
                        const sRect = slot.el.getBoundingClientRect();
                        const aRect = area.getBoundingClientRect();
                        b.x = sRect.left - aRect.left;
                        b.y = sRect.top - aRect.top;
                        b.vy = -12; b.vx = (Math.random()-0.5)*20;
                    }
                }, 800);
                
                this.checkComboEffects();
            },`;

html = html.replace(oldWrong, newWrong);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched wrong placement logic");
