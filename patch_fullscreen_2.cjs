const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// The previous block was:
/*
        @media (min-height: 800px) and (min-width: 1024px) {
            .bubble-word {
                padding: 3vh 5vh;
                font-size: 7vh;
                border-width: 0.4vh;
            }
            .word-slot {
                height: 15vh;
                min-width: 22vh;
                border-width: 0.5vh;
            }
            #sentence-container {
                min-height: 20vh;
                padding: 4vh;
                gap: 2vh;
                border-radius: 4vh;
            }
        }
*/

const mediaQuery = `
        @media (min-height: 800px) and (min-width: 1024px) {
            .bubble-word {
                padding: 2.5vh 4.5vh;
                font-size: 6vh;
                border-width: 0.4vh;
            }
            .word-slot {
                height: 12vh;
                min-width: 18vh;
                border-width: 0.5vh;
            }
            #sentence-container {
                min-height: 16vh;
                padding: 4vh;
                gap: 2vh;
                border-radius: 4vh;
            }
            .powerups-container button {
                padding: 2vh 3vh !important;
                font-size: 2.5vh !important;
                border-radius: 1.5vh !important;
            }
            .ui-progress-container {
                height: 3vh !important;
                margin-top: 3vh !important;
                border-radius: 1.5vh !important;
            }
            .lesson-status-container {
                font-size: 2.5vh !important;
                padding: 1vh 3vh !important;
            }
            #timer-container {
                width: 18vh !important;
                height: 18vh !important;
            }
            #ui-timer-text {
                font-size: 6vh !important;
            }
            .quit-btn {
                padding: 1.5vh 3vh !important;
                font-size: 2.5vh !important;
            }
            .team-score {
                padding: 1vh 3vh !important;
                font-size: 2.5vh !important;
            }
        }
`;

// Replace the previous media query
code = code.replace(/@media \(min-height: 800px\) and \(min-width: 1024px\) \{[\s\S]*?\n        \}/, mediaQuery.trim());

// Add classes to HTML elements so the CSS can target them
code = code.replace(
    `<div class="flex flex-col gap-2 shrink-0 pointer-events-auto z-30">`,
    `<div class="flex flex-col gap-2 shrink-0 pointer-events-auto z-30 powerups-container">`
);

code = code.replace(
    `<div class="w-full max-w-2xl mx-auto bg-black/20 rounded-full h-4 mt-6 overflow-hidden border-2 border-white/50 shadow-inner">`,
    `<div class="w-full max-w-2xl mx-auto bg-black/20 rounded-full h-4 mt-6 overflow-hidden border-2 border-white/50 shadow-inner ui-progress-container">`
);

code = code.replace(
    `<div class="bg-blue-900/40 backdrop-blur-md text-white font-black text-xl px-6 py-2 rounded-full shadow-lg border border-white/30 tracking-wide" id="ui-lesson-status">`,
    `<div class="bg-blue-900/40 backdrop-blur-md text-white font-black text-xl px-6 py-2 rounded-full shadow-lg border border-white/30 tracking-wide lesson-status-container" id="ui-lesson-status">`
);

code = code.replace(
    `<button onclick="Game.quitGame()" class="btn-premium bg-gradient-to-b from-gray-200 to-gray-300 text-gray-700 border-gray-100 px-6 py-3 text-lg`,
    `<button onclick="Game.quitGame()" class="btn-premium quit-btn bg-gradient-to-b from-gray-200 to-gray-300 text-gray-700 border-gray-100 px-6 py-3 text-lg`
);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched fullscreen CSS 2");
