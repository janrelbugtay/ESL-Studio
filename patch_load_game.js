import fs from 'fs';
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace("Game.showScreen('screen-menu');\n            }", "Game.start('cat_1');\n            }");
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched LOAD_GAME");
