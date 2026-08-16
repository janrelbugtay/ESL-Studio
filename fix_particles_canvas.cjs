const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(/init\(\) \{(\s*)this\.ctx = this\.canvas\.getContext\('2d'\);/, `init() {
                this.canvas = document.getElementById('particle-canvas');
                if (!this.canvas) {
                    this.canvas = document.createElement('canvas');
                    this.canvas.id = 'particle-canvas';
                    this.canvas.style.pointerEvents = 'none';
                    this.canvas.style.position = 'absolute';
                    this.canvas.style.top = '0';
                    this.canvas.style.left = '0';
                    this.canvas.style.width = '100%';
                    this.canvas.style.height = '100%';
                    this.canvas.style.zIndex = '50';
                    document.body.appendChild(this.canvas);
                }
                this.ctx = this.canvas.getContext('2d');`);

fs.writeFileSync('public/bubble-sentence.html', code);
