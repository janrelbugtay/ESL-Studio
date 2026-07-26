const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(
    /<h2 class="text-3xl font-black text-gray-800 text-center">Rename Team<\/h2>/g,
    `<h2 class="text-3xl font-black text-gray-800 text-center">Rename Player</h2>`
);
code = code.replace(
    /placeholder="Team Name"/g,
    `placeholder="Player Name"`
);

// We need to also make sure that renameTeam updates the lobby
code = code.replace(
    /team.name = newName.trim\(\);\n\s*renderTeams\(\);/g,
    `team.name = newName.trim();\n                    renderTeams();\n                    if (typeof window.renderLobbyTeams === 'function') window.renderLobbyTeams();`
);

// Also attach to window object explicitly
code = code.replace(
    /function renameTeam\(id\) \{/g,
    `window.renameTeam = function(id) {`
);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched rename modal and function");
