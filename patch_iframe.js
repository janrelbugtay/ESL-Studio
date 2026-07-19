import fs from 'fs';
let code = fs.readFileSync('src/views/BubbleSentencePro.tsx', 'utf8');
code = code.replace(/src="\/bubble-sentence.html"/, "src={`/bubble-sentence.html?v=${Date.now()}`}");
fs.writeFileSync('src/views/BubbleSentencePro.tsx', code);
console.log("Patched iframe src");
