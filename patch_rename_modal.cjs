const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// Inject a custom modal for renaming into the body
const modalHtml = `
    <!-- Custom Prompt Modal for Renaming Teams -->
    <div id="modal-rename-team" class="fixed inset-0 bg-gray-900/80 z-[100] hidden items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform scale-100 flex flex-col gap-6 border-8 border-gray-100">
            <h2 class="text-3xl font-black text-gray-800 text-center">Rename Team</h2>
            <input type="text" id="rename-team-input" class="w-full px-6 py-4 text-2xl font-bold rounded-2xl border-4 border-gray-200 focus:border-blue-500 focus:outline-none text-center" placeholder="Team Name">
            <div class="flex gap-4 mt-4">
                <button onclick="document.getElementById('modal-rename-team').style.display='none'; document.getElementById('modal-rename-team').classList.add('hidden');" class="flex-1 px-6 py-4 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 text-xl transition-colors">Cancel</button>
                <button id="rename-team-save-btn" class="flex-1 px-6 py-4 rounded-full font-bold text-white bg-blue-500 hover:bg-blue-600 text-xl transition-colors shadow-lg shadow-blue-500/30">Save</button>
            </div>
        </div>
    </div>
`;

html = html.replace('<!-- End Modals -->', modalHtml + '\n    <!-- End Modals -->');
if (!html.includes('id="modal-rename-team"')) {
    html = html.replace('</body>', modalHtml + '\n</body>');
}

// Update the script to use the custom modal
const oldRenameTeam = `        function renameTeam(id) {
            const team = window.teamsData.find(t => t.id === id);
            if (!team) return;
            const newName = prompt("Enter new team name:", team.name);
            if (newName && newName.trim()) {
                team.name = newName.trim();
                renderTeams();
            }
        }`;

const newRenameTeam = `        function renameTeam(id) {
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

html = html.replace(oldRenameTeam, newRenameTeam);

// Verify toggleSound
const oldToggleSound = `        function toggleSound() {
            window.isSoundMuted = !window.isSoundMuted;
            document.getElementById('sound-toggle-btn').innerText = window.isSoundMuted ? '🔇' : '🔊';
            if (typeof Audio !== 'undefined' && Audio.toggleSfx) {
                Audio.toggleSfx(!window.isSoundMuted);
            }
        }`;

const newToggleSound = `        window.toggleSound = function() {
            window.isSoundMuted = !window.isSoundMuted;
            const btn = document.getElementById('sound-toggle-btn');
            if (btn) btn.innerText = window.isSoundMuted ? '🔇' : '🔊';
            
            if (typeof Audio !== 'undefined' && Audio.toggleSfx) {
                Audio.toggleSfx(!window.isSoundMuted);
                Audio.sfxEnabled = !window.isSoundMuted; // Hard set just in case
            }
        };`;

html = html.replace(oldToggleSound, newToggleSound);

// Replace any missing toggleSound mappings
html = html.replace('onclick="toggleSound()"', 'onclick="window.toggleSound()"');

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched rename modal and sound toggle");
