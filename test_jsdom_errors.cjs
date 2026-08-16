const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
const code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const virtualConsole = new VirtualConsole();
virtualConsole.on("error", (err) => { console.error("JSDOM Error:", err); });
virtualConsole.on("warn", (warn) => { console.warn("JSDOM Warn:", warn); });
virtualConsole.on("jsdomError", (err) => { console.error("JSDOM jsdomError:", err); });

const dom = new JSDOM(code, { runScripts: "dangerously", virtualConsole });
setTimeout(() => {
    try {
        if (dom.window.Game) {
           console.log("Game loaded!");
        } else {
           console.log("Game not defined!");
        }
    } catch(e) {
        console.log("Exception:", e);
    }
}, 1000);
