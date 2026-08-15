const fs = require('fs');
const file = 'public/bubble-sentence.html';
let code = fs.readFileSync(file, 'utf8');

const targetAddTeam = `        window.addTeam = function() {
            const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink'];
            const id = window.teamsData.length + 1;
            window.teamsData.push({ id, name: "Player " + id, score: 0, color: colors[(id-1) % colors.length] });
            renderTeams();
        }`;
const newAddTeam = `        window.addTeam = function() {
            const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink'];
            const id = window.teamsData.length > 0 ? Math.max(...window.teamsData.map(t => t.id)) + 1 : 1;
            window.teamsData.push({ id, name: "Player " + id, score: 0, color: colors[(id-1) % colors.length] });
            renderTeams();
            if (typeof window.renderLobbyTeams === 'function') window.renderLobbyTeams();
        }

        window.removeTeam = function(id) {
            if (window.teamsData.length <= 1) return;
            window.teamsData = window.teamsData.filter(t => t.id !== id);
            renderTeams();
            if (typeof window.renderLobbyTeams === 'function') window.renderLobbyTeams();
        }`;

code = code.replace(targetAddTeam, newAddTeam);

const targetRenderLobbyTeams = `                html += \`
                    <button onclick="window.renameTeam(\${t.id});" class="px-4 py-2 rounded-xl font-bold border-b-4 transition-transform hover:translate-y-1 active:translate-y-2 active:border-b-0 \${c.bg} \${c.border} shadow-sm">
                        \${t.name} ✏️
                    </button>
                \`;`;
const newRenderLobbyTeams = `                html += \`
                    <div class="inline-flex items-stretch rounded-xl font-bold border-b-4 transition-transform hover:-translate-y-1 shadow-sm overflow-hidden \${c.bg} \${c.border}">
                        <button onclick="window.renameTeam(\${t.id});" class="px-4 py-2 hover:bg-white/20 active:translate-y-1 flex-1 text-left whitespace-nowrap">
                            \${t.name} ✏️
                        </button>
                        \${window.teamsData.length > 1 ? \`<button onclick="window.removeTeam(\${t.id});" class="px-3 py-2 border-l border-white/30 hover:bg-red-500/80 active:bg-red-600 flex items-center justify-center transition-colors">✖</button>\` : ''}
                    </div>
                \`;`;

code = code.replace(targetRenderLobbyTeams, newRenderLobbyTeams);
fs.writeFileSync(file, code);
