const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldUnsnap = `            unsnap(b) {
                if(!b.snapped) return;
                const slot = this.slots.find(s => s.el.contains(b.el));
                if (slot) slot.filled = false;
                b.snapped = false;
                this.placed--;
                b.el.classList.remove('snapped');
                b.el.style.position = 'absolute';`;

const newUnsnap = `            unsnap(b) {
                if(!b.snapped) return;
                const slot = this.slots.find(s => s.el.contains(b.el));
                if (slot && slot.filled) {
                    slot.filled = false;
                    this.placed--;
                }
                b.snapped = false;
                b.el.classList.remove('snapped');
                b.el.style.position = 'absolute';`;

html = html.replace(oldUnsnap, newUnsnap);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched unsnap");
