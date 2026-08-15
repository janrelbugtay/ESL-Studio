import React, { useState, useEffect, useRef, useCallback } from 'react';

// Simple Audio Synthesizer for self-contained sound effects
const SoundEngine = {
    ctx: null as AudioContext | null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    },
    playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },
    click() { this.playTone(600, 'sine', 0.1, 0.05); },
    spin() { this.playTone(800, 'square', 0.05, 0.02); },
    correct() { 
        this.playTone(440, 'sine', 0.1, 0.1); 
        setTimeout(() => this.playTone(660, 'sine', 0.3, 0.15), 100);
    },
    wrong() {
        this.playTone(300, 'sawtooth', 0.2, 0.1);
        setTimeout(() => this.playTone(250, 'sawtooth', 0.4, 0.15), 150);
    },
    timesUp() {
        this.playTone(800, 'square', 0.5, 0.2);
    }
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const LETTER_VALUES: Record<string, number> = {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1,
    J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1,
    S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

const SPIN_COLORS = [
    { bg: 'bg-pink-400', text: 'from-pink-300 to-pink-500' },
    { bg: 'bg-purple-400', text: 'from-purple-300 to-purple-500' },
    { bg: 'bg-yellow-400', text: 'from-yellow-300 to-yellow-500' },
    { bg: 'bg-green-400', text: 'from-green-300 to-green-500' },
    { bg: 'bg-orange-400', text: 'from-orange-300 to-orange-500' },
    { bg: 'bg-cyan-400', text: 'from-cyan-300 to-cyan-500' },
    { bg: 'bg-rose-400', text: 'from-rose-300 to-rose-500' }
];

const PHASES = {
    SETUP: 'setup',
    SPIN_1: 'spin_1',
    SPIN_2: 'spin_2',
    READY: 'ready',
    GUESSING: 'guessing',
    RESULT: 'result'
};

const Confetti = ({ active }: { active: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: any[] = [];
        const colors = ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#3b82f6', '#10b981', '#fbbf24'];

        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: Math.random() * 10 + 5,
                h: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                vy: Math.random() * 3 + 2,
                vx: Math.random() * 2 - 1,
                rot: Math.random() * 360,
                rs: Math.random() * 5 - 2.5
            });
        }

        let animationId: number;
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.y += p.vy;
                p.x += p.vx;
                p.rot += p.rs;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rot * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
                if (p.y > canvas.height) p.y = -20;
            });
            animationId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(animationId);
    }, [active]);

    if (!active) return null;
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
};

const Setup = ({ onStart }: { onStart: (config: any) => void }) => {
    const [timer, setTimer] = useState(15);
    const [mode, setMode] = useState('min');
    const [wordLength, setWordLength] = useState(4);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-8 overflow-hidden w-full">
            {/* Immersive Baby Blue Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-sky-500/20 rounded-full blur-[120px] pointer-events-none animate-[pulse_4s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-sky-300/20 rounded-full blur-[120px] pointer-events-none animate-[pulse_6s_ease-in-out_infinite]"></div>
            
            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
                <h1 className="text-6xl md:text-8xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-sky-200 to-sky-500 tracking-tighter drop-shadow-[0_0_30px_rgba(56,189,248,0.5)] text-center">
                    LETTER LOCK
                </h1>
                <p className="text-2xl text-sky-200 mb-12 font-bold tracking-[0.2em] uppercase bg-sky-900/30 px-6 py-2 rounded-full border border-sky-400/20 backdrop-blur-sm shadow-[0_0_20px_rgba(56,189,248,0.2)]">Game Settings</p>

                <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] shadow-[0_0_80px_rgba(56,189,248,0.15)] border border-white/10 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-400/5 to-transparent pointer-events-none"></div>
                    <div className="space-y-10 relative z-10">
                        <div>
                            <label className="block text-lg font-bold text-sky-100 mb-4 uppercase tracking-wider">Time Limit</label>
                            <div className="flex items-center gap-6">
                                <input type="range" min="5" max="30" step="5" value={timer} onChange={e => setTimer(Number(e.target.value))} className="w-full h-4 bg-sky-950 rounded-full appearance-none cursor-pointer accent-sky-400 shadow-inner" />
                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-sky-300 w-24 text-right drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">{timer}s</div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/30 to-transparent"></div>

                        <div>
                            <label className="block text-lg font-bold text-sky-100 mb-4 uppercase tracking-wider">Word Rule</label>
                            <select value={mode} onChange={e => setMode(e.target.value)} className="w-full bg-sky-950/50 text-white text-xl font-bold px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-sky-400/50 border border-sky-400/20 cursor-pointer appearance-none shadow-inner">
                                <option value="min">Minimum Length (e.g. 4+ letters)</option>
                                <option value="fixed">Fixed Length (Exact size)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-lg font-bold text-sky-100 mb-4 uppercase tracking-wider">{mode === 'fixed' ? 'Exact Letters Required' : 'Minimum Letters Required'}</label>
                            <div className="flex justify-between gap-4">
                                {[3,4,5,6,7,8].map(num => (
                                    <button key={num} onClick={() => setWordLength(num)} className={`flex-1 aspect-square rounded-2xl text-3xl font-black transition-all duration-300 flex items-center justify-center ${wordLength === num ? 'bg-gradient-to-br from-sky-300 to-sky-500 text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.6)] scale-110 border-none' : 'bg-white/5 text-sky-200 hover:bg-white/10 border border-white/10 hover:border-sky-400/30'}`}>
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => onStart({ timer, mode, wordLength })}
                    className="mt-14 bg-gradient-to-r from-sky-300 to-sky-500 hover:from-sky-200 hover:to-sky-400 text-slate-950 text-3xl font-black py-6 px-20 rounded-full shadow-[0_0_60px_rgba(56,189,248,0.7)] transform hover:scale-[1.05] transition-all active:scale-95 border border-white/50"
                >
                    START GAME 🚀
                </button>
            </div>
        </div>
    );
};

const Game = ({ settings, onRestart }: { settings: any, onRestart: () => void }) => {
    const [phase, setPhase] = useState(PHASES.SPIN_1);
    
    const [scores, setScores] = useState<Record<string, number>>({ team1: 0, team2: 0 });
    
    const [letter1, setLetter1] = useState<any>(null); // { char: 'A', colorObj: {...} }
    const [letter2, setLetter2] = useState<any>(null);
    
    const [spinning, setSpinning] = useState(false);
    const [highlighted, setHighlighted] = useState<any>(null); // { index: 0, colorObj: {...} }
    
    const [timeLeft, setTimeLeft] = useState(settings.timer);
    const [isTimerActive, setIsTimerActive] = useState(false);
    
    const [lastResult, setLastResult] = useState<string | null>(null); // 'correct', 'wrong'

    // Initialize Audio on first interaction
    useEffect(() => {
        const initAudio = () => SoundEngine.init();
        window.addEventListener('click', initAudio, { once: true });
        return () => window.removeEventListener('click', initAudio);
    }, []);

    // Timer Logic
    useEffect(() => {
        let interval: any = null;
        if (isTimerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time: number) => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerActive) {
            setIsTimerActive(false);
            SoundEngine.timesUp();
            handleResult('wrong', true);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timeLeft]);

    const startSpin = (targetLetterNum: number) => {
        if (spinning) return;
        setSpinning(true);
        SoundEngine.click();
        
        let spinCount = 0;
        const totalSpins = Math.floor(Math.random() * 15) + 20; // 20 to 35 spins
        let currentDelay = 40;
        
        const spinStep = () => {
            SoundEngine.spin();
            
            setHighlighted((prev: any) => {
                let next;
                do {
                    next = Math.floor(Math.random() * ALPHABET.length);
                } while (prev && next === prev.index);
                
                const randomColor = SPIN_COLORS[Math.floor(Math.random() * SPIN_COLORS.length)];
                return { index: next, colorObj: randomColor };
            });
            
            spinCount++;
            
            if (spinCount < totalSpins) {
                if (spinCount > totalSpins - 10) currentDelay += 30;
                setTimeout(spinStep, currentDelay);
            } else {
                // Final selection locks in the letter AND the color
                const finalIndex = Math.floor(Math.random() * ALPHABET.length);
                const finalColor = SPIN_COLORS[Math.floor(Math.random() * SPIN_COLORS.length)];
                
                setHighlighted({ index: finalIndex, colorObj: finalColor });
                const finalLetter = { char: ALPHABET[finalIndex], colorObj: finalColor };
                
                setSpinning(false);
                SoundEngine.correct();
                
                if (targetLetterNum === 1) {
                    setLetter1(finalLetter);
                    setTimeout(() => {
                        setHighlighted(null);
                        setPhase(PHASES.SPIN_2);
                    }, 1500);
                } else {
                    setLetter2(finalLetter);
                    setTimeout(() => {
                         setHighlighted(null);
                         setPhase(PHASES.READY);
                    }, 1500);
                }
            }
        };

        setTimeout(spinStep, currentDelay);
    };

    const startGuessing = () => {
        setPhase(PHASES.GUESSING);
        setTimeLeft(settings.timer);
        setIsTimerActive(true);
    };

    const nextTurn = () => {
        setLetter1(null);
        setLetter2(null);
        setHighlighted(null);
        setLastResult(null);
        setPhase(PHASES.SPIN_1);
    };

    const handleResult = (status: string, isTimeOut = false) => {
        setIsTimerActive(false);
        if (status === 'correct') {
            SoundEngine.correct();
        } else {
            SoundEngine.wrong();
        }
        setLastResult(status);
        setPhase(PHASES.RESULT);
        setTimeout(nextTurn, 3000);
    };

    const generatePatternArray = () => {
        if (!letter1 || !letter2) return [];
        let arr = [];
        arr.push({ char: letter1.char, color: letter1.colorObj.text, type: 'letter' });
        
        if (settings.mode === 'fixed') {
            for(let i=0; i < settings.wordLength - 2; i++) arr.push({ char: '_', type: 'dash' });
        } else {
            arr.push({ char: '.', type: 'dash' });
            arr.push({ char: '.', type: 'dash' });
            arr.push({ char: '.', type: 'dash' });
        }
        
        arr.push({ char: letter2.char, color: letter2.colorObj.text, type: 'letter' });
        return arr;
    };

    const roundValue = (letter1 ? LETTER_VALUES[letter1.char] : 0) + (letter2 ? LETTER_VALUES[letter2.char] : 0);

    const updateScore = (team: string, amount: number) => {
        setScores(prev => ({ ...prev, [team]: Math.max(0, prev[team] + amount) }));
        SoundEngine.click();
    };

    const ScoreControls = ({ teamName, scoreKey, align }: { teamName: string, scoreKey: string, align: 'left' | 'right' }) => (
        <div className={`flex flex-col ${align === 'left' ? 'items-start' : 'items-end'} z-20`}>
            <div className="text-sky-200/50 font-black tracking-widest text-2xl mb-3 uppercase drop-shadow-md">{teamName}</div>
            <div className="bg-white/5 backdrop-blur-3xl border-2 border-white/10 rounded-[2.5rem] p-4 flex items-center gap-4 shadow-[0_0_40px_rgba(56,189,248,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 to-transparent pointer-events-none"></div>
                <button onClick={() => updateScore(scoreKey, -1)} className="relative z-10 w-14 h-14 rounded-full bg-slate-900/80 hover:bg-slate-800 text-sky-400 text-2xl font-black flex items-center justify-center transition-all border border-sky-400/20 active:scale-95 shadow-inner">
                    -1
                </button>
                <div className="relative z-10 text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-sky-300 w-32 text-center drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                    {scores[scoreKey]}
                </div>
                <button onClick={() => updateScore(scoreKey, 1)} className="relative z-10 w-14 h-14 rounded-full bg-sky-900/80 hover:bg-sky-800 text-sky-300 text-2xl font-black flex items-center justify-center transition-all border border-sky-400/40 active:scale-95 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                    +1
                </button>
            </div>
            {roundValue > 0 && (
                 <button onClick={() => updateScore(scoreKey, roundValue)} className="mt-4 w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-950 font-black py-3 px-6 rounded-[2rem] text-xl shadow-[0_0_20px_rgba(250,204,21,0.5)] transform hover:scale-105 active:scale-95 transition-all">
                     ADD {roundValue} PTS
                 </button>
            )}
        </div>
    );

    const AlphabetGrid = ({ target }: { target: number }) => (
        <div className="flex flex-col items-center animate-in zoom-in duration-500 w-full max-w-4xl bg-[#0b1325]/80 backdrop-blur-3xl border-2 border-sky-400/20 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative mt-4">
            <h2 className="relative z-10 text-4xl md:text-5xl font-black mb-10 text-white drop-shadow-[0_0_20px_rgba(56,189,248,0.3)] uppercase tracking-wider">
                {spinning ? "Selecting Letter..." : `START LETTER ${target}`}
            </h2>
            
            <div className="grid grid-cols-7 gap-4 mb-6 relative z-10 w-full">
                {ALPHABET.map((l, index) => {
                    const isHighlight = highlighted?.index === index;
                    const isL1 = letter1?.char === l;
                    const isL2 = letter2?.char === l;
                    
                    let bgClass = 'bg-[#142036] shadow-inner hover:bg-[#1a2842] border border-white/5';
                    let textClass = 'text-sky-200/40';
                    let transform = 'scale-100';
                    let shadow = '';

                    if (isHighlight) {
                        bgClass = highlighted.colorObj.bg;
                        textClass = 'text-slate-900';
                        transform = 'scale-110 z-20';
                        shadow = 'shadow-[0_0_30px_rgba(255,255,255,0.8)]';
                    } else if (isL1 && isL2) {
                        // Chosen Twice! Golden state
                        bgClass = 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-white';
                        textClass = 'text-slate-900';
                        transform = 'scale-105 z-10';
                        shadow = 'shadow-[0_0_25px_rgba(250,204,21,0.8)]';
                    } else if (isL1) {
                        bgClass = letter1.colorObj.bg;
                        textClass = 'text-slate-900';
                        transform = 'scale-105 z-10';
                        shadow = `shadow-[0_0_20px_rgba(255,255,255,0.4)]`;
                    } else if (isL2) {
                        bgClass = letter2.colorObj.bg;
                        textClass = 'text-slate-900';
                        transform = 'scale-105 z-10';
                        shadow = `shadow-[0_0_20px_rgba(255,255,255,0.4)]`;
                    }
                    
                    return (
                        <div 
                            key={l} 
                            className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all duration-75 relative ${bgClass} ${textClass} ${transform} ${shadow}`}
                        >
                            <span className="text-4xl font-black">{l}</span>
                            <span className="absolute bottom-1 right-2 text-[0.6rem] font-bold opacity-70">{LETTER_VALUES[l]}</span>
                        </div>
                    );
                })}
            </div>
            
            {!spinning && !((target === 1 && letter1) || (target === 2 && letter2)) && (
                <button 
                    onClick={() => startSpin(target)}
                    className="relative z-10 w-[80%] py-5 rounded-[1.5rem] text-4xl font-black text-[#0f172a] bg-gradient-to-b from-[#7dd3fc] to-[#38bdf8] shadow-[0_0_40px_rgba(56,189,248,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 border-b-8 border-[#0284c7] overflow-hidden group mt-4 flex items-center justify-center gap-4"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                    <span className="relative z-10 tracking-widest">SPIN THE WHEEL 🎲</span>
                </button>
            )}
        </div>
    );

    return (
        <div className="relative min-h-screen bg-[#020617] text-white font-sans overflow-hidden flex flex-col py-8 px-8 selection:bg-sky-900 w-full">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/30 via-[#020617] to-[#020617] pointer-events-none"></div>
            <div className="absolute top-[-30%] left-[-10%] w-[80%] h-[80%] bg-pink-600/15 rounded-full blur-[200px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-30%] right-[-10%] w-[80%] h-[80%] bg-cyan-500/15 rounded-full blur-[200px] pointer-events-none animate-[pulse_12s_ease-in-out_infinite]"></div>
            <div className="absolute top-[20%] left-[40%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite]"></div>

            <Confetti active={lastResult === 'correct'} />
            
            {/* Header & Manual Scoreboards */}
            <div className="relative z-10 flex justify-between items-start w-full max-w-[1600px] mx-auto mb-12">
                <ScoreControls teamName="Side A" scoreKey="team1" align="left" />
                
                <div className="flex flex-col items-center mx-8 mt-4">
                    <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-sky-200 to-sky-500 tracking-tighter drop-shadow-[0_0_40px_rgba(56,189,248,0.6)] cursor-pointer hover:scale-105 transition-transform" onClick={onRestart} title="Click to restart setup">
                        LETTER LOCK
                    </h1>
                </div>

                <ScoreControls teamName="Side B" scoreKey="team2" align="right" />
            </div>

            {/* Main Action Area */}
            <div className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col items-center justify-center relative z-10">
                
                {(phase === PHASES.SPIN_1) && <AlphabetGrid target={1} />}
                {(phase === PHASES.SPIN_2) && <AlphabetGrid target={2} />}
                
                {(phase === PHASES.READY || phase === PHASES.GUESSING) && (
                    <div className="flex flex-col items-center animate-in zoom-in duration-500 w-full max-w-5xl mt-8">
                        
                        <div className="bg-yellow-400 text-slate-900 text-2xl font-black px-8 py-2 rounded-full mb-6 shadow-[0_0_30px_rgba(250,204,21,0.5)] border-2 border-white animate-bounce">
                            WORD VALUE: {roundValue} POINTS
                        </div>

                        <div className="relative bg-white/5 backdrop-blur-3xl border-2 border-sky-400/30 shadow-[0_0_100px_rgba(56,189,248,0.25)] rounded-[4rem] p-16 md:p-24 mb-14 w-full overflow-hidden flex justify-center items-center min-h-[300px]">
                            <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 to-transparent pointer-events-none"></div>
                            
                            <div className="relative z-10 text-7xl md:text-[9rem] font-black tracking-[0.2em] text-white flex justify-center flex-wrap items-center">
                                {generatePatternArray().map((item, i) => (
                                    <span 
                                        key={i} 
                                        className={`mx-2 md:mx-6 transition-all duration-500 ${
                                            item.type === 'letter' 
                                            ? `text-transparent bg-clip-text bg-gradient-to-b ${item.color} scale-125 drop-shadow-[0_0_40px_rgba(255,255,255,0.5)]` 
                                            : 'text-sky-950/60 drop-shadow-none scale-100'
                                        }`}
                                    >
                                        {item.char}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        {phase === PHASES.READY ? (
                            <button 
                                onClick={startGuessing}
                                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-slate-950 text-5xl font-black py-8 px-28 rounded-[3rem] shadow-[0_0_80px_rgba(52,211,153,0.6)] transform hover:scale-[1.03] active:scale-95 transition-all border border-white/50"
                            >
                                START TIMER ⏰
                            </button>
                        ) : (
                            <div className="flex flex-col items-center w-full">
                                <div className={`text-[16rem] leading-none font-black my-4 ${timeLeft <= 5 ? 'text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600 animate-pulse drop-shadow-[0_0_100px_rgba(239,68,68,0.9)]' : 'text-transparent bg-clip-text bg-gradient-to-b from-white to-sky-300 drop-shadow-[0_0_80px_rgba(56,189,248,0.6)]'}`}>
                                    {timeLeft.toString().padStart(2, '0')}
                                </div>

                                <div className="flex w-full gap-10 mt-12">
                                    <button 
                                        onClick={() => handleResult('wrong')}
                                        className="flex-1 bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-5xl font-black py-12 rounded-[3.5rem] backdrop-blur-xl border border-red-500/30 hover:border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.15)] hover:shadow-[0_0_80px_rgba(239,68,68,0.5)] active:scale-95 transition-all group"
                                    >
                                        <span className="block group-hover:scale-110 transition-transform">❌ INCORRECT</span>
                                    </button>
                                    <button 
                                        onClick={() => handleResult('correct')}
                                        className="flex-1 bg-white/5 hover:bg-green-500/20 text-green-400 hover:text-green-300 text-5xl font-black py-12 rounded-[3.5rem] backdrop-blur-xl border border-green-500/30 hover:border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.15)] hover:shadow-[0_0_80px_rgba(34,197,94,0.5)] active:scale-95 transition-all group"
                                    >
                                        <span className="block group-hover:scale-110 transition-transform">✅ CORRECT</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {(phase === PHASES.RESULT) && (
                    <div className="flex flex-col items-center justify-center animate-in zoom-in spin-in-6 duration-500 w-full flex-1">
                        {lastResult === 'correct' ? (
                            <>
                                <div className="text-[14rem] md:text-[18rem] mb-10 drop-shadow-[0_0_100px_rgba(74,222,128,0.9)] animate-bounce">🎉</div>
                                <h2 className="text-8xl md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-emerald-500 drop-shadow-[0_0_80px_rgba(74,222,128,0.7)]">CORRECT!</h2>
                            </>
                        ) : (
                            <>
                                <div className="text-[14rem] md:text-[18rem] mb-10 drop-shadow-[0_0_100px_rgba(239,68,68,0.9)] animate-pulse">❌</div>
                                <h2 className="text-8xl md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600 drop-shadow-[0_0_80px_rgba(239,68,68,0.7)] text-center">INCORRECT</h2>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export const LetterLock = () => {
    const [gameState, setGameState] = useState('setup');
    const [settings, setSettings] = useState<any>(null);

    const handleStart = (config: any) => {
        setSettings(config);
        setGameState('playing');
    };

    return (
        <div className="w-full flex-1 flex flex-col relative overflow-hidden bg-[#020617]">
            {gameState === 'setup' && <Setup onStart={handleStart} />}
            {gameState === 'playing' && <Game settings={settings} onRestart={() => setGameState('setup')} />}
        </div>
    );
};
