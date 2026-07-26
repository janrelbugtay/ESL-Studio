const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldSettings = `                <!-- Settings Panel -->
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
                </div>`;

const oldPlayers = `                <!-- Players Panel -->
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

if (code.includes(oldSettings) && code.includes(oldPlayers)) {
    code = code.replace(oldSettings, '%%SETTINGS%%');
    code = code.replace(oldPlayers, oldSettings);
    code = code.replace('%%SETTINGS%%', oldPlayers);

    fs.writeFileSync('public/bubble-sentence.html', code);
    console.log("Swapped panels successfully");
} else {
    console.log("Could not find the panels");
}
