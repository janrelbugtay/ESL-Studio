const fs = require('fs');
const file = 'src/views/HamsterPopQuiz.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    'className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-sky-100 shadow-sm"',
    'className="sticky top-0 w-full bg-white/70 backdrop-blur-md z-40 border-b border-sky-100 shadow-sm rounded-xl"'
);

fs.writeFileSync(file, code);
console.log("Patched nav");
