const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldScoreCode = `                    // Classroom Mode Add Points
                    if(this.classroomMode) {
                        const team = Math.random() > 0.5 ? 'blue' : 'red';
                        const el = document.getElementById(\`score-\${team}\`);
                        el.innerText = parseInt(el.innerText) + 100;
                    }`;

html = html.replace(oldScoreCode, `                    // Classroom Mode Add Points (Handled manually by teacher clicks now)`);

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Fixed score bug");
