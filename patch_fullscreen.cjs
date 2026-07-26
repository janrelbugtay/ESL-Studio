const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const mediaQuery = `
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
`;

code = code.replace('</style>', mediaQuery + '\n    </style>');

code = code.replace(
    `<div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col w-11/12 max-w-5xl z-20">`,
    `<div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col w-[95%] max-w-[95%] z-20">`
);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched bubble-sentence.html for fullscreen sizing");
