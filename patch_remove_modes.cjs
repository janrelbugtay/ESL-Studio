const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldModes = `                <!-- Modes -->
                <div class="flex flex-col md:flex-row gap-4 mb-6 justify-center p-1">
                    <!-- 1 Player -->
                    <button onclick="Game.selectMode(false)" id="btn-mode-1" class="flex-1 p-4 md:p-6 rounded-3xl border-4 transition-all hover:scale-105 btn-premium bg-white">
                        <div class="text-4xl md:text-5xl mb-2">👤</div>
                        <div class="text-lg md:text-xl font-black text-gray-800">1 PLAYER</div>
                        <div class="text-xs md:text-sm font-bold text-gray-500 mt-1 uppercase">Solo practice</div>
                    </button>
                    
                    <!-- Classroom -->
                    <button onclick="Game.selectMode(true)" id="btn-mode-2" class="flex-1 p-4 md:p-6 rounded-3xl border-4 transition-all hover:scale-105 btn-premium bg-white">
                        <div class="text-4xl md:text-5xl mb-2">👥</div>
                        <div class="text-lg md:text-xl font-black text-gray-800">MULTIPLAYER</div>
                        <div class="text-xs md:text-sm font-bold text-gray-500 mt-1 uppercase">Play with friends</div>
                    </button>
                </div>`;

const oldTeamsPanel = `                <!-- Teams Panel (Only show if Classroom is selected) -->
                <div id="lobby-teams-panel" class="bg-blue-50 rounded-3xl p-4 md:p-6 border-2 border-blue-200 mb-2 text-left hidden shadow-inner">
                    <div class="flex justify-between items-center mb-4">
                        <span class="font-bold text-lg md:text-xl text-blue-800 flex items-center gap-2"><span>🏆</span> Players (<span id="lobby-team-count">2</span>)</span>
                        <button onclick="window.addTeam()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl font-bold shadow-md transition-transform hover:scale-105 active:scale-95 text-sm md:text-base border-b-4 border-blue-700 active:border-b-0 active:translate-y-1">➕ Add Player</button>
                    </div>
                    <div id="lobby-teams-list" class="flex flex-wrap gap-2 md:gap-3">
                        <!-- teams rendered here -->
                    </div>
                    <div class="mt-4 text-sm font-bold text-blue-500/70 text-center italic">
                        Tip: Click a player name to edit it!
                    </div>
                </div>`;

const newPlayersPanel = `                <!-- Players Panel -->
                <div id="lobby-teams-panel" class="bg-blue-50 rounded-3xl p-4 md:p-6 border-2 border-blue-200 mb-6 text-left shadow-inner">
                    <div class="flex justify-between items-center mb-4">
                        <span class="font-bold text-lg md:text-xl text-blue-800 flex items-center gap-2"><span>👤</span> Number of players: <span id="lobby-team-count">1</span></span>
                        <button onclick="window.addTeam()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl font-bold shadow-md transition-transform hover:scale-105 active:scale-95 text-sm md:text-base border-b-4 border-blue-700 active:border-b-0 active:translate-y-1">➕ Add Player</button>
                    </div>
                    <div id="lobby-teams-list" class="flex flex-wrap gap-2 md:gap-3">
                        <!-- teams rendered here -->
                    </div>
                    <div class="mt-4 text-sm font-bold text-blue-500/70 text-center italic">
                        Tip: Click a player name to edit it!
                    </div>
                </div>`;

code = code.replace(oldModes, '');
code = code.replace(oldTeamsPanel, newPlayersPanel);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched HTML successfully");
