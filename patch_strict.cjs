const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldPointerUp = `                        if (clickedB.isClick) {
                            // First, see if it matches the STRICT next slot
                            const nextI = this.slots.findIndex(s => !s.filled);
                            let matched = false;
                            // Clean the text from the element (remove the ❌ if it's there)
                            // We use the word property instead of innerText
                            const wordText = clickedB.wordText.toLowerCase();
                            
                            if (nextI !== -1 && this.slots[nextI].w === wordText) {
                                this.correct(clickedB, this.slots[nextI]);
                                matched = true;
                            } else {
                                // If not the next slot, maybe it belongs in ANY empty slot? 
                                const anyMatch = this.slots.find(s => !s.filled && s.w === wordText);
                                if (anyMatch) {
                                    this.correct(clickedB, anyMatch);
                                    matched = true;
                                }
                            }
                            
                            if (!matched && nextI !== -1) {
                                this.wrong(clickedB, this.slots[nextI]);
                            }
                        } else {`;

const newPointerUp = `                        if (clickedB.isClick) {
                            const nextI = this.slots.findIndex(s => !s.filled);
                            const wordText = clickedB.wordText.toLowerCase();
                            
                            if (nextI !== -1) {
                                if (this.slots[nextI].w === wordText) {
                                    this.correct(clickedB, this.slots[nextI]);
                                } else {
                                    this.wrong(clickedB, this.slots[nextI]);
                                }
                            }
                        } else {`;

html = html.replace(oldPointerUp, newPointerUp);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched strict checking for clicks");
