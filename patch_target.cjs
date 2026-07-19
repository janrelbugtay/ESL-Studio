const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

html = html.replace("const targetEl = e.target.closest('.bubble-word');", 
`let target = e.target;
                    if (target.nodeType === 3) target = target.parentNode;
                    const targetEl = target.closest ? target.closest('.bubble-word') : null;`);

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched targetEl");
