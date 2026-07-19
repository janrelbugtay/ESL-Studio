import fs from 'fs';
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');
html = html.replace("window.addEventListener('message', e => {\\n            if (e.data.type === 'LOAD_GAME') {", "window.addEventListener('message', e => {\\n            if (!e.data || typeof e.data !== 'object') return;\\n            if (e.data.type === 'LOAD_GAME') {");
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched msg");
