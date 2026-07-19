const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// Update DefaultData
html = html.replace(
  "currentTheme: 'theme-sky' },",
  "currentTheme: 'theme-sky', settings: { volume: 50, bubbleSpeed: 1, bubbleSize: 1, timerEnabled: true, teamsEnabled: false } },"
);

// Update Storage.load()
html = html.replace(
  "if(!this.data.profile.currentTheme) this.data.profile.currentTheme = 'theme-sky';",
  "if(!this.data.profile.currentTheme) this.data.profile.currentTheme = 'theme-sky';\n                    if(!this.data.profile.settings) this.data.profile.settings = { volume: 50, bubbleSpeed: 1, bubbleSize: 1, timerEnabled: true, teamsEnabled: false };"
);

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched DefaultData and Storage.load");
