const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldWrong = `                // Visual feedback
                b.el.style.borderColor = '#ef4444';
                b.el.style.color = '#ef4444';
                b.shakeTime = 400; // 400ms shake
                
                // Force a temporary fast speed
                b.isError = true;
                b.vy = -12; b.vx = (Math.random()-0.5)*20;
                
                setTimeout(() => {
                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                    b.isError = false;
                }, 500);`;

const newWrong = `                // Visual feedback
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
                }, 800);`;

html = html.replace(oldWrong, newWrong);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched wrong properly");
