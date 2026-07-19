const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// The toggleSound function inside the script could have an issue where it isn't triggering the UI update?
// Wait, `document.getElementById('sound-toggle-btn').innerText` might fail if the id doesn't match?
// No, the id is `sound-toggle-btn`.
// I will just do a final check on the file.

