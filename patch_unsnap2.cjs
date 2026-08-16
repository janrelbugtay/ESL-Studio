const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldUnsnap = `unsnap(b) {
                if(!b.snapped) return;
                const slot = this.slots.find(s => s.el.contains(b.el));
                if (slot && slot.filled) {
                    slot.filled = false;
                    this.placed--;
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
                b.vy = (Math.random()-0.5)*10;
                
                if (window.Audio && Audio.click) Audio.click();
            }`;

const newUnsnap = `unsnap(b) {
                if(!b.snapped) return;
                const slot = this.slots.find(s => s.el.contains(b.el));
                if (slot && slot.filled) {
                    slot.filled = false;
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
                b.vy = (Math.random()-0.5)*10;
                
                if (window.Audio && Audio.click) Audio.click();
            }`;

let start = code.indexOf('unsnap(b) {');
let end = code.indexOf('},', start) + 1;
code = code.substring(0, start) + newUnsnap + code.substring(end);
fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched unsnap 2");
