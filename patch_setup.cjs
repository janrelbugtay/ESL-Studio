const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldSetup = `    <!-- Lobby / Setup Screen -->
    <div id="screen-setup" class="screen bg-black/60 backdrop-blur-md justify-center items-center z-40 p-4">
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
    </div>`;

const newSetup = `    <!-- Lobby / Setup Screen -->
    <div id="screen-setup" class="screen bg-black/60 backdrop-blur-md justify-center items-center z-40 p-4">
        <div class="glass bg-white p-6 md:p-8 rounded-[40px] shadow-2xl w-full max-w-2xl relative text-center border-4 border-gray-200 flex flex-col max-h-[90vh]">
            <button onclick="Game.showScreen('screen-menu')" class="absolute top-4 right-4 md:top-6 md:right-6 text-3xl hover:scale-110 transition-transform z-10">❌</button>
            <h2 class="text-4xl md:text-5xl font-black text-gray-800 mb-2 md:mb-4 drop-shadow-sm shrink-0">Game Setup Lobby</h2>
            
            <div class="mb-4 md:mb-6 font-bold text-gray-500 text-sm md:text-lg flex justify-center gap-4 shrink-0">
                <div class="bg-gray-100 rounded-full px-4 py-1">Best Score: <span id="lobby-best-score" class="text-blue-600">0</span></div>
                <div class="bg-yellow-100 rounded-full px-4 py-1 text-yellow-700">Stars: <span id="lobby-stars">0</span></div>
            </div>
            
            <div class="overflow-y-auto custom-scrollbar px-2 pb-4 flex-1">
                <!-- Modes -->
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
                        <div class="text-lg md:text-xl font-black text-gray-800">CLASSROOM</div>
                        <div class="text-xs md:text-sm font-bold text-gray-500 mt-1 uppercase">Team competition</div>
                    </button>
                </div>
                
                <!-- Settings Panel -->
                <div class="bg-gray-50 rounded-3xl p-4 md:p-6 border-2 border-gray-200 mb-6 flex flex-col gap-4 text-left shadow-inner">
                    <div class="flex justify-between items-center bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100">
                        <span class="font-bold text-lg md:text-xl text-gray-700 flex items-center gap-2"><span>🎵</span> Sound Effects</span>
                        <button id="sound-toggle-btn" onclick="window.toggleSound()" class="text-2xl md:text-3xl bg-gray-100 rounded-full shadow-inner border border-gray-200 hover:bg-gray-200 transition-colors w-14 h-14 flex items-center justify-center">🔊</button>
                    </div>
                    
                    <div class="flex flex-col gap-2 bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100">
                        <span class="font-bold text-lg md:text-xl text-gray-700 flex items-center gap-2"><span>⏱️</span> Response Time</span>
                        <div class="relative">
                            <select id="lobby-timer-select" class="p-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700 text-lg focus:border-blue-500 outline-none w-full bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer appearance-none shadow-inner" style="text-align-last: center;">
                                <option value="default">Category Default</option>
                                <option value="30">30 Seconds</option>
                                <option value="60">1 Minute</option>
                                <option value="120">2 Minutes</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                <svg class="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Teams Panel (Only show if Classroom is selected) -->
                <div id="lobby-teams-panel" class="bg-blue-50 rounded-3xl p-4 md:p-6 border-2 border-blue-200 mb-2 text-left hidden shadow-inner">
                    <div class="flex justify-between items-center mb-4">
                        <span class="font-bold text-lg md:text-xl text-blue-800 flex items-center gap-2"><span>🏆</span> Teams (<span id="lobby-team-count">2</span>)</span>
                        <button onclick="window.addTeam()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl font-bold shadow-md transition-transform hover:scale-105 active:scale-95 text-sm md:text-base border-b-4 border-blue-700 active:border-b-0 active:translate-y-1">➕ Add Team</button>
                    </div>
                    <div id="lobby-teams-list" class="flex flex-wrap gap-2 md:gap-3">
                        <!-- teams rendered here -->
                    </div>
                    <div class="mt-4 text-sm font-bold text-blue-500/70 text-center italic">
                        Tip: Click a team name to edit it!
                    </div>
                </div>
            </div>
            
            <button onclick="Game.startGameFromLobby()" class="btn-premium green w-full py-4 text-2xl font-black shadow-lg shrink-0 mt-4 z-10 relative">🚀 START GAME</button>
        </div>
    </div>`;

if (code.includes('Game Setup Lobby')) {
    code = code.replace(oldSetup, newSetup);
    fs.writeFileSync('public/bubble-sentence.html', code);
    console.log("Patched setup screen successfully");
} else {
    console.log("Could not find the setup screen");
}
