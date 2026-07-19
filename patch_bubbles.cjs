const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldBubbles = `            createBubbles() {
                const area = document.getElementById('physics-area');
                area.innerHTML = '';
                const shuffled = [...this.words].sort(()=>Math.random()-0.5);
                const aRect = area.getBoundingClientRect();
                
                shuffled.forEach(w => {
                    const el = document.createElement('div');
                    el.className = 'bubble-word'; el.innerText = w;
                    area.appendChild(el);`;

const newBubbles = `            createBubbles() {
                const area = document.getElementById('physics-area');
                area.innerHTML = '';
                const shuffled = [...this.words].sort(()=>Math.random()-0.5);
                const aRect = area.getBoundingClientRect();
                let sizeMult = 1;
                if (window.Storage && Storage.data && Storage.data.profile && Storage.data.profile.settings) {
                    sizeMult = Storage.data.profile.settings.bubbleSize || 1;
                }
                
                shuffled.forEach(w => {
                    const el = document.createElement('div');
                    el.className = 'bubble-word'; el.innerText = w;
                    el.style.transform = \`scale(\${sizeMult})\`;
                    area.appendChild(el);`;

html = html.replace(oldBubbles, newBubbles);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched bubbles");
