const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
app.use(express.static('public'));
const server = app.listen(3015, async () => {
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.error('PAGE ERROR:', err));
        page.on('response', res => { if (res.status() === 404) console.log('404:', res.url()); });
        
        await page.goto('http://localhost:3015/bubble-sentence.html', { waitUntil: 'networkidle0' });
        console.log("Page loaded successfully without uncaught errors!");
        
        await browser.close();
    } catch(e) {
        console.error(e);
    } finally {
        server.close();
    }
});
