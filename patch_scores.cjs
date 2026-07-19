const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldScores = `<div id="ui-classroom-scores" class="absolute top-24 left-1/2 transform -translate-x-1/2 w-11/12 max-w-5xl z-10 flex justify-between hidden pointer-events-none">
            <div class="glass bg-blue-500/80 text-white px-6 py-2 rounded-full font-black text-2xl shadow-lg border-blue-300">Team Blue: <span id="score-blue">0</span></div>
            <div class="glass bg-red-500/80 text-white px-6 py-2 rounded-full font-black text-2xl shadow-lg border-red-300">Team Red: <span id="score-red">0</span></div>
        </div>`;

const newScores = `<div id="ui-classroom-scores" class="absolute top-24 left-1/2 transform -translate-x-1/2 w-11/12 max-w-5xl z-20 flex justify-between hidden pointer-events-auto">
            <button onclick="document.getElementById('score-blue').innerText = parseInt(document.getElementById('score-blue').innerText)+1; Audio.coin(); Particles.spawn(window.innerWidth*0.2, 100, 10, '#3b82f6', 'sparkle', 1.5);" class="glass bg-blue-500/90 hover:bg-blue-400 text-white px-6 py-2 rounded-full font-black text-2xl shadow-lg border-blue-300 cursor-pointer transform hover:scale-110 transition-transform">Team Blue: <span id="score-blue">0</span></button>
            <button onclick="document.getElementById('score-red').innerText = parseInt(document.getElementById('score-red').innerText)+1; Audio.coin(); Particles.spawn(window.innerWidth*0.8, 100, 10, '#ef4444', 'sparkle', 1.5);" class="glass bg-red-500/90 hover:bg-red-400 text-white px-6 py-2 rounded-full font-black text-2xl shadow-lg border-red-300 cursor-pointer transform hover:scale-110 transition-transform">Team Red: <span id="score-red">0</span></button>
        </div>`;

html = html.replace(oldScores, newScores);

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched scores UI");
