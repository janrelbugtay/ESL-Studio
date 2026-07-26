const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(
    /function addTeam\(\) \{/g,
    `window.addTeam = function() {`
);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched addTeam");
