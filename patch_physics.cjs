const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldPhysics = `            startPhysics() {
                this.stopPhysics(); let lastT = performance.now();
                const loop = (t) => {
                    const dt = (t - lastT) / 16.66; lastT = t;
                    const bnds = document.getElementById('physics-area').getBoundingClientRect();
                    
                    this.bubbles.forEach((b, i) => {
                        if(b.snapped || this.dragB === b) return;
                        
                        // Gentle wandering force in any direction
                        b.vx += (Math.random() - 0.5) * 0.1 * dt;
                        b.vy += (Math.random() - 0.5) * 0.1 * dt;`;

const newPhysics = `            startPhysics() {
                this.stopPhysics(); let lastT = performance.now();
                const loop = (t) => {
                    const dt = (t - lastT) / 16.66; lastT = t;
                    const bnds = document.getElementById('physics-area').getBoundingClientRect();
                    
                    let speedMult = 1;
                    if (window.Storage && Storage.data && Storage.data.profile && Storage.data.profile.settings) {
                        speedMult = Storage.data.profile.settings.bubbleSpeed || 1;
                    }

                    this.bubbles.forEach((b, i) => {
                        if(b.snapped || this.dragB === b) return;
                        
                        // Gentle wandering force in any direction
                        b.vx += (Math.random() - 0.5) * 0.1 * dt * speedMult;
                        b.vy += (Math.random() - 0.5) * 0.1 * dt * speedMult;`;

html = html.replace(oldPhysics, newPhysics);

const oldPhysicsMax = `                        let speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
                        if (speed > 2.5) {
                            b.vx = (b.vx / speed) * 2.5;
                            b.vy = (b.vy / speed) * 2.5;
                        } else if (speed < 0.5 && speed > 0) {
                            b.vx = (b.vx / speed) * 0.5;
                            b.vy = (b.vy / speed) * 0.5;
                        }
                        b.x += b.vx * dt; b.y += b.vy * dt;`;

const newPhysicsMax = `                        let speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
                        const maxSpeed = 2.5 * speedMult;
                        const minSpeed = 0.5 * speedMult;
                        if (speed > maxSpeed) {
                            b.vx = (b.vx / speed) * maxSpeed;
                            b.vy = (b.vy / speed) * maxSpeed;
                        } else if (speed < minSpeed && speed > 0) {
                            b.vx = (b.vx / speed) * minSpeed;
                            b.vy = (b.vy / speed) * minSpeed;
                        }
                        b.x += b.vx * dt; b.y += b.vy * dt;`;

html = html.replace(oldPhysicsMax, newPhysicsMax);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched physics");
