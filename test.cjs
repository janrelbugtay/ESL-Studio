const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><div class="bubble-word">hello</div>`);
const textNode = dom.window.document.querySelector('.bubble-word').firstChild;
try {
    console.log(textNode.closest('.bubble-word'));
} catch (e) {
    console.log("Error:", e.message);
}
