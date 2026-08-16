const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// Restore updateScore()
if (!code.includes('updateScore() {')) {
    code = code.replace("updateHints() {", `updateScore() {
                // Score is hidden now
            },
            updateHints() {`);
}

// Fix wrong bubble styling
const oldWrongStyling = `                b.el.style.borderColor = '#ef4444';
                b.el.style.color = '#ef4444';`;
const newWrongStyling = `                b.el.style.borderColor = '#ef4444';
                b.el.style.color = '#7f1d1d';
                b.el.style.background = 'radial-gradient(circle at 30% 30%, #fecaca, #f87171)';`;
code = code.replace(oldWrongStyling, newWrongStyling);

// Fix cleanup styling
const oldWrongCleanup = `                    b.el.style.borderColor = '';
                    b.el.style.color = '';`;
const newWrongCleanup = `                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                    b.el.style.background = '';`;
code = code.replace(oldWrongCleanup, newWrongCleanup);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched score and styling");
