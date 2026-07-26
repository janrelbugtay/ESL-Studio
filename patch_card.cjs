const fs = require('fs');
let code = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

code = code.replace(
  `                        <span className="px-2 py-1 bg-brand-purple/10 text-brand-purple rounded-md uppercase tracking-wide">
                          {game.topic || 'No Topic'}
                        </span>`,
  `                        <span className="px-2 py-1 bg-brand-purple/10 text-brand-purple rounded-md uppercase tracking-wide">
                          {game.name || 'Untitled Game'}
                        </span>`
);

code = code.replace(
  `                        <h3 className="font-black text-xl text-slate-800 dark:text-slate-200 line-clamp-2 pr-2">
                          {game.name}
                        </h3>`,
  `                        <h3 className="font-black text-xl text-slate-800 dark:text-slate-200 line-clamp-2 pr-2">
                          {game.topic || 'No Topic'}
                        </h3>`
);

code = code.replace(
  `                        <div className="w-12 h-12 bg-white dark:bg-slate-800 shadow-sm border-2 border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center font-bold text-2xl group-hover:scale-[1.20] transition-transform shrink-0 z-20 relative overflow-hidden">`,
  `                        <div className="w-20 h-20 bg-white dark:bg-slate-800 shadow-sm border-2 border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center font-bold text-5xl group-hover:scale-[1.10] transition-transform shrink-0 z-20 relative overflow-hidden">`
);

fs.writeFileSync('src/views/GamesLibrary.tsx', code);
console.log("Patched card");
