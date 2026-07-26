const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(
    /class="glass \$\{c\.bg\} text-white px-4 py-2 rounded-full font-black text-xl shadow-lg \$\{c\.border\} cursor-pointer transform hover:scale-105 transition-transform flex items-center gap-2"/g,
    `class="team-score glass \${c.bg} text-white px-4 py-2 rounded-full font-black text-xl shadow-lg \${c.border} cursor-pointer transform hover:scale-105 transition-transform flex items-center gap-2"`
);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched team score class");
