const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// I will extract everything in the script block and run it in a headless node environment
// by mocking document and window
const scriptContent = code.match(/<script>([\s\S]*?)<\/script>/)[1];

const mock = `
global.window = {
    addEventListener: () => {},
    AudioContext: class {
        createOscillator() { return { frequency: { setValueAtTime: ()=>{}, exponentialRampToValueAtTime: ()=>{} }, connect: ()=>{}, start: ()=>{}, stop: ()=>{} }; }
        createGain() { return { gain: { setValueAtTime: ()=>{}, exponentialRampToValueAtTime: ()=>{} }, connect: ()=>{} }; }
    },
    innerWidth: 1000,
    innerHeight: 1000,
};
global.document = {
    getElementById: () => ({ style: {}, classList: { add: ()=>{}, remove: ()=>{} }, getBoundingClientRect: ()=>({width:100, height:100, left:0, top:0, right:100, bottom:100}), appendChild: ()=>{}, innerHTML: '' }),
    createElement: () => ({ style: {}, classList: { add: ()=>{}, remove: ()=>{} }, getBoundingClientRect: ()=>({width:100, height:100, left:0, top:0, right:100, bottom:100}), appendChild: ()=>{}, innerHTML: '', addEventListener: ()=>{} }),
    querySelectorAll: () => ([]),
};
global.requestAnimationFrame = () => {};
global.cancelAnimationFrame = () => {};
`;

fs.writeFileSync('test_runtime.js', mock + scriptContent + '\nGame.sents=[{text:"He has become completely addicted to playing video games", diff:1}]; Game.idx=0; Game.loadLevel(); Game.wrong(Game.bubbles[0], Game.slots[0]); console.log("Success!");');

