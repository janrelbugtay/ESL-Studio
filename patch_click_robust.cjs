const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const clickPatch = `
                    // Robust click handler for mobile
                    el.addEventListener('click', e => {
                        e.stopPropagation();
                        const clickedB = this.bubbles.find(bb => bb.el === el);
                        if(!clickedB) return;
                        
                        if (clickedB.snapped) {
                            this.unsnap(clickedB);
                            return;
                        }

                        // Force drop into next slot
                        const nextI = this.slots.findIndex(s => !s.filled);
                        if (nextI !== -1) {
                            if (this.slots[nextI].w === clickedB.wordText.toLowerCase()) {
                                this.correct(clickedB, this.slots[nextI]);
                            } else {
                                this.wrong(clickedB, this.slots[nextI]);
                            }
                        }
                    });
`;

if (!code.includes('el.addEventListener(\'click\'')) {
    code = code.replace(/el\.addEventListener\('pointerdown', e => \{/g, clickPatch + "\n                    el.addEventListener('pointerdown', e => {");
}

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched click robust");
