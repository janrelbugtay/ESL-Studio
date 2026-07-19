const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace('<button id="sound-toggle-btn" onclick="window.toggleSound()" class="btn-premium bg-gradient-to-b from-gray-200 to-gray-300 text-gray-700 border-gray-100 px-3 py-3 text-lg shadow-[0_10px_0_#9ca3af,0_15px_20px_rgba(0,0,0,0.2)] w-full text-center">🔊</button>', '');

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Removed sound toggle from game screen");
