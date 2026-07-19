const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const scriptToAdd = `
        window.renderLobbyTeams = function() {
            const list = document.getElementById('lobby-teams-list');
            const countLabel = document.getElementById('lobby-team-count');
            if (!list || !countLabel) return;
            
            countLabel.innerText = window.teamsData.length;
            
            let html = '';
            window.teamsData.forEach(t => {
                const colorMap = {
                    blue: { bg: 'bg-blue-500 text-white', border: 'border-blue-600' },
                    red: { bg: 'bg-red-500 text-white', border: 'border-red-600' },
                    green: { bg: 'bg-green-500 text-white', border: 'border-green-600' },
                    yellow: { bg: 'bg-yellow-400 text-yellow-900', border: 'border-yellow-500' },
                    purple: { bg: 'bg-purple-500 text-white', border: 'border-purple-600' },
                    pink: { bg: 'bg-pink-500 text-white', border: 'border-pink-600' }
                };
                const c = colorMap[t.color] || colorMap.blue;
                
                html += \`
                    <button onclick="window.renameTeam(\${t.id}); window.renderLobbyTeams();" class="px-4 py-2 rounded-xl font-bold border-b-4 transition-transform hover:translate-y-1 active:translate-y-2 active:border-b-0 \${c.bg} \${c.border} shadow-sm">
                        \${t.name} ✏️
                    </button>
                \`;
            });
            list.innerHTML = html;
        };
`;

html = html.replace('function renderTeams() {', scriptToAdd + '\n        function renderTeams() {');

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched renderLobbyTeams");
