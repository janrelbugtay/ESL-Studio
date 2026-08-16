const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(/loop\(\) \{\s*this\.ctx\.clearRect/, `loop() {
                if (!this.ctx) return;
                this.ctx.clearRect`);

fs.writeFileSync('public/bubble-sentence.html', code);
