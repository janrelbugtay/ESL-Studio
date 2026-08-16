const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const unsnapRegex = /unsnap\(b\)\s*\{[\s\S]*?b\.vy = -5;\n\s*\}/;

const newUnsnap = `unsnap(b) {
                if(!b.snapped) return;
                const slot = this.slots.find(s => s.el.contains(b.el));
                if (slot && slot.filled) {
                    slot.filled = false;
                    // Only decrement placed if this bubble was actually marked correct
                    // In our game, wrong bubbles don't increment placed
                    if (!b.isError) {
                        this.placed--;
                    }
                }
                b.snapped = false;
                b.el.classList.remove('snapped');
                b.el.style.position = 'absolute';
                const area = document.getElementById('physics-area');
                area.appendChild(b.el);
                
                const aRect = area.getBoundingClientRect();
                b.x = aRect.width / 2;
                b.y = aRect.height / 2;
                b.vx = (Math.random()-0.5)*10;
                b.vy = -5;
            }`;

code = code.replace(unsnapRegex, newUnsnap);
fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched unsnap()");
