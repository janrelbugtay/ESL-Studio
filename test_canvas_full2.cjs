const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

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
    Storage: {},
    onload: () => {}
};
global.document = {
    getElementById: (id) => {
        if (id === 'particle-canvas') return { style: {}, getContext: () => ({}), width: 100, height: 100 };
        return { style: {}, classList: { add: ()=>{}, remove: ()=>{} }, getBoundingClientRect: ()=>({width:100, height:100, left:0, top:0, right:100, bottom:100}), appendChild: ()=>{}, innerHTML: '' };
    },
    createElement: () => ({ style: {}, classList: { add: ()=>{}, remove: ()=>{} }, getBoundingClientRect: ()=>({width:100, height:100, left:0, top:0, right:100, bottom:100}), appendChild: ()=>{}, innerHTML: '', addEventListener: ()=>{} }),
    querySelectorAll: () => ([]),
};
global.requestAnimationFrame = () => {};
global.cancelAnimationFrame = () => {};
`;

fs.writeFileSync('test_runtime.js', mock + scriptContent + '\nGame.init(); console.log("Init Success!");');

