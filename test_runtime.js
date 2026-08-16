
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

window.onerror = function(message, source, lineno, colno, error) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.backgroundColor = 'rgba(255,0,0,0.8)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px';
    errorDiv.style.fontSize = '16px';
    errorDiv.innerText = message + ' at ' + lineno + ':' + colno + ' ' + (error && error.stack ? error.stack : '');
    document.body.appendChild(errorDiv);
};
window.onunhandledrejection = function(event) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '50px';
    errorDiv.style.left = '0';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.backgroundColor = 'rgba(255,100,0,0.8)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px';
    errorDiv.style.fontSize = '16px';
    errorDiv.innerText = 'Unhandled Promise Rejection: ' + event.reason;
    document.body.appendChild(errorDiv);
};

Game.sents=[{text:"He has become completely addicted to playing video games", diff:1}]; Game.idx=0; Game.loadLevel(); Game.wrong(Game.bubbles[0], Game.slots[0]); console.log("Success!");