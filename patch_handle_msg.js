import fs from 'fs';
let code = fs.readFileSync('src/views/BubbleSentencePro.tsx', 'utf8');

code = code.replace(/useEffect\(\(\) => \{\n    const handleMessage = \(e: MessageEvent\) => \{\n      if \(e\.data && e\.data\.type === 'QUIT_GAME'\) \{\n        setScreen\('setup'\);\n      \}\n    \};\n    window\.addEventListener\('message', handleMessage\);\n    return \(\) => window\.removeEventListener\('message', handleMessage\);\n  \}, \[\]\);/, `useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === 'QUIT_GAME') {
        setScreen('setup');
      } else if (e.data.type === 'IFRAME_READY') {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'LOAD_GAME',
                data: activeGame
            }, '*');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeGame]);`);

fs.writeFileSync('src/views/BubbleSentencePro.tsx', code);
console.log("Patched handleMessage");
