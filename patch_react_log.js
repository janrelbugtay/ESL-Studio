import fs from 'fs';
let code = fs.readFileSync('src/views/BubbleSentencePro.tsx', 'utf8');
code = code.replace("if (iframeRef.current?.contentWindow) {", "if (iframeRef.current?.contentWindow) { console.log('SENDING LOAD_GAME to iframe', activeGame);");
fs.writeFileSync('src/views/BubbleSentencePro.tsx', code);
console.log("Patched react log");
