const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// 1. Remove the progress bar and the old lesson status container
code = code.replace(
    /            <!-- Progress Bar -->\n            <div class="w-full max-w-2xl mx-auto bg-black\/20 rounded-full h-4 mt-6 overflow-hidden border-2 border-white\/50 shadow-inner ui-progress-container">\n                <div id="ui-progress" class="bg-gradient-to-r from-green-400 via-green-300 to-green-500 h-full rounded-full w-0 transition-all duration-500 relative">\n                    <div class="absolute top-0 left-0 w-full h-full bg-\[url\('data:image\/svg\+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI\+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIi8\+PHBhdGggZD0iTTAgMjBMMjAgMEgwaC0yMEwyMCAyMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIvPjwvc3ZnPg=='\)] opacity-50"><\/div>\n                <\/div>\n            <\/div>\n            <div class="text-center mt-4 mb-2 flex justify-center"><div class="bg-blue-900\/40 backdrop-blur-md text-white font-black text-xl px-6 py-2 rounded-full shadow-lg border border-white\/30 tracking-wide lesson-status-container" id="ui-lesson-status">1 \/ 5<\/div><\/div>/,
    ``
);

// 2. Insert the lesson status into the top bar (top-right corner)
// Finding the Left Controls section inside Top Bar to add Right Controls
code = code.replace(
    `            <!-- Left Controls -->\n            <div class="absolute top-4 left-4 flex flex-col gap-2 pointer-events-auto">`,
    `            <!-- Right Controls (Lesson Status) -->\n            <div class="absolute top-4 right-4 flex flex-col gap-2 pointer-events-auto">\n                <div class="bg-blue-900/40 backdrop-blur-md text-white font-black text-xl px-6 py-2 rounded-full shadow-lg border border-white/30 tracking-wide lesson-status-container" id="ui-lesson-status">1 / 5</div>\n            </div>\n\n            <!-- Left Controls -->\n            <div class="absolute top-4 left-4 flex flex-col gap-2 pointer-events-auto">`
);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched lesson status and removed line");
