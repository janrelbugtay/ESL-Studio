const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const oldAudio = `playTone(freq, type, duration, vol=0.1, drop=false, rise=false) {
                if(!this.sfxEnabled) return; this.init();
                const t = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type; osc.frequency.setValueAtTime(freq, t);
                if(drop) osc.frequency.exponentialRampToValueAtTime(freq*0.2, t + duration);
                if(rise) osc.frequency.exponentialRampToValueAtTime(freq*2, t + duration);
                gain.gain.setValueAtTime(vol, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
                osc.connect(gain); gain.connect(this.ctx.destination);
                osc.start(t); osc.stop(t + duration);
            },`;

const newAudio = `playTone(freq, type, duration, vol=0.1, drop=false, rise=false) {
                if(!this.sfxEnabled) return; this.init();
                let master = 1;
                if (window.Storage && Storage.data && Storage.data.profile && Storage.data.profile.settings) {
                    master = Storage.data.profile.settings.volume / 50;
                }
                const finalVol = vol * master;
                if(finalVol <= 0) return;
                const t = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type; osc.frequency.setValueAtTime(freq, t);
                if(drop) osc.frequency.exponentialRampToValueAtTime(freq*0.2, t + duration);
                if(rise) osc.frequency.exponentialRampToValueAtTime(freq*2, t + duration);
                gain.gain.setValueAtTime(finalVol, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
                osc.connect(gain); gain.connect(this.ctx.destination);
                osc.start(t); osc.stop(t + duration);
            },`;

html = html.replace(oldAudio, newAudio);
fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched Audio JS");
