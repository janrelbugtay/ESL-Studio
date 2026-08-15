const fs = require('fs');
const file = 'public/bubble-sentence.html';
let code = fs.readFileSync(file, 'utf8');

const targetHtml = `<button onclick="window.renameTeam(\${t.id});" class="px-4 py-2 hover:bg-white/20 flex-1 text-left whitespace-nowrap">`;
const newHtml = `<button onclick="window.renameTeam(\${t.id});" class="px-4 py-2 hover:bg-white/20 flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">`;

code = code.replace(targetHtml, newHtml);
fs.writeFileSync(file, code);
console.log("Patched UI");
