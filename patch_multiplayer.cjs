const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(
    /<div class="text-lg md:text-xl font-black text-gray-800">CLASSROOM<\/div>/,
    `<div class="text-lg md:text-xl font-black text-gray-800">MULTIPLAYER</div>`
);

code = code.replace(
    /<div class="text-xs md:text-sm font-bold text-gray-500 mt-1 uppercase">Team competition<\/div>/,
    `<div class="text-xs md:text-sm font-bold text-gray-500 mt-1 uppercase">Play with friends</div>`
);

code = code.replace(
    /<span>🏆<\/span> Teams \(<span id="lobby-team-count">2<\/span>\)/,
    `<span>🏆</span> Players (<span id="lobby-team-count">2</span>)`
);

code = code.replace(
    /➕ Add Team<\/button>/,
    `➕ Add Player</button>`
);

code = code.replace(
    /Tip: Click a team name to edit it!/,
    `Tip: Click a player name to edit it!`
);

// We should also replace the default naming from "Team 1" to "Player 1"
code = code.replace(
    /{ id: 1, name: "Team 1", score: 0, color: "blue" },/,
    `{ id: 1, name: "Player 1", score: 0, color: "blue" },`
);
code = code.replace(
    /{ id: 2, name: "Team 2", score: 0, color: "red" }/,
    `{ id: 2, name: "Player 2", score: 0, color: "red" }`
);
code = code.replace(
    /name: "Team " \+ id/,
    `name: "Player " + id`
);

// And we can update the modal title: "Rename Team" to "Rename Player"
code = code.replace(
    /<h2 class="text-3xl font-black text-gray-800 mb-6">Rename Team<\/h2>/,
    `<h2 class="text-3xl font-black text-gray-800 mb-6">Rename Player</h2>`
);
code = code.replace(
    /placeholder="Enter team name"/,
    `placeholder="Enter player name"`
);

// And the rename team input
code = code.replace(
    /<div class="text-sm font-bold text-gray-500 mt-2">Team competition<\/div>/,
    `<div class="text-sm font-bold text-gray-500 mt-2">Play with friends</div>`
); // fallback if it was elsewhere


fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched multiplayer mode successfully");
