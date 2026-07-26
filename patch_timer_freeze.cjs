const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldTimer = `                this.timerInterval = setInterval(() => {
                    this.timeLeft--;`;
const newTimer = `                this.timerInterval = setInterval(() => {
                    if (this.isFrozen) return;
                    this.timeLeft--;`;

code = code.replace(oldTimer, newTimer);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched timer logic");
