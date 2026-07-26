const fs = require('fs');
const file = 'src/views/HamsterPopQuiz.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldNav = `<div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigateTo('home')}
        >
          <span className="text-3xl group-hover:scale-110 transition-transform drop-shadow-sm">🐹</span>
          <h1 className="text-2xl font-black font-fredoka bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
            Hamster <span className="text-yellow-400">Pop Quiz</span>
          </h1>
        </div>`;

const newNav = `<div className="flex items-center gap-4">
          <button 
            onClick={() => onViewChange && onViewChange("home")}
            className="p-2 hover:bg-sky-100 rounded-full transition-colors text-slate-500 hover:text-sky-600"
          >
            <ArrowLeft size={24} />
          </button>
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigateTo('home')}
          >
            <span className="text-3xl group-hover:scale-110 transition-transform drop-shadow-sm">🐹</span>
            <h1 className="text-2xl font-black font-fredoka hidden md:block bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
              Hamster <span className="text-yellow-400">Pop Quiz</span>
            </h1>
          </div>
        </div>`;

code = code.replace(oldNav, newNav);

fs.writeFileSync(file, code);
console.log("Patched back button");
