import fs from 'fs';
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const loadingScreen = `
    <div id="screen-loading" class="screen bg-sky-200 justify-center items-center z-50">
        <div class="text-4xl font-black text-blue-500 animate-pulse">Loading...</div>
    </div>
    <div id="screen-menu"`;

html = html.replace('<div id="screen-menu"', loadingScreen);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched loading screen");
