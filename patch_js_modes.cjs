const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(
    /this.selectMode\(this.classroomMode\); \/\/ Select current mode/,
    `if(typeof window.renderLobbyTeams === 'function') window.renderLobbyTeams();`
);

code = code.replace(
    /startGameFromLobby\(\) \{/,
    `startGameFromLobby() {
                this.classroomMode = window.teamsData && window.teamsData.length > 1;`
);

// We need to disable selectMode or safely replace its content
const oldSelectMode = `            selectMode(isClassroom) {
                this.classroomMode = isClassroom;
                
                document.getElementById('btn-mode-1').classList.toggle('border-blue-500', !isClassroom);
                document.getElementById('btn-mode-1').classList.toggle('border-gray-200', isClassroom);
                
                document.getElementById('btn-mode-2').classList.toggle('border-blue-500', isClassroom);
                document.getElementById('btn-mode-2').classList.toggle('border-gray-200', !isClassroom);
                
                const teamPanel = document.getElementById('lobby-teams-panel');
                if (teamPanel) {
                    if (isClassroom) {
                        teamPanel.classList.remove('hidden');
                        if (typeof window.renderLobbyTeams === 'function') window.renderLobbyTeams();
                    } else {
                        teamPanel.classList.add('hidden');
                    }
                }
            },`;

code = code.replace(oldSelectMode, `            selectMode(isClassroom) {
                // Disabled.
            },`);

// By default there's 2 players. We can change the default to 1 player (Player 1)
const oldTeams = `        window.teamsData = [
            { id: 1, name: "Player 1", score: 0, color: "blue" },
            { id: 2, name: "Player 2", score: 0, color: "red" }
        ];`;

const newTeams = `        window.teamsData = [
            { id: 1, name: "Player 1", score: 0, color: "blue" }
        ];`;
code = code.replace(oldTeams, newTeams);


fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched JS correctly");
