const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const xMarkCSS = `
        .wrong-x-mark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3.5rem;
            color: #ef4444;
            font-weight: 900;
            z-index: 50;
            pointer-events: none;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
            line-height: 1;
        }
`;

if (!code.includes('.wrong-x-mark')) {
    code = code.replace("/* Slots */", xMarkCSS + "\n        /* Slots */");
}

code = code.replace(/xMark\.className = '[^']+';/g, "xMark.className = 'wrong-x-mark';");
code = code.replace(/e\.preventDefault\(\);\n/g, "");

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched x-mark and preventDefault");
