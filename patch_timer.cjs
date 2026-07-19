const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldTimer = `            startTimer(seconds) {
                clearInterval(this.timerInterval);
                const ring = document.getElementById('ui-timer-ring');
                const text = document.getElementById('ui-timer-text');
                
                document.getElementById('game-body').style.animation = 'none';
                ring.style.stroke = '#4ade80'; // Green
                
                if(seconds === 0 || !seconds) {
                    this.timerTotal = 0; text.innerText = '∞';
                    ring.style.strokeDashoffset = '0';
                    return;
                }`;

const newTimer = `            startTimer(seconds) {
                clearInterval(this.timerInterval);
                const ring = document.getElementById('ui-timer-ring');
                const text = document.getElementById('ui-timer-text');
                
                document.getElementById('game-body').style.animation = 'none';
                ring.style.stroke = '#4ade80'; // Green
                
                let enabled = true;
                if (window.Storage && Storage.data && Storage.data.profile && Storage.data.profile.settings) {
                    enabled = Storage.data.profile.settings.timerEnabled !== false;
                }
                
                if(seconds === 0 || !seconds || !enabled) {
                    this.timerTotal = 0; text.innerText = '∞';
                    ring.style.strokeDashoffset = '0';
                    return;
                }`;

html = html.replace(oldTimer, newTimer);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched timer logic");
