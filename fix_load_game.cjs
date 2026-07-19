const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace("Game.start('cat_1');", "Game.openLobby('cat_1');");

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Fixed LOAD_GAME to open lobby instead of starting directly");
