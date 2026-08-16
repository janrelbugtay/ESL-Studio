const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(/<body class="theme-sky" id="game-body">/, `<body class="theme-sky" id="game-body">
    <canvas id="particle-canvas"></canvas>`);

fs.writeFileSync('public/bubble-sentence.html', code);
