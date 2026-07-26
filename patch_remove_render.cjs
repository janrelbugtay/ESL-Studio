const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(
    /onclick="window.renameTeam\(\$\{t.id\}\); window.renderLobbyTeams\(\);"/g,
    `onclick="window.renameTeam(\${t.id});"`
);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched rename onclick");
