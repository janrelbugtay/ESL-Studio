const fs = require('fs');
const file = 'public/bubble-sentence.html';
let code = fs.readFileSync(file, 'utf8');

const targetRenameTeam = `        window.renameTeam = function(id) {
            const team = window.teamsData.find(t => t.id === id);
            if (!team) return;
            const modal = document.getElementById('modal-rename-team');
            const input = document.getElementById('rename-team-input');
            const saveBtn = document.getElementById('rename-team-save-btn');
            
            input.value = team.name;
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
            input.focus();
            
            saveBtn.onclick = () => {
                const newName = input.value;
                if (newName && newName.trim()) {
                    team.name = newName.trim();
                    renderTeams();
                    if (typeof window.renderLobbyTeams === 'function') window.renderLobbyTeams();
                }
                modal.style.display = 'none';
                modal.classList.add('hidden');
            };
            
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    saveBtn.click();
                } else if (e.key === 'Escape') {
                    modal.style.display = 'none';
                    modal.classList.add('hidden');
                }
            };
        }`;

const newRenameTeam = `        window.renameTeam = function(id) {
            const team = window.teamsData.find(t => t.id === id);
            if (!team) return;
            const modal = document.getElementById('modal-rename-team');
            const input = document.getElementById('rename-team-input');
            const saveBtn = document.getElementById('rename-team-save-btn');
            
            input.value = team.name;
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
            input.focus();
            
            saveBtn.onclick = () => {
                const newName = input.value;
                if (newName && newName.trim()) {
                    // Sanitize input
                    const sanitized = newName.trim().replace(/[&<>'"]/g, 
                        tag => ({
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            "'": '&#39;',
                            '"': '&quot;'
                        }[tag] || tag));
                    team.name = sanitized;
                    if (typeof renderTeams === 'function') renderTeams();
                    if (typeof window.renderLobbyTeams === 'function') window.renderLobbyTeams();
                }
                modal.style.display = 'none';
                modal.classList.add('hidden');
            };
            
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    saveBtn.click();
                } else if (e.key === 'Escape') {
                    modal.style.display = 'none';
                    modal.classList.add('hidden');
                }
            };
        }`;

if (code.includes(targetRenameTeam)) {
    code = code.replace(targetRenameTeam, newRenameTeam);
    fs.writeFileSync(file, code);
    console.log("Patched renameTeam");
} else {
    console.log("targetRenameTeam not found");
}
