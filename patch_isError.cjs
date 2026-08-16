const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldTimeout = `                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                    b.el.style.background = ''; b.el.classList.remove('wrong-shake');
                    b.isError = false;
                    
                    // Only unsnap if user hasn't already pulled it out manually
                    if (b.snapped && b.el.parentElement === slot.el) {
                        this.unsnap(b);
                        // Add an extra bounce when it pops out
                        b.vy = -15; 
                        b.vx = (Math.random()-0.5)*20;
                    }`;

const newTimeout = `                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                    b.el.style.background = ''; b.el.classList.remove('wrong-shake');
                    
                    // Only unsnap if user hasn't already pulled it out manually
                    if (b.snapped && b.el.parentElement === slot.el) {
                        this.unsnap(b);
                        // Add an extra bounce when it pops out
                        b.vy = -15; 
                        b.vx = (Math.random()-0.5)*20;
                    }
                    
                    b.isError = false;`;

code = code.replace(oldTimeout, newTimeout);
fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched isError order.");
