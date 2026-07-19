const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldLoop = `            loop() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for(let i=this.particles.length-1; i>=0; i--) {`;

const newLoop = `            ambientTimer: 0,
            loop() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Ambient Effects based on Theme
                if (window.Storage && Storage.data && Storage.data.profile && document.getElementById('screen-menu').classList.contains('active') === false) {
                    this.ambientTimer++;
                    if (this.ambientTimer > 10) {
                        this.ambientTimer = 0;
                        const t = Storage.data.profile.currentTheme;
                        if (t === 'theme-ocean' && Math.random() < 0.5) {
                            // Bubbles floating up
                            this.particles.push({
                                x: Math.random() * this.canvas.width, y: this.canvas.height + 20,
                                vx: (Math.random() - 0.5), vy: -(Math.random() * 2 + 1),
                                life: 1.0, decay: 0.003, color: 'rgba(255,255,255,0.4)', type: 'ambient-bubble',
                                size: Math.random() * 8 + 4, spin: 0
                            });
                        } else if (t === 'theme-space' && Math.random() < 0.3) {
                            // Stars passing by (parallax)
                            this.particles.push({
                                x: this.canvas.width + 20, y: Math.random() * this.canvas.height,
                                vx: -(Math.random() * 3 + 1), vy: 0,
                                life: 1.0, decay: 0.005, color: 'rgba(255,255,255,0.8)', type: 'ambient-star',
                                size: Math.random() * 3 + 1, spin: 0
                            });
                        } else if (t === 'theme-jungle' && Math.random() < 0.2) {
                            // Leaves falling
                            this.particles.push({
                                x: Math.random() * this.canvas.width, y: -20,
                                vx: (Math.random() - 0.5)*2, vy: Math.random() * 2 + 1,
                                life: 1.0, decay: 0.004, color: 'rgba(74, 222, 128, 0.6)', type: 'ambient-leaf',
                                size: Math.random() * 6 + 4, spin: 0
                            });
                        }
                    }
                }

                for(let i=this.particles.length-1; i>=0; i--) {`;

html = html.replace(oldLoop, newLoop);

const oldDraw = `                    if(p.type === 'sparkle') this.ctx.arc(0, 0, p.size * p.life, 0, Math.PI*2);
                    else if(p.type === 'coin') {
                        this.ctx.arc(0, 0, p.size, 0, Math.PI*2);
                        this.ctx.fill(); this.ctx.fillStyle = '#fef08a'; this.ctx.beginPath();
                        this.ctx.arc(0, 0, p.size*0.6, 0, Math.PI*2);
                    }
                    else this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);`;

const newDraw = `                    if(p.type === 'sparkle') this.ctx.arc(0, 0, p.size * p.life, 0, Math.PI*2);
                    else if(p.type === 'coin') {
                        this.ctx.arc(0, 0, p.size, 0, Math.PI*2);
                        this.ctx.fill(); this.ctx.fillStyle = '#fef08a'; this.ctx.beginPath();
                        this.ctx.arc(0, 0, p.size*0.6, 0, Math.PI*2);
                    }
                    else if(p.type === 'ambient-bubble') {
                        this.ctx.arc(0, 0, p.size, 0, Math.PI*2);
                        this.ctx.stroke(); this.ctx.beginPath(); // Outline only
                    }
                    else if(p.type === 'ambient-star') {
                        this.ctx.arc(0, 0, p.size * p.life, 0, Math.PI*2);
                    }
                    else if(p.type === 'ambient-leaf') {
                        this.ctx.ellipse(0, 0, p.size, p.size/2, 0, 0, Math.PI*2);
                    }
                    else this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);`;

html = html.replace(oldDraw, newDraw);

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched ambient particles");
