import fs from 'fs';
let code = fs.readFileSync('src/views/BubbleSentencePro.tsx', 'utf8');

code = code.replace(/const startGame = \(\) => \{\n    setScreen\('game'\);\n    setTimeout\(\(\) => \{\n        if \(iframeRef\.current\?\.contentWindow\) \{\n            iframeRef\.current\.contentWindow\.postMessage\(\{\n                type: 'LOAD_GAME',\n                data: activeGame\n            \}, '\*'\);\n        \}\n    \}, 500\); \n  \};/, `const startGame = () => {
    setScreen('game');
  };`);

fs.writeFileSync('src/views/BubbleSentencePro.tsx', code);
console.log("Patched startGame");
