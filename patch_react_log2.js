import fs from 'fs';
let code = fs.readFileSync('src/views/BubbleSentencePro.tsx', 'utf8');
code = code.replace(/onLoad=\{\(\) => \{\s*if \(iframeRef\.current\?\.contentWindow\) \{/, "onLoad={() => { if (iframeRef.current?.contentWindow) { console.log('SENDING LOAD_GAME to iframe onLOAD', activeGame);");
fs.writeFileSync('src/views/BubbleSentencePro.tsx', code);
console.log("Patched react log 2");
