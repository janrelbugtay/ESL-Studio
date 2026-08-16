const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const shakeStyle = `        @keyframes wrong-shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
        }
        .wrong-shake {
            animation: wrong-shake 0.4s ease-in-out infinite;
        }`;

if (!code.includes('wrong-shake')) {
    code = code.replace("/* Slots */", shakeStyle + "\n        /* Slots */");
}

code = code.replace("b.shakeTime = 800; // shake the whole time it's in the slot", "b.el.classList.add('wrong-shake'); // CSS shake");
code = code.replace("b.el.style.background = '';", "b.el.style.background = ''; b.el.classList.remove('wrong-shake');");

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched CSS shake");
