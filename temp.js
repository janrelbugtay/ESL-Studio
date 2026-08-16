        /** BUBBLE SENTENCE FORMATION PRO - Premium Engine */

        // --- Audio Engine (Web Audio API Synthesizer) ---
        const Audio = {
            ctx: null, sfxEnabled: true,
            init() { if(!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
            toggleSfx(val) { this.sfxEnabled = val; },
            playTone(freq, type, duration, vol=0.1, drop=false, rise=false) {
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
            },
            pop() { this.playTone(600, 'sine', 0.1, 0.2, true); },
            snap() { this.playTone(800, 'triangle', 0.1, 0.2); setTimeout(()=>this.playTone(1200, 'sine', 0.15, 0.2), 50); },
            wrong() { this.playTone(150, 'sawtooth', 0.3, 0.15, true); },
            tick() { this.playTone(1000, 'square', 0.05, 0.05); },
            tickFast() { this.playTone(1200, 'square', 0.05, 0.1); },
            coin() { this.playTone(1500, 'sine', 0.1, 0.1, false, true); setTimeout(()=>this.playTone(2000, 'sine', 0.2, 0.1), 50); },
            win() { 
                [400, 500, 600, 800, 1000, 1200].forEach((f, i) => {
                    setTimeout(() => this.playTone(f, 'square', 0.2, 0.1), i * 100);
                });
            },
            click() { this.playTone(400, 'sine', 0.05, 0.1); }
        };

        // --- Particle System ---
        const Particles = {
            canvas: document.getElementById('particle-canvas'), ctx: null, particles: [], animFrame: null,
            init() {
                this.ctx = this.canvas.getContext('2d'); this.resize();
                window.addEventListener('resize', () => this.resize()); this.loop();
            },
            resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; },
            spawn(x, y, count, color, type='sparkle', sizeScale=1) {
                for(let i=0; i<count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 8 + 2;
                    this.particles.push({
                        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                        life: 1.0, decay: Math.random() * 0.02 + 0.015, color, type,
                        size: (Math.random() * 8 + 4) * sizeScale, spin: Math.random() * 360
                    });
                }
            },
            coinExplosion(x, y) {
                this.spawn(x, y, 30, '#eab308', 'coin', 1.5);
            },
            fireworks() {
                for(let i=0; i<8; i++) {
                    setTimeout(() => {
                        const x = Math.random() * this.canvas.width;
                        const y = Math.random() * (this.canvas.height * 0.6);
                        const colors = ['#FF8DE9', '#4FA8FF', '#4ADE80', '#FBBF24', '#f87171'];
                        this.spawn(x, y, 60, colors[Math.floor(Math.random()*colors.length)], 'confetti', 1.2);
                        Audio.playTone(Math.random()*400 + 400, 'sine', 0.5, 0.05, true);
                    }, i * 300);
                }
            },
            ambientTimer: 0,
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

                for(let i=this.particles.length-1; i>=0; i--) {
                    const p = this.particles[i];
                    p.x += p.vx; p.y += p.vy; p.life -= p.decay; p.spin += 5;
                    
                    if(p.type === 'confetti' || p.type === 'coin') p.vy += 0.2; // gravity
                    if(p.life <= 0) { this.particles.splice(i, 1); continue; }
                    
                    this.ctx.globalAlpha = p.life; this.ctx.fillStyle = p.color; this.ctx.strokeStyle = p.color; this.ctx.lineWidth = 2;
                    this.ctx.save(); this.ctx.translate(p.x, p.y); this.ctx.rotate(p.spin * Math.PI/180);
                    this.ctx.beginPath();
                    if(p.type === 'sparkle') this.ctx.arc(0, 0, p.size * p.life, 0, Math.PI*2);
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
                    else this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                    this.ctx.fill(); this.ctx.restore();
                }
                this.ctx.globalAlpha = 1;
                this.animFrame = requestAnimationFrame(() => this.loop());
            }
        };

        // --- STREAMING_CHUNK:Data & State Management... ---
        const DefaultData = {
            profile: { name: "Student", avatar: "🐧", coins: 0, unlockedThemes: ['theme-sky'], currentTheme: 'theme-sky', settings: { volume: 50, bubbleSpeed: 1, bubbleSize: 1, timerEnabled: true, teamsEnabled: false } },
            categories: [
                { id: 'cat_daily', name: 'Daily Habits', icon: '🏡', timer: 60, color: '#60a5fa', x: 20, y: 10 },
                { id: 'cat_animals', name: 'Wild Animals', icon: '🦁', timer: 45, color: '#4ade80', x: 60, y: 30 },
                { id: 'cat_food', name: 'Yummy Food', icon: '🍔', timer: 0, color: '#f87171', x: 30, y: 60 }
            ],
            sentences: [
                { id: 's1', catId: 'cat_daily', text: 'I brush my teeth.', emoji: '🪥', diff: 1 },
                { id: 's2', catId: 'cat_daily', text: 'The sun is shining today.', emoji: '☀️', diff: 2 },
                { id: 's3', catId: 'cat_animals', text: 'The lion is roaring loud.', emoji: '🦁', diff: 2 },
                { id: 's4', catId: 'cat_animals', text: 'Monkeys love to climb trees.', emoji: '🐒', diff: 3 },
                { id: 's5', catId: 'cat_food', text: 'I eat pizza.', emoji: '🍕', diff: 1 },
                { id: 's6', catId: 'cat_food', text: 'She is drinking cold water.', emoji: '💧', diff: 2 }
            ],
            progress: {} 
        };

        const Dialog = {
            callback: null,
            alert(msg) {
                document.getElementById('dialog-title').innerText = 'Attention';
                document.getElementById('dialog-message').innerText = msg;
                document.getElementById('dialog-btn-cancel').classList.add('hidden');
                document.getElementById('modal-dialog').classList.remove('hidden');
                this.callback = null;
            },
            confirm(msg, cb) {
                document.getElementById('dialog-title').innerText = 'Confirm';
                document.getElementById('dialog-message').innerText = msg;
                document.getElementById('dialog-btn-cancel').classList.remove('hidden');
                document.getElementById('modal-dialog').classList.remove('hidden');
                this.callback = cb;
            },
            ok() {
                document.getElementById('modal-dialog').classList.add('hidden');
                if (this.callback) this.callback(true);
            },
            cancel() {
                document.getElementById('modal-dialog').classList.add('hidden');
                if (this.callback) this.callback(false);
            }
        };

        const Storage = {
            data: null,
            load() {
                const saved = localStorage.getItem('bubbleGamePro');
                if(saved) {
                    try {
                        this.data = JSON.parse(saved);
                    } catch(e) {
                        this.data = JSON.parse(JSON.stringify(DefaultData));
                    }
                    
                    // Migrations/Fallbacks for older saves
                    if(!this.data.profile) this.data.profile = DefaultData.profile;
                    if(!this.data.profile.unlockedThemes) this.data.profile.unlockedThemes = ['theme-sky'];
                    if(!this.data.profile.currentTheme) this.data.profile.currentTheme = 'theme-sky';
                    if(!this.data.profile.settings) this.data.profile.settings = { volume: 50, bubbleSpeed: 1, bubbleSize: 1, timerEnabled: true, teamsEnabled: false };
                    if(!this.data.progress) this.data.progress = {};
                    if(!this.data.categories) this.data.categories = DefaultData.categories;
                    if(!this.data.sentences) this.data.sentences = DefaultData.sentences;
                } else {
                    this.data = JSON.parse(JSON.stringify(DefaultData)); this.save();
                }
                document.body.className = this.data.profile.currentTheme;
            },
            save() { localStorage.setItem('bubbleGamePro', JSON.stringify(this.data)); },
            getCat(id) { return this.data.categories.find(c => c.id === id); },
            getSents(catId) { return this.data.sentences.filter(s => s.catId === catId); },
            addCoins(amount) { this.data.profile.coins += amount; this.save(); UI.updateProfile(); Settings.apply(); },
            setAvatar(av) { this.data.profile.avatar = av; this.save(); UI.updateProfile(); },
            setTheme(t) { this.data.profile.currentTheme = t; document.body.className = t; this.save(); }
        };

                const Settings = {
            update(key, val) {
                if(!Storage.data.profile.settings) Storage.data.profile.settings = { volume: 50, bubbleSpeed: 1, bubbleSize: 1, timerEnabled: true, teamsEnabled: false };
                if (key === 'volume') {
                    Storage.data.profile.settings.volume = parseInt(val);
                } else if (key === 'bubbleSpeed') {
                    Storage.data.profile.settings.bubbleSpeed = parseFloat(val);
                } else if (key === 'bubbleSize') {
                    Storage.data.profile.settings.bubbleSize = parseFloat(val);
                    // Live update bubbles
                    document.querySelectorAll('.bubble-word').forEach(b => {
                        b.style.transform = `scale(${parseFloat(val)})`;
                    });
                } else if (key === 'timerEnabled') {
                    Storage.data.profile.settings.timerEnabled = val;
                } else if (key === 'teamsEnabled') {
                    Storage.data.profile.settings.teamsEnabled = val;
                    Game.toggleClassroomMode(val);
                } else if (key === 'theme') {
                    Storage.setTheme(val);
                }
                Storage.save();
            },
            apply() {
                if(!Storage.data.profile.settings) return;
                const s = Storage.data.profile.settings;
                
                const byId = (id, val, prop='value') => { const el = document.getElementById(id); if(el) el[prop] = val; };
                const byText = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };

                byId('setting-volume', s.volume || 50);
                byText('ui-volume-val', (s.volume || 50) + '%');
                byId('setting-theme', Storage.data.profile.currentTheme || 'theme-sky');
                byId('setting-speed', s.bubbleSpeed || 1);
                byText('ui-speed-val', (s.bubbleSpeed || 1) + 'x');
                byId('setting-size', s.bubbleSize || 1);
                byText('ui-size-val', (s.bubbleSize || 1) + 'x');
                byId('setting-timer', s.timerEnabled !== false, 'checked');
                byId('setting-teams', !!s.teamsEnabled, 'checked');
                
                byId('setting-volume-pause', s.volume || 50);
                byText('ui-volume-val-pause', (s.volume || 50) + '%');
                byId('setting-speed-pause', s.bubbleSpeed || 1);
                byText('ui-speed-val-pause', (s.bubbleSpeed || 1) + 'x');
                byId('setting-size-pause', s.bubbleSize || 1);
                byText('ui-size-val-pause', (s.bubbleSize || 1) + 'x');
                byId('setting-timer-pause', s.timerEnabled !== false, 'checked');
                
                Game.toggleClassroomMode(!!s.teamsEnabled);
                Storage.setTheme(Storage.data.profile.currentTheme || 'theme-sky');
            }
        };

        const UI = {
            updateProfile() {
                document.getElementById('ui-avatar').innerText = Storage.data.profile.avatar;
                document.getElementById('ui-coins-total').innerText = Storage.data.profile.coins;
                const gameCoins = document.getElementById('ui-coins-game');
                if (gameCoins) gameCoins.innerText = Storage.data.profile.coins;
            }
        };

        const Mascot = {
            react(type) {
                // Mascot removed
            }
        };

        // --- STREAMING_CHUNK:Gameplay Logic & Physics... ---
        const Game = {
            hintsEnabled: true, classroomMode: false,
            isPlaying: false, levelTimeout: null,
            cat: null, sents: [], idx: 0,
            words: [], placed: 0, bubbles: [], slots: [],
            score: 0, combo: 0, maxCombo: 0, mistakes: 0,
            
            // Timer state
            timerTotal: 0, timeLeft: 0, timerInterval: null,
            
            // Physics
            physFrame: null, dragB: null, dragOff: {x:0, y:0},

            init() {
                Storage.load(); Particles.init(); UI.updateProfile();
                this.buildWorldMap(); this.buildShop();
                this.setupDrag();
                document.querySelectorAll('button').forEach(b => b.addEventListener('pointerdown', ()=>Audio.click()));
            },
            showScreen(id) {
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                document.getElementById(id).classList.add('active');
            },
            toggleClassroomMode(val) {
                this.classroomMode = val;
            },
            resetProgress() {
                Dialog.confirm("Factory reset? This deletes all custom lessons and progress.", (yes) => {
                    if (yes) {
                        localStorage.removeItem('bubbleGamePro'); location.reload();
                    }
                });
            },
            openSettings() {
                Settings.apply(); // make sure it matches latest
                document.getElementById('modal-settings').style.display = 'flex';
                document.getElementById('modal-settings').classList.remove('hidden');
            },
            pauseGame() {
                this.isPaused = true;
                document.getElementById('modal-pause').classList.remove('hidden'); document.getElementById('modal-pause').style.display = "flex";
                clearInterval(this.timerInterval);
                this.stopPhysics();
            },
            resumeGame() {
                this.isPaused = false;
                document.getElementById('modal-pause').classList.add('hidden'); document.getElementById('modal-pause').style.display = "none";
                if (this.timerTotal > 0) this.startTimer(this.timeLeft, true);
                this.startPhysics();
            },

            // Map UI
            buildWorldMap() {
                const container = document.getElementById('world-map-container');
                container.innerHTML = '';
                
                // Draw path connections
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.classList.add('absolute', 'inset-0', 'w-full', 'h-full', 'pointer-events-none', 'z-0');
                container.appendChild(svg);
                
                Storage.data.categories.forEach((cat, i) => {
                    const sents = Storage.getSents(cat.id);
                    if(sents.length === 0) return;
                    const prog = Storage.data.progress[cat.id] || { stars: 0 };
                    
                    const island = document.createElement('div');
                    island.className = 'absolute map-island z-10 flex flex-col items-center';
                    island.style.left = `${cat.x}%`; island.style.top = `${cat.y}%`;
                    island.style.animation = `float-island ${3 + Math.random()}s ease-in-out infinite`;
                    
                    island.innerHTML = `
                        <div class="glass bg-white p-4 rounded-[40px] shadow-2xl flex flex-col items-center border-4" style="border-color:${cat.color}">
                            <span class="text-6xl drop-shadow-md mb-2">${cat.icon}</span>
                            
                        </div>
                        <div class="mt-3 bg-black/60 text-white font-black px-4 py-2 rounded-full backdrop-blur-sm text-center shadow-lg border-2 border-white/20">
                            ${cat.name}
                        </div>
                    `;
                    island.onclick = () => this.openLobby(cat.id);
                    container.appendChild(island);

                    // Draw line to next
                    if(i < Storage.data.categories.length-1) {
                        const next = Storage.data.categories[i+1];
                        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        line.setAttribute("x1", `${cat.x + 5}%`); line.setAttribute("y1", `${cat.y + 10}%`);
                        line.setAttribute("x2", `${next.x + 5}%`); line.setAttribute("y2", `${next.y + 10}%`);
                        line.setAttribute("stroke", "rgba(255,255,255,0.4)");
                        line.setAttribute("stroke-width", "6");
                        line.setAttribute("stroke-dasharray", "10,10");
                        svg.appendChild(line);
                    }
                });
            },

            // Shop UI
            buildShop() {
                const avs = ['🐧','🐶','🐱','🤖','👽','🦄','🦖','🦸'];
                const avCon = document.getElementById('shop-avatars');
                avCon.innerHTML = '';
                avs.forEach(a => {
                    const b = document.createElement('div');
                    b.className = `text-4xl p-3 bg-gray-100 rounded-2xl cursor-pointer hover:bg-blue-100 text-center border-4 ${Storage.data.profile.avatar === a ? 'border-blue-500' : 'border-transparent'}`;
                    b.innerText = a;
                    b.onclick = () => { Storage.setAvatar(a); this.buildShop(); };
                    avCon.appendChild(b);
                });

                const themes = [
                    {id:'theme-sky', name:'Sky', cost:0, icon:'☁️'},
                    {id:'theme-ocean', name:'Ocean', cost:500, icon:'🌊'},
                    {id:'theme-jungle', name:'Jungle', cost:1000, icon:'🌴'},
                    {id:'theme-space', name:'Space', cost:2000, icon:'🚀'}
                ];
                const thCon = document.getElementById('shop-themes');
                thCon.innerHTML = '';
                themes.forEach(t => {
                    const unlocked = Storage.data.profile.unlockedThemes.includes(t.id);
                    const active = Storage.data.profile.currentTheme === t.id;
                    const b = document.createElement('div');
                    b.className = `p-4 rounded-2xl border-4 text-center cursor-pointer transition-all ${active?'border-green-500 bg-green-50':(unlocked?'border-gray-200 bg-gray-50':'border-gray-200 bg-gray-100 opacity-75')}`;
                    b.innerHTML = `<div class="text-4xl mb-2">${t.icon}</div><div class="font-bold text-gray-800">${t.name}</div>`;
                    if(!unlocked) {
                        b.innerHTML += `<div class="text-sm font-black text-yellow-600 mt-2">🪙 ${t.cost}</div>`;
                        b.onclick = () => {
                            if(Storage.data.profile.coins >= t.cost) {
                                Storage.data.profile.coins -= t.cost;
                                Storage.data.profile.unlockedThemes.push(t.id);
                                Storage.setTheme(t.id);
                                this.buildShop(); UI.updateProfile(); Audio.win(); Particles.coinExplosion(window.innerWidth/2, window.innerHeight/2);
                            } else { Audio.wrong(); Dialog.alert("Not enough coins!"); }
                        };
                    } else {
                        b.onclick = () => { Storage.setTheme(t.id); this.buildShop(); };
                    }
                    thCon.appendChild(b);
                });
            },

            // Play Logic

            selectedCatId: null,
            openLobby(catId) {
                this.selectedCatId = catId;
                const prog = Storage.data.progress[catId] || { stars: 0, bestScore: 0 };
                document.getElementById('lobby-best-score').innerText = prog.bestScore || 0;
                document.getElementById('lobby-stars').innerText = prog.stars || 0;
                if(typeof window.renderLobbyTeams === 'function') window.renderLobbyTeams();
                this.showScreen('screen-setup');
            },
            selectMode(isClassroom) {
                // Disabled.
            },
            startGameFromLobby() {
                this.classroomMode = window.teamsData && window.teamsData.length > 1;
                if (this.selectedCatId) {
                    this.start(this.selectedCatId);
                }
            },
            start(catId) {

                this.cat = Storage.getCat(catId);
                this.sents = Storage.getSents(catId).sort(()=>Math.random()-0.5);
                this.idx = 0; this.score = 0; this.combo = 0; this.maxCombo = 0;
                this.isPlaying = true;
                
                // Classroom scores
                if(this.classroomMode) {
                    window.teamsData.forEach(t => t.score = 0);
                    if (typeof renderTeams === 'function') renderTeams();
                    const container = document.getElementById('teams-container');
                    if (container) container.style.display = 'flex';
                } else {
                    const container = document.getElementById('teams-container');
                    if (container) container.style.display = 'none';
                }

                this.showScreen('screen-game');
                this.loadLevel();
            },
            quitGame() {
                this.isPlaying = false;
                clearTimeout(this.levelTimeout);
                this.stopPhysics(); clearInterval(this.timerInterval);
                window.parent.postMessage({ type: 'QUIT_GAME' }, '*');
            },

            loadLevel() {
                if(!this.isPlaying) return;
                if(this.idx >= this.sents.length) { this.winGame(); return; }
                const s = this.sents[this.idx];
                this.placed = 0; this.mistakes = 0; this.bubbles = []; this.slots = [];
                
                let clean = s.text.replace(/[.,!?]/g, '');
                this.words = clean.split(' ').filter(w=>w.length>0);
                
                // UI Setup
                
                
                 // Reflow
                
                
                document.getElementById('ui-lesson-status').innerText = `${this.idx + 1} / ${this.sents.length}`;
                if(document.getElementById('ui-progress')) document.getElementById('ui-progress').style.width = `${(this.idx/this.sents.length)*100}%`;
                this.updateScore();
                
                this.renderSlots(); this.createBubbles();
                this.startTimer(this.cat.timer);
                this.startPhysics(); this.updateHints();
            },

            startTimer(seconds, isResume=false) {
                clearInterval(this.timerInterval);
                const ring = document.getElementById('ui-timer-ring');
                const text = document.getElementById('ui-timer-text');
                
                let timerEnabled = true;
                if(window.Storage && Storage.data && Storage.data.profile && Storage.data.profile.settings) {
                    if(Storage.data.profile.settings.timerEnabled === false) timerEnabled = false;
                }
                
                document.getElementById('game-body').style.animation = 'none';
                ring.style.stroke = '#4ade80'; // Green
                
                const lobbyTimer = document.getElementById('lobby-timer-select');
                if (lobbyTimer && lobbyTimer.value !== 'default') {
                    seconds = parseInt(lobbyTimer.value);
                }
                if(seconds === 0 || !seconds || !timerEnabled) {
                    this.timerTotal = 0; text.innerText = '∞';
                    ring.style.strokeDashoffset = '0';
                    return;
                }
                
                if (!isResume) {
                    this.timerTotal = seconds;
                }
                this.timeLeft = seconds;
                
                this.timerInterval = setInterval(() => {
                    if (this.isFrozen) return;
                    this.timeLeft--;
                    text.innerText = this.timeLeft;
                    
                    const pct = this.timeLeft / this.timerTotal;
                    ring.style.strokeDashoffset = 283 - (283 * pct); // 283 is approx circumference of r=45
                    
                    if(this.timeLeft <= 10) {
                        ring.style.stroke = '#ef4444'; // Red
                        text.classList.add('text-red-500');
                        Audio.tickFast();
                        document.getElementById('game-body').style.animation = 'pulse-red 1s infinite';
                    } else if(this.timeLeft <= this.timerTotal/2) {
                        ring.style.stroke = '#f59e0b'; // Orange
                    } else {
                        Audio.tick();
                    }

                    if(this.timeLeft <= 0) {
                        clearInterval(this.timerInterval);
                        Audio.wrong(); Mascot.react('sad');
                        this.levelTimeout = setTimeout(()=>this.loadLevel(), 2000); // Fail level, reload same
                    }
                }, 1000);
            },

            renderSlots() {
                const con = document.getElementById('sentence-container');
                con.innerHTML = '';
                this.words.forEach((w,i) => {
                    const s = document.createElement('div');
                    s.className = 'word-slot shadow-inner relative';
                    s.dataset.w = w.toLowerCase();
                    con.appendChild(s);
                    this.slots.push({ el: s, w: w.toLowerCase(), filled: false });
                });
            },
            createBubbles() {
                this.bubbles = []; const area = document.getElementById('physics-area');
                area.innerHTML = '';
                const shuffled = [...this.words].sort(()=>Math.random()-0.5);
                const aRect = area.getBoundingClientRect();
                let sizeMult = 1;
                if (window.Storage && Storage.data && Storage.data.profile && Storage.data.profile.settings) {
                    sizeMult = Storage.data.profile.settings.bubbleSize || 1;
                }
                
                shuffled.forEach(w => {
                    const el = document.createElement('div');
                    el.className = 'bubble-word'; el.innerText = w;
                    el.style.transform = `scale(${sizeMult})`;
                    area.appendChild(el);
                    const bR = el.getBoundingClientRect();
                    let bx = Math.random() * (aRect.width - bR.width);
                    if (isNaN(bx) || bx < 0) bx = aRect.width / 2 || 100;
                    let by = Math.random() * (aRect.height - bR.height);
                    if (isNaN(by) || by < 0) by = aRect.height / 2 || 100;
                    
                    this.bubbles.push({
                        el, wordText: w,
                        x: bx,
                        y: by,
                        w: bR.width || 100, h: bR.height || 40,
                        vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4,
                        snapped: false, scaleX: 1, scaleY: 1,
                        shakeTime: 0
                    });
                    
                    // Bind pointerdown directly to the element to avoid pointer-events bubbling bugs on mobile
                    el.addEventListener('pointerdown', e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const clickedB = this.bubbles.find(bb => bb.el === el);
                        if(!clickedB) return;
                        
                        if (clickedB.snapped) {
                            this.unsnap(clickedB);
                            return;
                        }
                        
                        this.dragB = clickedB;
                        const r = clickedB.el.getBoundingClientRect();
                        this.dragOff = { x: e.clientX - r.left, y: e.clientY - r.top };
                        clickedB.el.classList.add('dragging');
                        clickedB.vx = 0; clickedB.vy = 0;
                        
                        clickedB.startX = e.clientX;
                        clickedB.startY = e.clientY;
                        clickedB.isClick = true;
                    });

                    
                    

                    
                });
            },

            setupDrag() {
                const doc = document.getElementById('screen-game');
                
                
                // (pointerdown is now bound directly to bubbles)
                window.addEventListener('pointermove', e => {
                    if(this.dragB) {
                        const bnds = document.getElementById('physics-area').getBoundingClientRect();
                        let newX = e.clientX - bnds.left - this.dragOff.x;
                        let newY = e.clientY - bnds.top - this.dragOff.y;
                        this.dragB.x = newX;
                        this.dragB.y = newY;
                        
                        // Jitter tolerance
                        const dist = Math.hypot(e.clientX - this.dragB.startX, e.clientY - this.dragB.startY);
                        if (dist > 25) {
                            this.dragB.isClick = false;
                        }
                    }
                });

                window.addEventListener('pointercancel', e => {
                    if (this.dragB) {
                        this.dragB.el.classList.remove('dragging');
                        this.dragB = null;
                    }
                });

                window.addEventListener('pointerup', e => {
                    if(this.dragB) {
                        const clickedB = this.dragB;
                        this.dragB.el.classList.remove('dragging');
                        this.dragB = null;
                        
                        if (clickedB.isClick) {
                            const nextI = this.slots.findIndex(s => !s.filled);
                            if (nextI !== -1) {
                                if (this.slots[nextI].w === clickedB.wordText.toLowerCase()) {
                                    this.correct(clickedB, this.slots[nextI]);
                                } else {
                                    this.wrong(clickedB, this.slots[nextI]);
                                }
                            }
                        } else {
                            this.checkDrop(clickedB, e.clientX, e.clientY);
                        }
                    }
                });
            },
            checkDrop(b, cx, cy) {
                const pad = 30; // Generous hit area
                const wordText = b.wordText.toLowerCase();
                
                // First check if they dropped it on ANY empty slot
                for (let slot of this.slots) {
                    if (slot.filled) continue;
                    const r = slot.el.getBoundingClientRect();
                    if(cx > r.left-pad && cx < r.right+pad && cy > r.top-pad && cy < r.bottom+pad) {
                        if(wordText === slot.w) {
                            this.correct(b, slot);
                            return;
                        } else {
                            this.wrong(b, slot);
                            return; // dropped on wrong slot
                        }
                    }
                }

                // If they dropped it anywhere else, act like a click and drop into the next available slot
                const nextI = this.slots.findIndex(s => !s.filled);
                if (nextI !== -1) {
                    if (this.slots[nextI].w === wordText) {
                        this.correct(b, this.slots[nextI]);
                    } else {
                        this.wrong(b, this.slots[nextI]);
                    }
                }
            },

            correct(b, slot) {
                b.snapped = true; slot.filled = true; this.placed++;
                Audio.snap(); Mascot.react('happy');
                const r = slot.el.getBoundingClientRect();
                Particles.spawn(r.left + r.width/2, r.top + r.height/2, 20, '#4ade80');
                
                b.el.style.transform = 'none'; b.el.style.position = 'relative';
                b.el.style.left='auto'; b.el.style.top='auto';
                b.el.classList.add('snapped');
                slot.el.innerHTML=''; slot.el.appendChild(b.el); slot.el.classList.remove('highlight');
                
                // Scoring
                if (!b.hasScored) {
                    const diffMulti = this.sents[this.idx].diff;
                    this.score += (100 * diffMulti) + (this.combo * 50);
                    this.combo++; if(this.combo > this.maxCombo) this.maxCombo = this.combo;
                    
                    // Classroom Mode Add Points (Handled manually by teacher clicks now)
                    b.hasScored = true;
                }

                this.updateScore(); this.updateHints(); this.checkComboEffects();
                
                if(this.placed === this.words.length) {
                    clearInterval(this.timerInterval);
                    this.levelTimeout = setTimeout(()=>this.idxComplete(), 500);
                }
            },
            unsnap(b) {
                if(!b.snapped) return;
                const slot = this.slots.find(s => s.el.contains(b.el));
                if (slot && slot.filled) {
                    slot.filled = false;
                    if (!b.isError) {
                        this.placed--;
                    }
                }
                b.snapped = false;
                b.el.classList.remove('snapped');
                b.el.style.position = 'absolute';
                const area = document.getElementById('physics-area');
                area.appendChild(b.el);
                
                const aRect = area.getBoundingClientRect();
                b.x = aRect.width / 2;
                b.y = aRect.height / 2;
                b.vx = (Math.random()-0.5)*10;
                b.vy = (Math.random()-0.5)*10;
                
                if (window.Audio && Audio.click) Audio.click();
            },
            
                        wrong(b, slot) {
                if (!slot) return;
                
                // 1. Temporarily snap it to the slot so it appears in the box
                b.snapped = true;
                slot.filled = true;
                
                b.el.style.transform = 'none'; 
                b.el.style.position = 'relative';
                b.el.style.left = 'auto'; 
                b.el.style.top = 'auto';
                b.el.classList.add('snapped');
                slot.el.innerHTML = ''; 
                slot.el.appendChild(b.el);

                // 2. Mark it wrong visually
                slot.el.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                slot.el.style.borderColor = '#ef4444';
                b.el.style.borderColor = '#ef4444';
                b.el.style.color = '#7f1d1d';
                b.el.style.background = 'radial-gradient(circle at 30% 30%, #fecaca, #f87171)';
                
                let xMark = document.createElement('div');
                xMark.className = 'wrong-x-slot absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-red-500 font-black z-20 pointer-events-none drop-shadow-md';
                xMark.innerText = '❌';
                slot.el.appendChild(xMark);
                
                Audio.wrong(); Mascot.react('sad');
                this.combo = 0; this.mistakes++; this.updateScore();
                
                b.el.classList.add('wrong-shake'); // CSS shake
                b.isError = true;
                
                // 3. Wait 800ms, then pop it back out
                setTimeout(() => {
                    if (xMark) xMark.remove();
                    slot.el.style.backgroundColor = '';
                    slot.el.style.borderColor = '';
                    
                    b.el.style.borderColor = '';
                    b.el.style.color = '';
                    b.el.style.background = ''; b.el.classList.remove('wrong-shake');
                    
                    // Only unsnap if user hasn't already pulled it out manually
                    if (b.snapped && b.el.parentElement === slot.el) {
                        this.unsnap(b);
                        // Add an extra bounce when it pops out
                        b.vy = -15; 
                        b.vx = (Math.random()-0.5)*20;
                    }
                    
                    b.isError = false;
                }, 800);
                
                this.checkComboEffects();
            },
            updateScore() {
                // Score is hidden now
            },
            updateHints() {
                if(!this.hintsEnabled) return;
                this.slots.forEach(s=>s.el.classList.remove('highlight'));
                const n = this.slots.find(s=>!s.filled);
                if(n) n.el.classList.add('highlight');
            },
            usePowerup(type) {
                if (type === 'hint') {
                    this.showHint();
                } else if (type === 'solve') {
                    this.showAnswer();
                } else if (type === 'show') {
                    this.showAllAnswers();
                } else if (type === 'freeze') {
                    const btn = document.getElementById('btn-freeze');
                    if (this.isFrozen) {
                        this.isFrozen = false;
                        if (btn) btn.innerHTML = '❄️ Freeze';
                        if(this.freezeTimeout) clearTimeout(this.freezeTimeout);
                        document.getElementById('timer-container').style.filter = '';
                        document.getElementById('ui-timer-text').style.color = '';
                        this.bubbles.forEach(b => {
                            if (!b.snapped && this.dragB !== b) {
                                b.vx = (Math.random() - 0.5) * 4;
                                b.vy = (Math.random() - 0.5) * 4;
                            }
                        });
                    } else {
                        this.isFrozen = true;
                        if (btn) btn.innerHTML = '❄️ Unfreeze';
                        Audio.coin();
                        Particles.spawn(window.innerWidth/2, window.innerHeight/2, 50, '#93c5fd', 'sparkle', 2);
                        document.getElementById('timer-container').style.filter = 'drop-shadow(0 0 20px #60a5fa)';
                        document.getElementById('ui-timer-text').style.color = '#3b82f6';
                        this.freezeTimeout = setTimeout(() => {
                            this.isFrozen = false;
                            if (btn) btn.innerHTML = '❄️ Freeze';
                            document.getElementById('timer-container').style.filter = '';
                            document.getElementById('ui-timer-text').style.color = '';
                        }, 10000); // 10 seconds of freeze
                    }
                }
            },
            showHint() {
                const n = this.slots.find(s=>!s.filled);
                if(n) {
                    const b = this.bubbles.find(b => !b.snapped && b.wordText.toLowerCase() === n.w);
                    if(b) {
                        b.shakeTime = 800;
                        b.el.style.borderColor = '#fbbf24';
                        b.el.style.color = '#fbbf24';
                        b.vx = 0; b.vy = 0;
                        if(window.Audio && Audio.coin) Audio.coin();
                        setTimeout(() => {
                            if(b && b.el) {
                                b.el.style.borderColor = '';
                                b.el.style.color = '';
                            }
                        }, 1000);
                    }
                }
            },
            showAnswer() {
                const n = this.slots.find(s=>!s.filled);
                if(n) {
                    const b = this.bubbles.find(b => !b.snapped && b.wordText.toLowerCase() === n.w);
                    if(b) {
                        this.correct(b, n);
                    }
                }
            },
            showAllAnswers() {
                const unfurls = this.slots.filter(s => !s.filled);
                unfurls.forEach((n, idx) => {
                    setTimeout(() => {
                        const b = this.bubbles.find(b => !b.snapped && b.wordText.toLowerCase() === n.w);
                        if(b) {
                            this.correct(b, n);
                        }
                    }, idx * 150); // Stagger the snapping slightly
                });
            },
            checkComboEffects() {
                // Apply visual classes to all unsnapped bubbles
                this.bubbles.forEach(b => {
                    b.el.classList.remove('bubble-combo-fire', 'bubble-combo-rainbow');
                    if(this.combo >= 5 && this.combo < 10) b.el.classList.add('bubble-combo-fire');
                    if(this.combo >= 10) b.el.classList.add('bubble-combo-rainbow');
                });
                if(this.combo === 5) Particles.fireworks();
            },

            idxComplete() {
                if(!this.isPlaying) return;
                Particles.fireworks();
                this.idx++;
                if(this.idx >= this.sents.length) { this.levelTimeout = setTimeout(()=>this.winGame(), 1500); }
                else { this.levelTimeout = setTimeout(()=>this.loadLevel(), 800); }
            },

            winGame() {
                if(!this.isPlaying) return;
                this.stopPhysics(); document.getElementById('game-body').style.animation='none';
                Audio.win(); Particles.fireworks();
                
                const totalW = this.sents.reduce((acc, val) => acc + val.text.split(' ').length, 0);
                const acc = Math.max(0, Math.round(((totalW - this.mistakes)/totalW)*100));
                
                let stars = 1; if(acc > 80) stars = 2; if(acc === 100) stars = 3;
                let coinsEarned = this.score;
                
                // Save
                if(!Storage.data.progress[this.cat.id]) Storage.data.progress[this.cat.id] = { stars: 0 };
                Storage.data.progress[this.cat.id].stars = Math.max(Storage.data.progress[this.cat.id].stars, stars);
                Storage.addCoins(coinsEarned);

                document.getElementById('win-accuracy').innerText = `${acc}%`;
                document.getElementById('win-combo').innerText = this.maxCombo;
                document.getElementById('win-stars').innerHTML = '<span class="text-4xl text-blue-500 font-black">GREAT JOB!</span>';
                
                // Animated Coin counter
                const ce = document.getElementById('win-coins');
                ce.innerText = '0';
                let c = 0; const step = Math.ceil(coinsEarned/30);
                const cInt = setInterval(()=>{
                    c += step; if(c >= coinsEarned) { c = coinsEarned; clearInterval(cInt); }
                    ce.innerText = c; Audio.click();
                }, 50);

                this.showScreen('screen-win');
                setTimeout(()=>{
                    document.getElementById('win-modal').classList.remove('scale-0');
                    document.getElementById('win-modal').classList.add('scale-100');
                    Particles.coinExplosion(window.innerWidth/2, window.innerHeight/2);
                }, 100);
            },

            startPhysics() {
                this.stopPhysics(); let lastT = performance.now();
                const loop = (t) => {
                    try {
                    let dt = (t - lastT) / 16.66; lastT = t; if (dt > 3) dt = 3;
                    const bnds = document.getElementById('physics-area').getBoundingClientRect();
                    
                    let speedMult = 1;
                    let sizeMult = 1;
                    if (window.Storage && Storage.data && Storage.data.profile && Storage.data.profile.settings) {
                        speedMult = Storage.data.profile.settings.bubbleSpeed || 1;
                        sizeMult = Storage.data.profile.settings.bubbleSize || 1;
                    }
                    if (this.isFrozen) speedMult = 0; // stop when frozen

                    this.bubbles.forEach((b, i) => {
                        if (b.snapped) return;
                        
                        let rot = 0;
                        if (this.dragB === b) {
                            // If being dragged, skip physics, but set scale
                            b.scaleX = 1.1;
                            b.scaleY = 1.1;
                        } else {
                            if (this.isFrozen) {
                                b.vx = 0;
                                b.vy = 0;
                            } else {
                                // Gentle wandering force in any direction
                                b.vx += (Math.random() - 0.5) * 0.1 * dt * speedMult;
                                b.vy += (Math.random() - 0.5) * 0.1 * dt * speedMult;
                            }
                            
                            // Maintain a steady, gentle speed (prevents stopping or moving too fast)
                            let speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
                            if (b.isError && speed > 10) {
                                b.vx = (b.vx / speed) * 10;
                                b.vy = (b.vy / speed) * 10;
                            } else if (!b.isError && speed > 2.5) {
                                b.vx = (b.vx / speed) * 2.5;
                                b.vy = (b.vy / speed) * 2.5;
                            } else if (speed < 0.5 && speed > 0) {
                                b.vx = (b.vx / speed) * 0.5;
                                b.vy = (b.vy / speed) * 0.5;
                            }

                            b.x += b.vx * dt; b.y += b.vy * dt;
                            if (isNaN(b.x)) b.x = bnds.width / 2;
                            if (isNaN(b.y)) b.y = bnds.height / 2;
                            
                            // Wobble organically
                            b.scaleX = 1 + Math.sin(t/300 + i)*0.03;
                            b.scaleY = 1 + Math.cos(t/300 + i)*0.03;
                            
                            // Bounds (Elastic bounce instead of losing momentum)
                            const scaledW = b.w * sizeMult;
                            const scaledH = b.h * sizeMult;
                            const offsetX = (scaledW - b.w) / 2;
                            const offsetY = (scaledH - b.h) / 2;
                            
                            if(b.x < offsetX) { b.x = offsetX; b.vx *= -1; }
                            if(b.x + b.w + offsetX > bnds.width) { b.x = bnds.width - b.w - offsetX; b.vx *= -1; }
                            if(b.y < offsetY) { b.y = offsetY; b.vy *= -1; }
                            if(b.y + b.h + offsetY > bnds.height) { b.y = bnds.height - b.h - offsetY; b.vy *= -1; }
                            
                            // Collisions (Soft Repel)
                            for(let j=i+1; j<this.bubbles.length; j++) {
                                const b2 = this.bubbles[j];
                                if(b2.snapped || this.dragB === b2) continue;
                                const dx = (b.x+b.w/2) - (b2.x+b2.w/2);
                                const dy = (b.y+b.h/2) - (b2.y+b2.h/2);
                                const dist = Math.sqrt(dx*dx + dy*dy);
                                const minDist = (b.w + b2.w)*0.45;
                                if(dist < minDist && dist>0) {
                                    const force = (minDist - dist)*0.1;
                                    const ax = (dx/dist)*force; const ay = (dy/dist)*force;
                                    b.vx += ax; b.vy += ay; b2.vx -= ax; b2.vy -= ay;
                                }
                            }
                            rot = b.vx * 3;
                        }
                        
                        let renderX = b.x;
                        let renderY = b.y;
                        if (b.shakeTime > 0) {
                            renderX += (Math.random() - 0.5) * 15;
                            renderY += (Math.random() - 0.5) * 15;
                            b.shakeTime -= dt * 16.66;
                        }
                        
                        b.el.style.transform = `translate(${renderX}px, ${renderY}px) scale(${b.scaleX * sizeMult}, ${b.scaleY * sizeMult}) rotate(${rot}deg)`;
                    });
                    this.physFrame = requestAnimationFrame(loop);
                    } catch (err) {
                        document.getElementById('ui-lesson-status').innerText = err.toString();
                    }
                };
                this.physFrame = requestAnimationFrame(loop);
            },
            stopPhysics() { if(this.physFrame) cancelAnimationFrame(this.physFrame); }
        };

        // --- STREAMING_CHUNK:Teacher Dashboard... ---
        const Editor = {
            cCatId: null,
            init() { this.renderCat(); },
            
            renderCat() {
                const con = document.getElementById('editor-categories'); con.innerHTML = '';
                Storage.data.categories.forEach(c => {
                    const el = document.createElement('div');
                    const count = Storage.getSents(c.id).length;
                    el.className = `p-4 rounded-xl cursor-pointer font-bold border-4 flex justify-between items-center transition-all shadow-sm ${this.cCatId === c.id ? 'bg-blue-100 border-blue-500' : 'bg-white border-transparent hover:border-blue-300'}`;
                    el.innerHTML = `<span class="text-xl">${c.icon} ${c.name}</span> <span class="bg-blue-500 text-white rounded-full px-3 py-1 text-sm">${count}</span>`;
                    el.onclick = () => this.selCat(c.id);
                    con.appendChild(el);
                });
                if(!this.cCatId && Storage.data.categories.length>0) this.selCat(Storage.data.categories[0].id);
            },
            selCat(id) {
                this.cCatId = id; const c = Storage.getCat(id);
                document.getElementById('editor-current-cat').innerText = `${c.icon} ${c.name}`;
                document.getElementById('editor-timer').value = c.timer || 0;
                document.getElementById('btn-edit-cat').classList.remove('hidden');
                this.renderCat(); this.renderSents();
            },
            updateCategoryTimer() {
                if(!this.cCatId) return;
                const c = Storage.getCat(this.cCatId);
                c.timer = parseInt(document.getElementById('editor-timer').value);
                Storage.save();
            },
            renderSents() {
                if(!this.cCatId) return;
                const sents = Storage.getSents(this.cCatId);
                document.getElementById('editor-cat-count').innerText = `${sents.length} sentences`;
                const con = document.getElementById('editor-sentences'); con.innerHTML = '';
                sents.forEach(s => {
                    const el = document.createElement('div');
                    el.className = 'bg-white p-4 rounded-xl border-2 shadow-sm flex justify-between items-center transition-all hover:border-blue-300';
                    el.innerHTML = `
                        <div class="flex items-center gap-4 flex-1 cursor-pointer" onclick="Editor.openSentModal('${s.id}')">
                            <span class="text-4xl bg-gray-100 p-2 rounded-xl">${s.emoji}</span>
                            <div class="flex flex-col">
                                <span class="font-black text-gray-800 text-lg">${s.text}</span>
                                <span class="text-xs font-bold text-gray-500">Diff: ${s.diff}</span>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="Editor.openSentModal('${s.id}')" class="btn-premium px-4 py-2 bg-blue-100 text-blue-600 border-blue-200">✏️</button>
                            <button onclick="Editor.delSent('${s.id}')" class="btn-premium px-4 py-2 bg-red-100 text-red-600 border-red-200">🗑️</button>
                        </div>
                    `;
                    con.appendChild(el);
                });
            },
            
            editingCatId: null,
            editingSentId: null,

            openCatModal(id = null) {
                if (typeof id !== 'string') id = null;
                this.editingCatId = id;
                const modal = document.getElementById('modal-cat');
                const title = document.getElementById('modal-cat-title');
                const nameInp = document.getElementById('modal-cat-name');
                const iconInp = document.getElementById('modal-cat-icon');
                const delBtn = document.getElementById('modal-cat-del');
                
                if (id) {
                    const c = Storage.getCat(id);
                    title.innerText = 'Edit Lesson';
                    nameInp.value = c.name;
                    iconInp.value = c.icon;
                    delBtn.classList.remove('hidden');
                } else {
                    title.innerText = 'New Lesson';
                    nameInp.value = '';
                    iconInp.value = '📚';
                    delBtn.classList.add('hidden');
                }
                modal.classList.remove('hidden');
            },
            closeCatModal() {
                document.getElementById('modal-cat').classList.add('hidden');
            },
            saveCat() {
                const name = document.getElementById('modal-cat-name').value.trim();
                const icon = document.getElementById('modal-cat-icon').value.trim() || '📚';
                if (!name) return Dialog.alert("Lesson name is required.");
                
                if (this.editingCatId) {
                    const c = Storage.getCat(this.editingCatId);
                    c.name = name;
                    c.icon = icon;
                } else {
                    const id = 'cat_' + Date.now();
                    Storage.data.categories.push({ id, name, icon, timer: 60, color: '#'+Math.floor(Math.random()*16777215).toString(16), x: Math.random()*80+10, y: Math.random()*80+10 });
                    this.cCatId = id;
                }
                Storage.save();
                this.closeCatModal();
                this.renderCat();
                if (this.cCatId) this.selCat(this.cCatId);
            },
            deleteCat() {
                if (!this.editingCatId) return;
                Dialog.confirm("Are you sure you want to delete this lesson and ALL its sentences?", (yes) => {
                    if (!yes) return;
                    Storage.data.categories = Storage.data.categories.filter(c => c.id !== this.editingCatId);
                    Storage.data.sentences = Storage.data.sentences.filter(s => s.catId !== this.editingCatId);
                    Storage.save();
                    this.cCatId = Storage.data.categories.length > 0 ? Storage.data.categories[0].id : null;
                    this.closeCatModal();
                    this.renderCat();
                    if (this.cCatId) {
                        this.selCat(this.cCatId);
                    } else {
                        document.getElementById('editor-current-cat').innerText = `Select a category`;
                        document.getElementById('editor-cat-count').innerText = `0 sentences`;
                        document.getElementById('editor-sentences').innerHTML = '';
                        document.getElementById('btn-edit-cat').classList.add('hidden');
                    }
                });
            },

            openSentModal(id) {
                this.editingSentId = id;
                const s = Storage.data.sentences.find(x => x.id === id);
                if (!s) return;
                
                document.getElementById('modal-sent-text').value = s.text;
                document.getElementById('modal-sent-diff').value = s.diff;
                document.getElementById('modal-sent').classList.remove('hidden');
            },
            closeSentModal() {
                document.getElementById('modal-sent').classList.add('hidden');
            },
            saveSent() {
                const s = Storage.data.sentences.find(x => x.id === this.editingSentId);
                if (!s) return;
                const text = document.getElementById('modal-sent-text').value.trim();
                const emoji = '✨';
                if (!text) return Dialog.alert("Sentence text is required.");
                
                s.text = text;
                
                s.diff = parseInt(document.getElementById('modal-sent-diff').value);
                
                Storage.save();
                this.closeSentModal();
                this.renderSents();
            },
            
            addSentence() {
                if(!this.cCatId) return Dialog.alert("Select a category.");
                const input = document.getElementById('editor-new-sentence');
                const text = input.value.trim(); if(!text) return;
                const diff = parseInt(document.getElementById('editor-new-diff').value);
                const emoji = '✨';
                
                Storage.data.sentences.push({ id: 's_' + Date.now(), catId: this.cCatId, text, diff, emoji });
                Storage.save(); input.value = ''; 
                this.renderSents(); this.renderCat();
            },
            delSent(id) {
                Dialog.confirm("Delete this sentence?", (yes) => {
                    if (!yes) return;
                    Storage.data.sentences = Storage.data.sentences.filter(s => s.id !== id);
                    Storage.save(); this.renderSents(); this.renderCat();
                });
            },
            
            exportData() {
                const d = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Storage.data));
                const a = document.createElement('a'); a.href = d; a.download = "bubble_pro_backup.json";
                document.body.appendChild(a); a.click(); a.remove();
            },
            importData(e) {
                const f = e.target.files[0]; if(!f) return;
                const r = new FileReader();
                r.onload = ev => {
                    try {
                        const p = JSON.parse(ev.target.result);
                        if(p.categories && p.sentences) { Storage.data = p; Storage.save(); location.reload(); }
                    } catch(err) { Dialog.alert("Invalid backup file."); }
                }; r.readAsText(f); e.target.value = '';
            }
        };

        window.addEventListener('message', e => { if (!e.data || typeof e.data !== 'object') return; if (e.data.type === 'LOAD_GAME') {
                Storage.data.categories = [{ id: 'cat_1', name: e.data.data.topic || 'Custom Lesson', icon: '📚', timer: 60, color: '#4285F4', x: 50, y: 50 }];
                Storage.data.sentences = e.data.data.sentences.map(s => ({ ...s, id: 's_'+Math.random(), catId: 'cat_1' }));
                Storage.save();
                Game.buildWorldMap();
                Game.openLobby('cat_1');
            }
        });
        window.onload = () => { Game.init(); Editor.init(); Game.showScreen('screen-loading'); window.parent.postMessage({type: 'IFRAME_READY'}, '*'); };
    </script>
    <script>
        window.teamsData = [
            { id: 1, name: "Player 1", score: 0, color: "blue" }
        ];
        window.isSoundMuted = false;
        
        window.toggleSound = function() {
            window.isSoundMuted = !window.isSoundMuted;
            const btn = document.getElementById('sound-toggle-btn');
            if (btn) btn.innerText = window.isSoundMuted ? '🔇' : '🔊';
            
            if (typeof Audio !== 'undefined' && Audio.toggleSfx) {
                Audio.toggleSfx(!window.isSoundMuted);
                Audio.sfxEnabled = !window.isSoundMuted; // Hard set just in case
            }
        };
        
        window.addTeam = function() {
            const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink'];
            const id = window.teamsData.length > 0 ? Math.max(...window.teamsData.map(t => t.id)) + 1 : 1;
            window.teamsData.push({ id, name: "Player " + id, score: 0, color: colors[(id-1) % colors.length] });
            renderTeams();
            if (typeof window.renderLobbyTeams === 'function') window.renderLobbyTeams();
        }

        window.removeTeam = function(id) {
            if (window.teamsData.length <= 1) return;
            window.teamsData = window.teamsData.filter(t => t.id !== id);
            renderTeams();
            if (typeof window.renderLobbyTeams === 'function') window.renderLobbyTeams();
        }
        
        window.renameTeam = function(id) {
            const team = window.teamsData.find(t => t.id === id);
            if (!team) return;
            const modal = document.getElementById('modal-rename-team');
            const input = document.getElementById('rename-team-input');
            const saveBtn = document.getElementById('rename-team-save-btn');
            
            input.value = team.name;
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
            input.focus();
            
            saveBtn.onclick = () => {
                const newName = input.value;
                if (newName && newName.trim()) {
                    // Sanitize input
                    const sanitized = newName.trim().replace(/[&<>'"]/g, 
                        tag => ({
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            "'": '&#39;',
                            '"': '&quot;'
                        }[tag] || tag));
                    team.name = sanitized;
                    if (typeof renderTeams === 'function') renderTeams();
                    if (typeof window.renderLobbyTeams === 'function') window.renderLobbyTeams();
                }
                modal.style.display = 'none';
                modal.classList.add('hidden');
            };
            
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    saveBtn.click();
                } else if (e.key === 'Escape') {
                    modal.style.display = 'none';
                    modal.classList.add('hidden');
                }
            };
        }
        
        function updateTeamScore(id, delta) {
            const team = window.teamsData.find(t => t.id === id);
            if (!team) return;
            team.score = Math.max(0, team.score + delta);
            if (delta > 0) {
                if (!window.isSoundMuted && typeof Audio !== 'undefined' && Audio.coin) Audio.coin();
                if (typeof Particles !== 'undefined') {
                    const xOffset = id % 2 === 0 ? 150 : -150;
                    const hexColors = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', yellow: '#eab308', purple: '#a855f7', pink: '#ec4899' };
                    Particles.spawn(window.innerWidth/2 + xOffset, 80, 10, hexColors[team.color] || '#3b82f6', 'sparkle', 1.5);
                }
            }
            renderTeams();
        }
        
        
        window.renderLobbyTeams = function() {
            const list = document.getElementById('lobby-teams-list');
            const countLabel = document.getElementById('lobby-team-count');
            if (!list || !countLabel) return;
            
            countLabel.innerText = window.teamsData.length;
            
            let html = '';
            window.teamsData.forEach(t => {
                const colorMap = {
                    blue: { bg: 'bg-blue-500 text-white', border: 'border-blue-600' },
                    red: { bg: 'bg-red-500 text-white', border: 'border-red-600' },
                    green: { bg: 'bg-green-500 text-white', border: 'border-green-600' },
                    yellow: { bg: 'bg-yellow-400 text-yellow-900', border: 'border-yellow-500' },
                    purple: { bg: 'bg-purple-500 text-white', border: 'border-purple-600' },
                    pink: { bg: 'bg-pink-500 text-white', border: 'border-pink-600' }
                };
                const c = colorMap[t.color] || colorMap.blue;
                
                html += `
                    <div class="inline-flex items-stretch rounded-xl font-bold border-b-4 transition-transform hover:-translate-y-1 active:translate-y-0 active:border-b-0 shadow-sm overflow-hidden ${c.bg} ${c.border}">
                        <button onclick="window.renameTeam(${t.id});" class="px-4 py-2 hover:bg-white/20 flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                            ${t.name} ✏️
                        </button>
                        ${window.teamsData.length > 1 ? `<button onclick="window.removeTeam(${t.id});" class="px-3 py-2 border-l border-white/30 hover:bg-red-500/80 flex items-center justify-center transition-colors">✖</button>` : ''}
                    </div>
                `;
            });
            list.innerHTML = html;
        };

        function renderTeams() {
            const container = document.getElementById('teams-container');
            if (!container) return;
            
            let html = '';
            window.teamsData.forEach(t => {
                const colorMap = {
                    blue: { bg: 'bg-blue-500/90 hover:bg-blue-400', border: 'border-blue-300' },
                    red: { bg: 'bg-red-500/90 hover:bg-red-400', border: 'border-red-300' },
                    green: { bg: 'bg-green-500/90 hover:bg-green-400', border: 'border-green-300' },
                    yellow: { bg: 'bg-yellow-500/90 hover:bg-yellow-400', border: 'border-yellow-300' },
                    purple: { bg: 'bg-purple-500/90 hover:bg-purple-400', border: 'border-purple-300' },
                    pink: { bg: 'bg-pink-500/90 hover:bg-pink-400', border: 'border-pink-300' }
                };
                const c = colorMap[t.color];
                
                html += `
                    <div class="flex items-center gap-1 group">
                        <button 
                            onclick="updateTeamScore(${t.id}, 1)" 
                            oncontextmenu="event.preventDefault(); updateTeamScore(${t.id}, -1)" 
                            class="team-score glass ${c.bg} text-white px-4 py-2 rounded-full font-black text-xl shadow-lg ${c.border} cursor-pointer transform hover:scale-105 transition-transform flex items-center gap-2">
                            <span>${t.name}</span>: <span id="score-team${t.id}">${t.score}</span>
                        </button>
                    </div>
                `;
            });
            container.innerHTML = html;
            
            // Also update lobby teams if visible
            if (typeof window.renderLobbyTeams === 'function') {
                window.renderLobbyTeams();
            }
        }
        
        // Wait for DOM
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(renderTeams, 500);
        });
