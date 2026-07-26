const fs = require('fs');
const file = 'src/views/HamsterPopQuiz.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    'className="min-h-screen text-slate-800 font-nunito overflow-x-hidden bg-gradient-to-br from-cyan-100 via-sky-50 to-yellow-50 relative selection:bg-yellow-400 selection:text-slate-900"',
    'className="h-[calc(100vh-2rem)] w-full text-slate-800 font-nunito overflow-y-auto overflow-x-hidden bg-gradient-to-br from-cyan-100 via-sky-50 to-yellow-50 relative selection:bg-yellow-400 selection:text-slate-900" style={{ margin: "-1rem", height: "calc(100% + 2rem)" }}'
);

code = code.replace(
    'className="container mx-auto px-4 py-8 relative z-10 pt-24"',
    'className="container mx-auto px-4 py-8 relative z-10"'
);

fs.writeFileSync(file, code);
console.log("Patched layout");
