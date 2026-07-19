import fs from 'fs';
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace(/quitGame\(\) \{[\s\S]*?this\.showScreen\('screen-menu'\);\n            \},/, `quitGame() {
                this.isPlaying = false;
                clearTimeout(this.levelTimeout);
                this.stopPhysics(); clearInterval(this.timerInterval);
                window.parent.postMessage({ type: 'QUIT_GAME' }, '*');
            },`);

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched quitGame");
