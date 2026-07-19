const fs = require('fs');
const html = fs.readFileSync('public/bubble-sentence.html', 'utf8');
const scriptContent = html.match(/<script>(.*?)<\/script>/s);
if (scriptContent) {
    try {
        new Function(scriptContent[1]);
        console.log("JS parses successfully");
    } catch (e) {
        console.error("JS parsing error:", e);
    }
}
