const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(
  `        <!-- Physics Area -->\n        <div id="physics-area" class="absolute top-24 left-0 w-full bottom-[220px] z-10 overflow-visible pointer-events-none"></div>`,
  `        <!-- Physics Area -->\n        <div id="physics-area" class="absolute top-24 left-0 w-full z-10 overflow-visible pointer-events-none" style="bottom: 320px;"></div>`
);

code = code.replace(
  `bottom-12`,
  `bottom-6`
);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patched bubble-sentence.html");
