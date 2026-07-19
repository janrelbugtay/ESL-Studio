const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldSettingsHtml = `<div id="screen-settings" class="screen justify-center items-center bg-black/50 backdrop-blur-md z-40">
        <div class="glass bg-white p-10 rounded-[40px] shadow-2xl w-11/12 max-w-lg border-4 border-gray-200 relative">
            <button onclick="Game.showScreen('screen-menu')" class="absolute top-6 right-6 text-3xl hover:scale-110 transition-transform">❌</button>
            <h2 class="text-4xl font-black text-gray-800 mb-8 text-center">Settings</h2>
            
            <div class="flex flex-col gap-4">
                <div class="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border-2">
                    <span class="font-black text-xl text-gray-700">Sound Effects</span>
                    <input type="checkbox" checked onchange="Audio.toggleSfx(this.checked)" class="w-8 h-8 accent-blue-500">
                </div>
                <div class="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border-2">
                    <span class="font-black text-xl text-gray-700">Show Hints</span>
                    <input type="checkbox" checked onchange="Game.toggleHints(this.checked)" class="w-8 h-8 accent-blue-500">
                </div>
                <div class="flex justify-between items-center bg-blue-50 p-5 rounded-2xl border-2 border-blue-200">
                    <div>
                        <span class="font-black text-xl text-blue-800 block">Classroom Mode</span>
                        <span class="text-sm text-blue-600 font-bold">Shows Team Scores</span>
                    </div>
                    <input type="checkbox" id="setting-classroom" onchange="Game.toggleClassroomMode(this.checked)" class="w-8 h-8 accent-blue-500">
                </div>
                <div class="flex justify-between items-center bg-red-50 p-5 rounded-2xl border-2 border-red-200 mt-4">
                    <span class="font-black text-xl text-red-700">Reset Progress</span>
                    <button onclick="Game.resetProgress()" class="btn-premium px-6 py-2 bg-red-500 text-red-700 border-red-300">Reset</button>
                </div>
            </div>
        </div>
    </div>`;

const newSettingsHtml = `<div id="screen-settings" class="screen justify-center items-center bg-black/50 backdrop-blur-md z-40 p-4">
        <div class="glass bg-white p-8 md:p-10 rounded-[40px] shadow-2xl w-full max-w-2xl border-4 border-gray-200 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onclick="Game.showScreen('screen-menu')" class="absolute top-6 right-6 text-3xl hover:scale-110 transition-transform">❌</button>
            <h2 class="text-4xl font-black text-gray-800 mb-8 text-center">Settings</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2 bg-gray-50 p-5 rounded-2xl border-2">
                    <div class="flex justify-between items-center">
                        <span class="font-black text-lg text-gray-700">Volume</span>
                        <span id="ui-volume-val" class="font-bold text-gray-500">50%</span>
                    </div>
                    <input type="range" id="setting-volume" min="0" max="100" value="50" onchange="Settings.update('volume', this.value)" oninput="document.getElementById('ui-volume-val').innerText = this.value + '%'" class="w-full accent-blue-500">
                </div>
                
                <div class="flex flex-col gap-2 bg-gray-50 p-5 rounded-2xl border-2">
                    <span class="font-black text-lg text-gray-700">Island Theme</span>
                    <select id="setting-theme" onchange="Settings.update('theme', this.value)" class="w-full p-2 rounded-xl border-2 border-gray-300 font-bold text-gray-700 outline-none focus:border-blue-500">
                        <option value="theme-sky">Sky Island</option>
                        <option value="theme-ocean">Ocean Island</option>
                        <option value="theme-jungle">Jungle Island</option>
                        <option value="theme-space">Space Island</option>
                    </select>
                </div>

                <div class="flex flex-col gap-2 bg-gray-50 p-5 rounded-2xl border-2">
                    <div class="flex justify-between items-center">
                        <span class="font-black text-lg text-gray-700">Bubble Speed</span>
                        <span id="ui-speed-val" class="font-bold text-gray-500">1x</span>
                    </div>
                    <input type="range" id="setting-speed" min="0.5" max="2" step="0.1" value="1" onchange="Settings.update('bubbleSpeed', this.value)" oninput="document.getElementById('ui-speed-val').innerText = this.value + 'x'" class="w-full accent-blue-500">
                </div>

                <div class="flex flex-col gap-2 bg-gray-50 p-5 rounded-2xl border-2">
                    <div class="flex justify-between items-center">
                        <span class="font-black text-lg text-gray-700">Bubble Size</span>
                        <span id="ui-size-val" class="font-bold text-gray-500">1x</span>
                    </div>
                    <input type="range" id="setting-size" min="0.5" max="2" step="0.1" value="1" onchange="Settings.update('bubbleSize', this.value)" oninput="document.getElementById('ui-size-val').innerText = this.value + 'x'" class="w-full accent-blue-500">
                </div>

                <div class="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border-2">
                    <div>
                        <span class="font-black text-lg text-gray-700 block">Enable Timer</span>
                        <span class="text-xs font-bold text-gray-500">Time limit per level</span>
                    </div>
                    <input type="checkbox" id="setting-timer" onchange="Settings.update('timerEnabled', this.checked)" class="w-8 h-8 accent-blue-500">
                </div>

                <div class="flex justify-between items-center bg-blue-50 p-5 rounded-2xl border-2 border-blue-200">
                    <div>
                        <span class="font-black text-lg text-blue-800 block">Classroom Teams</span>
                        <span class="text-xs font-bold text-blue-600">Shows Team Scores</span>
                    </div>
                    <input type="checkbox" id="setting-teams" onchange="Settings.update('teamsEnabled', this.checked)" class="w-8 h-8 accent-blue-500">
                </div>
            </div>

            <div class="flex justify-between items-center bg-red-50 p-5 rounded-2xl border-2 border-red-200 mt-4">
                <span class="font-black text-xl text-red-700">Reset Progress</span>
                <button onclick="Game.resetProgress()" class="btn-premium px-6 py-2 bg-red-500 text-red-700 border-red-300">Reset</button>
            </div>
        </div>
    </div>`;

html = html.replace(oldSettingsHtml, newSettingsHtml);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched settings HTML");
