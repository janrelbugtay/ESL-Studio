const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// The HTML for the screen-setup is roughly:
const setupStart = `<div id="screen-setup" class="screen bg-black/60 backdrop-blur-md justify-center items-center z-40 p-4">`;
const setupContentOld = `
        <div class="glass bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-2xl relative text-center border-4 border-gray-200">
            <button onclick="Game.showScreen('screen-menu')" class="absolute top-6 right-6 text-3xl hover:scale-110 transition-transform">❌</button>
            <h2 class="text-5xl font-black text-gray-800 mb-4 drop-shadow-sm">Game Setup Lobby</h2>

<div class="mb-8 font-bold text-gray-500 text-lg flex justify-center gap-4">
    <div class="bg-gray-100 rounded-full px-4 py-1">Best Score: <span id="lobby-best-score" class="text-blue-600">0</span></div>
    <div class="bg-yellow-100 rounded-full px-4 py-1 text-yellow-700">Stars: <span id="lobby-stars">0</span></div>
</div>
            
            <div class="flex flex-col md:flex-row gap-6 mb-8 justify-center">
                <!-- 1 Player -->
                <button onclick="Game.selectMode(false)" id="btn-mode-1" class="flex-1 p-8 rounded-3xl border-4 transition-all hover:scale-105 btn-premium">
                    <div class="text-6xl mb-4">👤</div>
                    <div class="text-2xl font-black text-gray-800">1 Player</div>
                    <div class="text-sm font-bold text-gray-500 mt-2">Solo practice</div>
                </button>
                
                <!-- Classroom -->
                <button onclick="Game.selectMode(true)" id="btn-mode-2" class="flex-1 p-8 rounded-3xl border-4 transition-all hover:scale-105 btn-premium">
                    <div class="text-6xl mb-4">👥</div>
                    <div class="text-2xl font-black text-gray-800">Classroom</div>
                    <div class="text-sm font-bold text-gray-500 mt-2">Team competition</div>
                </button>
            </div>
            
            <button onclick="Game.startGameFromLobby()" class="btn-premium green w-full py-4 text-2xl font-black shadow-lg">🚀 START GAME</button>
        </div>
`;

const setupContentNew = `
        <div class="glass bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-2xl relative text-center border-4 border-gray-200 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <button onclick="Game.showScreen('screen-menu')" class="absolute top-6 right-6 text-3xl hover:scale-110 transition-transform">❌</button>
            <h2 class="text-5xl font-black text-gray-800 mb-4 drop-shadow-sm">Game Setup Lobby</h2>

            <div class="mb-6 font-bold text-gray-500 text-lg flex justify-center gap-4">
                <div class="bg-gray-100 rounded-full px-4 py-1">Best Score: <span id="lobby-best-score" class="text-blue-600">0</span></div>
                <div class="bg-yellow-100 rounded-full px-4 py-1 text-yellow-700">Stars: <span id="lobby-stars">0</span></div>
            </div>
            
            <!-- Quick Options: Sound, Timer, Speed -->
            <div class="flex flex-wrap justify-center gap-4 mb-8 bg-gray-50 p-4 rounded-3xl border-2 border-gray-100">
                <button id="lobby-sound-btn" onclick="window.toggleSound(); document.getElementById('lobby-sound-btn').innerHTML = window.isSoundMuted ? '🔇 Sound: OFF' : '🔊 Sound: ON';" class="px-4 py-2 rounded-xl font-bold bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-100">🔊 Sound: ON</button>
                
                <div class="flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-white border-2 border-gray-200 text-gray-700">
                    <span>⏱ Timer:</span>
                    <select id="lobby-timer-select" class="bg-transparent outline-none cursor-pointer text-blue-600 font-black">
                        <option value="default">Default</option>
                        <option value="30">30s</option>
                        <option value="60">60s</option>
                        <option value="90">90s</option>
                        <option value="0">Infinite</option>
                    </select>
                </div>

                <div class="flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-white border-2 border-gray-200 text-gray-700">
                    <span>⚡ Speed:</span>
                    <select id="lobby-speed-select" class="bg-transparent outline-none cursor-pointer text-blue-600 font-black" onchange="Settings.update('bubbleSpeed', parseFloat(this.value));">
                        <option value="0.75">Slow</option>
                        <option value="1" selected>Normal</option>
                        <option value="1.5">Fast</option>
                    </select>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-6 mb-8 justify-center">
                <!-- 1 Player -->
                <button onclick="Game.selectMode(false)" id="btn-mode-1" class="flex-1 p-6 rounded-3xl border-4 transition-all hover:scale-105 btn-premium">
                    <div class="text-5xl mb-2">👤</div>
                    <div class="text-xl font-black text-gray-800">1 Player</div>
                    <div class="text-xs font-bold text-gray-500 mt-1">Solo practice</div>
                </button>
                
                <!-- Classroom -->
                <button onclick="Game.selectMode(true)" id="btn-mode-2" class="flex-1 p-6 rounded-3xl border-4 transition-all hover:scale-105 btn-premium">
                    <div class="text-5xl mb-2">👥</div>
                    <div class="text-xl font-black text-gray-800">Classroom</div>
                    <div class="text-xs font-bold text-gray-500 mt-1">Team competition</div>
                </button>
            </div>
            
            <!-- Teams Configuration Panel (Hidden in 1 Player mode) -->
            <div id="lobby-teams-panel" class="hidden mb-8 bg-blue-50 p-6 rounded-3xl border-4 border-blue-100">
                <h3 class="text-2xl font-black text-blue-800 mb-4">Teams Setup</h3>
                <div class="flex items-center justify-center gap-4 mb-4">
                    <button onclick="if(window.teamsData.length > 2) { window.teamsData.pop(); renderLobbyTeams(); renderTeams(); }" class="bg-white hover:bg-gray-100 text-gray-800 font-black w-10 h-10 rounded-full shadow-sm">-</button>
                    <span class="text-xl font-bold text-gray-700"><span id="lobby-team-count">2</span> Teams</span>
                    <button onclick="if(window.teamsData.length < 6) { addTeam(); renderLobbyTeams(); }" class="bg-white hover:bg-gray-100 text-gray-800 font-black w-10 h-10 rounded-full shadow-sm">+</button>
                </div>
                <div id="lobby-teams-list" class="flex flex-wrap gap-2 justify-center">
                    <!-- Injected via JS -->
                </div>
                <p class="text-sm text-blue-600 mt-4 font-bold">Click a team to rename it</p>
            </div>
            
            <button onclick="Game.startGameFromLobby()" class="btn-premium green w-full py-4 text-2xl font-black shadow-lg">🚀 START GAME</button>
        </div>
`;

html = html.replace(setupContentOld, setupContentNew);

// Add the renderLobbyTeams logic inside Game.selectMode
const oldSelectMode = `            selectMode(isClassroom) {
                this.classroomMode = isClassroom;
                
                document.getElementById('btn-mode-1').classList.toggle('border-blue-500', !isClassroom);
                document.getElementById('btn-mode-1').classList.toggle('border-gray-200', isClassroom);
                
                document.getElementById('btn-mode-2').classList.toggle('border-blue-500', isClassroom);
                document.getElementById('btn-mode-2').classList.toggle('border-gray-200', !isClassroom);
            },`;

const newSelectMode = `            selectMode(isClassroom) {
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

html = html.replace(oldSelectMode, newSelectMode);

// Hook up the custom timer and sync the Sound button state
const oldShowScreen = `            showScreen(id) {
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                const s = document.getElementById(id);
                if(s) s.classList.add('active');
            },`;

const newShowScreen = `            showScreen(id) {
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                const s = document.getElementById(id);
                if(s) s.classList.add('active');
                
                if (id === 'screen-setup') {
                    const soundBtn = document.getElementById('lobby-sound-btn');
                    if (soundBtn) {
                        soundBtn.innerHTML = window.isSoundMuted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
                    }
                    if (Storage && Storage.data && Storage.data.profile && Storage.data.profile.settings) {
                        const speed = Storage.data.profile.settings.bubbleSpeed || 1;
                        const speedSel = document.getElementById('lobby-speed-select');
                        if (speedSel) speedSel.value = speed;
                    }
                }
            },`;

html = html.replace(oldShowScreen, newShowScreen);

// Start game override timer
const oldStartTimer = `                if(seconds === 0 || !seconds || !timerEnabled) {`;
const newStartTimer = `                const lobbyTimer = document.getElementById('lobby-timer-select');
                if (lobbyTimer && lobbyTimer.value !== 'default') {
                    seconds = parseInt(lobbyTimer.value);
                }
                if(seconds === 0 || !seconds || !timerEnabled) {`;
html = html.replace(oldStartTimer, newStartTimer);

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched lobby");
