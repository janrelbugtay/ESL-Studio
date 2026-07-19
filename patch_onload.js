import fs from 'fs';
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace("Game.showScreen('screen-menu'); };", "Game.showScreen('screen-loading'); };");
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched onload");
