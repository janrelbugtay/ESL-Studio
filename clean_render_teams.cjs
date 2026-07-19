const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldRenderTeams = `        function renderTeams() {
            const container = document.getElementById('teams-container');
            if (!container) return;
            
            let html = '';
            window.teamsData.forEach(t => {
                const colorMap = {
                    blue: { bg: 'bg-blue-500/90 hover:bg-blue-400', border: 'border-blue-300' },
                    red: { bg: 'bg-red-500/90 hover:bg-red-400', border: 'border-red-300' },
                    green: { bg: 'bg-green-500/90 hover:bg-green-400', border: 'border-green-300' },
                    yellow: { bg: 'bg-yellow-500/90 hover:bg-yellow-400', border: 'border-yellow-300' },
                    purple: { bg: 'bg-purple-500/90 hover:bg-purple-400', border: 'border-purple-300' },
                    pink: { bg: 'bg-pink-500/90 hover:bg-pink-400', border: 'border-pink-300' }
                };
                const c = colorMap[t.color];
                
                html += \`
                    <div class="flex items-center gap-1 group">
                        <button 
                            onclick="updateTeamScore(\${t.id}, 1)" 
                            oncontextmenu="event.preventDefault(); updateTeamScore(\${t.id}, -1)" 
                            class="glass \${c.bg} text-white px-4 py-2 rounded-full font-black text-xl shadow-lg \${c.border} cursor-pointer transform hover:scale-105 transition-transform flex items-center gap-2">
                            <span ondblclick="event.stopPropagation(); renameTeam(\${t.id})">\${t.name}</span>: <span id="score-team\${t.id}">\${t.score}</span>
                        </button>
                        <button onclick="renameTeam(\${t.id})" class="opacity-70 hover:opacity-100 bg-white/50 hover:bg-white rounded-full p-1 shadow-sm transition-opacity" title="Rename Team">✏️</button>
                    </div>
                \`;
            });
            
            // Add the "Add Team" button
            html += \`<button onclick="addTeam()" class="glass bg-white/50 hover:bg-white/80 text-gray-700 px-3 py-2 rounded-full font-bold shadow-sm transition-colors text-sm">+</button>\`;
            
            container.innerHTML = html;
        }`;

const newRenderTeams = `        function renderTeams() {
            const container = document.getElementById('teams-container');
            if (!container) return;
            
            let html = '';
            window.teamsData.forEach(t => {
                const colorMap = {
                    blue: { bg: 'bg-blue-500/90 hover:bg-blue-400', border: 'border-blue-300' },
                    red: { bg: 'bg-red-500/90 hover:bg-red-400', border: 'border-red-300' },
                    green: { bg: 'bg-green-500/90 hover:bg-green-400', border: 'border-green-300' },
                    yellow: { bg: 'bg-yellow-500/90 hover:bg-yellow-400', border: 'border-yellow-300' },
                    purple: { bg: 'bg-purple-500/90 hover:bg-purple-400', border: 'border-purple-300' },
                    pink: { bg: 'bg-pink-500/90 hover:bg-pink-400', border: 'border-pink-300' }
                };
                const c = colorMap[t.color];
                
                html += \`
                    <div class="flex items-center gap-1 group">
                        <button 
                            onclick="updateTeamScore(\${t.id}, 1)" 
                            oncontextmenu="event.preventDefault(); updateTeamScore(\${t.id}, -1)" 
                            class="glass \${c.bg} text-white px-4 py-2 rounded-full font-black text-xl shadow-lg \${c.border} cursor-pointer transform hover:scale-105 transition-transform flex items-center gap-2">
                            <span>\${t.name}</span>: <span id="score-team\${t.id}">\${t.score}</span>
                        </button>
                    </div>
                \`;
            });
            container.innerHTML = html;
            
            // Also update lobby teams if visible
            if (typeof window.renderLobbyTeams === 'function') {
                window.renderLobbyTeams();
            }
        }`;

html = html.replace(oldRenderTeams, newRenderTeams);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched renderTeams");
