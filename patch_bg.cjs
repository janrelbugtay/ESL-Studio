const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldBody = `        body {
            font-family: var(--font-game);
            overflow: hidden;
            background: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 100%);
            transition: background 1s ease-in-out;
            margin: 0; padding: 0;`;

const newBody = `        @keyframes bg-pulse {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        body {
            font-family: var(--font-game);
            overflow: hidden;
            background: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 100%);
            background-size: 150% 150%;
            animation: bg-pulse 10s ease infinite;
            transition: background 1s ease-in-out;
            margin: 0; padding: 0;`;

html = html.replace(oldBody, newBody);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched background");
