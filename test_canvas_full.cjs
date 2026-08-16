const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(code, { runScripts: "dangerously" });
setTimeout(() => {
    try {
        console.log("Canvas width:", dom.window.document.getElementById('particle-canvas').width);
    } catch(e) {
        console.log(e);
    }
}, 500);
