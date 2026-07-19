import fs from 'fs';
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace("Game.showScreen('screen-loading'); };", "Game.showScreen('screen-loading'); window.parent.postMessage({type: 'IFRAME_READY'}, '*'); };");
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched ready");
