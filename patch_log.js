import fs from 'fs';
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');
html = html.replace("if (e.data.type === 'LOAD_GAME') {", "if (e.data.type === 'LOAD_GAME') { console.log('RECEIVED LOAD_GAME', e.data.data);");
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched log");
