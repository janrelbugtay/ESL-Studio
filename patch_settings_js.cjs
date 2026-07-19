const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const settingsJs = `        const Settings = {
            update(key, val) {
                if(!Storage.data.profile.settings) Storage.data.profile.settings = { volume: 50, bubbleSpeed: 1, bubbleSize: 1, timerEnabled: true, teamsEnabled: false };
                if (key === 'volume') {
                    Storage.data.profile.settings.volume = parseInt(val);
                } else if (key === 'bubbleSpeed') {
                    Storage.data.profile.settings.bubbleSpeed = parseFloat(val);
                } else if (key === 'bubbleSize') {
                    Storage.data.profile.settings.bubbleSize = parseFloat(val);
                    // Live update bubbles
                    document.querySelectorAll('.bubble-word').forEach(b => {
                        b.style.transform = \`scale(\${parseFloat(val)})\`;
                    });
                } else if (key === 'timerEnabled') {
                    Storage.data.profile.settings.timerEnabled = val;
                } else if (key === 'teamsEnabled') {
                    Storage.data.profile.settings.teamsEnabled = val;
                    Game.toggleClassroomMode(val);
                } else if (key === 'theme') {
                    Storage.setTheme(val);
                }
                Storage.save();
            },
            apply() {
                if(!Storage.data.profile.settings) return;
                const s = Storage.data.profile.settings;
                
                document.getElementById('setting-volume').value = s.volume || 50;
                document.getElementById('ui-volume-val').innerText = (s.volume || 50) + '%';
                
                document.getElementById('setting-theme').value = Storage.data.profile.currentTheme || 'theme-sky';
                
                document.getElementById('setting-speed').value = s.bubbleSpeed || 1;
                document.getElementById('ui-speed-val').innerText = (s.bubbleSpeed || 1) + 'x';
                
                document.getElementById('setting-size').value = s.bubbleSize || 1;
                document.getElementById('ui-size-val').innerText = (s.bubbleSize || 1) + 'x';
                
                document.getElementById('setting-timer').checked = s.timerEnabled !== false;
                document.getElementById('setting-teams').checked = !!s.teamsEnabled;
                
                Game.toggleClassroomMode(!!s.teamsEnabled);
                Storage.setTheme(Storage.data.profile.currentTheme || 'theme-sky');
            }
        };`;

html = html.replace('const UI = {', settingsJs + '\n\n        const UI = {');

// Inject Settings.apply() into Game.init()
html = html.replace('UI.updateProfile();', 'UI.updateProfile(); Settings.apply();');

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched settings JS");
