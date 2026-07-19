const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldTransform = "b.el.style.transform = `translate(${b.x}px, ${b.y}px) scale(${b.scaleX}, ${b.scaleY})`;";
const newTransform = `
                        let sizeMult = 1;
                        if (window.Storage && Storage.data && Storage.data.profile && Storage.data.profile.settings) {
                            sizeMult = Storage.data.profile.settings.bubbleSize || 1;
                        }
                        const rot = b.vx * 3;
                        b.el.style.transform = \`translate(\${b.x}px, \${b.y}px) scale(\${b.scaleX * sizeMult}, \${b.scaleY * sizeMult}) rotate(\${rot}deg)\`;`;

html = html.replace(oldTransform, newTransform);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched transform");
