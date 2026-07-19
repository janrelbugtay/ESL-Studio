const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldStartTeams = `                // Classroom scores
                if(this.classroomMode) {
                    document.getElementById('score-blue').innerText = '0';
                    document.getElementById('score-red').innerText = '0';
                }`;

const newStartTeams = `                // Classroom scores
                if(this.classroomMode) {
                    window.teamsData.forEach(t => t.score = 0);
                    if (typeof renderTeams === 'function') renderTeams();
                    const container = document.getElementById('teams-container');
                    if (container) container.style.display = 'flex';
                } else {
                    const container = document.getElementById('teams-container');
                    if (container) container.style.display = 'none';
                }`;

html = html.replace(oldStartTeams, newStartTeams);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Fixed start() team score reset and visibility");
