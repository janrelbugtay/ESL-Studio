import React, { useState, useEffect, useRef } from 'react';
import { User, Play, ChevronRight, RefreshCw, ArrowLeft, Save, Edit3, Trash2, Sun, Moon, Maximize, Minimize } from 'lucide-react';
import { ViewState } from "../types";

const GAME_DATA = [
  {
    question: "Name a color in a rainbow.",
    answers: [
      { text: "Red", points: 40, aliases: ["red"] },
      { text: "Blue", points: 25, aliases: ["blue"] },
      { text: "Yellow", points: 15, aliases: ["yellow"] },
      { text: "Green", points: 10, aliases: ["green"] },
      { text: "Orange", points: 10, aliases: ["orange"] }
    ]
  },
  {
    question: "Name an animal you can keep as a pet.",
    answers: [
      { text: "Dog", points: 50, aliases: ["dog", "puppy"] },
      { text: "Cat", points: 30, aliases: ["cat", "kitten"] },
      { text: "Fish", points: 10, aliases: ["fish", "goldfish"] },
      { text: "Bird", points: 5, aliases: ["bird", "parrot"] },
      { text: "Rabbit", points: 5, aliases: ["rabbit", "bunny"] }
    ]
  },
  {
    question: "Name a fruit that is yellow.",
    answers: [
      { text: "Banana", points: 60, aliases: ["banana"] },
      { text: "Lemon", points: 25, aliases: ["lemon"] },
      { text: "Mango", points: 10, aliases: ["mango"] },
      { text: "Pineapple", points: 5, aliases: ["pineapple"] }
    ]
  },
  {
    question: "Name something you wear on your feet.",
    answers: [
      { text: "Shoes", points: 45, aliases: ["shoe", "shoes", "sneaker", "sneakers"] },
      { text: "Socks", points: 35, aliases: ["sock", "socks"] },
      { text: "Boots", points: 10, aliases: ["boot", "boots"] },
      { text: "Sandals", points: 10, aliases: ["sandal", "sandals", "flip flops"] }
    ]
  },
  {
    question: "Name something people drink in the morning.",
    answers: [
      { text: "Coffee", points: 50, aliases: ["coffee"] },
      { text: "Water", points: 20, aliases: ["water"] },
      { text: "Milk", points: 15, aliases: ["milk"] },
      { text: "Tea", points: 10, aliases: ["tea"] },
      { text: "Juice", points: 5, aliases: ["juice", "orange juice"] }
    ]
  }
];

const normalizeString = (str: string) => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

const checkAnswer = (input: string, answers: any[]) => {
  const normalizedInput = normalizeString(input);
  for (let i = 0; i < answers.length; i++) {
    const ans = answers[i];
    const matchTerms = [ans.text, ...(ans.aliases || [])].map(normalizeString);
    if (matchTerms.includes(normalizedInput)) {
      return i; 
    }
  }
  return -1; 
};

const playSound = (type: string) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'correct') {
      // Bright, chiming bell sound
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc2.frequency.setValueAtTime(1108.73, ctx.currentTime); // C#6

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);

      osc1.start(); osc2.start();
      osc1.stop(ctx.currentTime + 1.0);
      osc2.stop(ctx.currentTime + 1.0);

    } else if (type === 'wrong') {
      // Harsh, loud TV buzzer
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      osc1.frequency.setValueAtTime(120, ctx.currentTime);
      osc2.frequency.setValueAtTime(125, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(0.5, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc1.start(); osc2.start();
      osc1.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    console.error("Audio error:", e);
  }
};

const StrikeOverlay = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-[20rem] h-[20rem] bg-red-600/50 blur-[80px] rounded-full"></div>
        <div className="text-red-600 font-black text-[15rem] md:text-[20rem] leading-none drop-shadow-[0_0_40px_rgba(220,38,38,1)] animate-shake z-10" style={{ WebkitTextStroke: '6px #450a0a' }}>
          X
        </div>
      </div>
    </div>
  );
};

const AnswerBoard = ({ answers, revealedIndices, isDark }: { answers: any[], revealedIndices: number[], isDark: boolean }) => {
  const slots = Array.from({ length: 8 }).map((_, i) => answers[i] || null);

  return (
    <div className={`relative border-[12px] border-[#d4af37] rounded-[2rem] p-4 md:p-8 bg-gradient-to-b ${isDark ? 'from-[#0a1526] to-[#04080f]' : 'from-blue-100 to-white'} shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_80px_rgba(212,175,55,0.3),inset_0_0_40px_rgba(0,0,0,0.9)] w-full max-w-5xl`}>
      <div className="absolute inset-0 border-[4px] border-[#ffd700]/30 rounded-[1.4rem] pointer-events-none"></div>

      {/* Decorative side lights */}
      <div className="absolute -left-14 top-1/2 -translate-y-1/2 flex-col gap-6 hidden lg:flex">
        {[1,2,3,4].map(i => <div key={i} className="w-4 h-16 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full shadow-[0_0_15px_rgba(253,224,71,0.8),inset_0_2px_4px_rgba(255,255,255,0.5)]"></div>)}
      </div>
      <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex-col gap-6 hidden lg:flex">
        {[1,2,3,4].map(i => <div key={i} className="w-4 h-16 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full shadow-[0_0_15px_rgba(253,224,71,0.8),inset_0_2px_4px_rgba(255,255,255,0.5)]"></div>)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
        {slots.map((answer, index) => {
          const isRevealed = revealedIndices.includes(index);
          const hasAnswer = answer !== null;

          return (
            <div 
              key={index} 
              className={`h-20 md:h-[6.5rem] relative overflow-hidden rounded-xl border-[3px] ${isDark ? 'border-[#1e293b] bg-[#020617]' : 'border-blue-200 bg-blue-50'} shadow-[0_10px_20px_rgba(0,0,0,0.6)]`}
            >
              {/* Revealed State Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 flex justify-between items-center px-4 md:px-6"
                   style={{ backgroundImage: isDark ? 'linear-gradient(90deg, #1e293b 0%, #334155 50%, #1e293b 100%)' : 'linear-gradient(90deg, #e2e8f0 0%, #f8fafc 50%, #e2e8f0 100%)' }}>
                <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-black text-2xl md:text-4xl uppercase tracking-widest truncate pr-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]`} style={{ fontFamily: 'Impact, sans-serif' }}>
                  {answer?.text}
                </span>
                <div className={`h-full flex items-center border-l-4 border-[#0f172a] pl-4 md:pl-6 ${isDark ? 'bg-[#0f172a]/80' : 'bg-slate-200/80'} shadow-[inset_10px_0_15px_rgba(0,0,0,0.4)]`}>
                  <span className="text-yellow-400 font-black text-3xl md:text-5xl drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]" style={{ fontFamily: 'Impact, sans-serif' }}>
                    {answer?.points}
                  </span>
                </div>
              </div>

              {/* Covered State Flap */}
              <div 
                className={`absolute inset-0 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 border-[3px] border-blue-400 flex items-center justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top ${isRevealed ? 'rotate-x-90 opacity-0' : 'rotate-x-0 opacity-100 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]'}`}
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              >
                {/* Subtle digital pattern on the flap */}
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                
                <div className="absolute top-0 left-0 w-full h-[45%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                
                {hasAnswer ? (
                  <div className="w-16 h-12 md:w-24 md:h-16 rounded-full bg-[#0a1930] border-[4px] border-blue-300 flex items-center justify-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_4px_15px_rgba(0,0,0,0.6)] relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                    <span className="text-white font-black text-3xl md:text-4xl drop-shadow-[0_3px_3px_rgba(0,0,0,1)] relative z-10" style={{ fontFamily: 'Impact, sans-serif' }}>
                      {index + 1}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300 to-transparent"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function FamilyFeud({ onViewChange, initialGame }: { onViewChange: (view: ViewState) => void, initialGame?: any }) {
  const [gameState, setGameState] = useState('start');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const isDark = theme === 'dark';
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<number, number>>({ 1: 0, 2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [showStrike, setShowStrike] = useState(false);
  const [feedback, setFeedback] = useState('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const gameData = initialGame?.customQuestions || GAME_DATA;
  const currentQ = gameData[currentQuestionIndex];

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, currentPlayer]);

  const startGame = () => {
    setScores({ 1: 0, 2: 0 });
    setCurrentQuestionIndex(0);
    setRevealedAnswers([]);
    setCurrentPlayer(1);
    setGameState('playing');
  };

  const nextRound = () => {
    if (currentQuestionIndex + 1 < gameData.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setRevealedAnswers([]);
      setGameState('playing');
    } else {
      setGameState('game_over');
    }
  };

  const revealAll = () => {
    if (!currentQ) return;
    const allIndices = currentQ.answers.map((_: any, i: number) => i);
    setRevealedAnswers(allIndices);
    setGameState('round_over');
  };

  const revealAnswer = (index: number) => {
    if (!currentQ || gameState === 'start' || gameState === 'game_over') return;
    if (!revealedAnswers.includes(index) && currentQ.answers[index]) {
      const newRevealed = [...revealedAnswers, index];
      setRevealedAnswers(newRevealed);
      if (newRevealed.length === currentQ.answers.length && gameState !== 'round_over') {
        setTimeout(() => setGameState('round_over'), 1000);
      }
    }
  };

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || gameState !== 'playing') return;

    const answerIndex = checkAnswer(inputValue, currentQ.answers);

    if (answerIndex !== -1 && !revealedAnswers.includes(answerIndex)) {
      playSound('correct');
      setFeedback('correct');
      setTimeout(() => setFeedback('idle'), 1000);

      const points = currentQ.answers[answerIndex].points;
      setScores(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + points
      }));
      
      const newRevealed = [...revealedAnswers, answerIndex];
      setRevealedAnswers(newRevealed);

      if (newRevealed.length === currentQ.answers.length) {
        setTimeout(() => setGameState('round_over'), 1000);
      } else {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    } else {
      playSound('wrong');
      setFeedback('wrong');
      setShowStrike(true);
      setTimeout(() => {
        setShowStrike(false);
        setFeedback('idle');
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }, 1500); 
    }

    setInputValue('');
  };

  const renderStartScreen = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-12 animate-in fade-in zoom-in mt-16">
      <div className="relative">
        <div className={`text-7xl md:text-[10rem] font-black ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-amber-600' : 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-500 via-amber-600 to-amber-800'} drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] text-center leading-[0.85] tracking-tighter`} style={{ fontFamily: 'Impact, sans-serif' }}>
          FAMILY
          <br/>
          FEUD
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-yellow-500/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
        {/* Subtle decorative stars */}
        <div className="absolute -top-10 -left-10 text-yellow-300/50 text-4xl animate-pulse">✨</div>
        <div className="absolute -bottom-10 -right-10 text-yellow-300/40 text-5xl animate-pulse delay-300">✨</div>
      </div>
      <button 
        onClick={startGame}
        className="group relative px-12 py-6 bg-gradient-to-b from-blue-500 to-blue-800 text-white rounded-full font-black text-3xl hover:from-blue-400 hover:to-blue-700 transition-all border-[6px] border-blue-300 shadow-[0_0_40px_rgba(59,130,246,0.8),inset_0_4px_10px_rgba(255,255,255,0.4)] flex items-center gap-4 transform hover:scale-105 active:scale-95"
      >
        <Play fill="currentColor" size={32} className="drop-shadow-md" /> ENTER STUDIO
      </button>
    </div>
  );

  const renderGameOver = () => {
    const winner = scores[1] > scores[2] ? 'Team 1' : scores[1] < scores[2] ? 'Team 2' : 'Tie';
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in mt-24">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
          GAME OVER
        </h1>
        <div className="text-4xl text-yellow-400 font-black drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
          {winner === 'Tie' ? "IT'S A TIE!" : `${winner} WINS!`}
        </div>
        <div className="flex gap-12 text-4xl font-black bg-black/50 p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <div className="flex flex-col items-center gap-2">
            <span className="text-blue-500 text-xl tracking-widest uppercase">Team 1</span>
            <span className="text-white">{scores[1]}</span>
          </div>
          <div className="w-px bg-slate-600"></div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-green-500 text-xl tracking-widest uppercase">Team 2</span>
            <span className="text-white">{scores[2]}</span>
          </div>
        </div>
        <button 
          onClick={startGame}
          className="mt-8 px-8 py-4 bg-gradient-to-b from-blue-600 to-blue-800 text-white rounded-full font-bold text-xl hover:from-blue-500 hover:to-blue-700 transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center gap-3 border-2 border-blue-400"
        >
          <RefreshCw size={24} /> PLAY AGAIN
        </button>
      </div>
    );
  };

  const renderHeaderInfo = () => {
    if (gameState === 'start' || gameState === 'game_over') return null;
    return (
       <div className="w-full max-w-5xl mx-auto mt-6 px-4">
        <div className={`bg-gradient-to-r ${isDark ? 'from-blue-950 via-blue-900 to-blue-950' : 'from-blue-100 via-blue-50 to-blue-100'} border-y-4 border-b-8 border-blue-500/80 rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.9),inset_0_4px_10px_rgba(255,255,255,0.1)] text-center relative overflow-hidden`}>
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
          {/* Subtle glowing dots */}
          <div className="absolute top-2 left-4 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse"></div>
          <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse delay-150"></div>
          <h2 className={`text-2xl md:text-5xl font-black ${isDark ? 'text-white' : 'text-slate-900'} drop-shadow-[0_4px_6px_rgba(0,0,0,1)] leading-tight tracking-wide`} style={{ fontFamily: 'Impact, sans-serif' }}>
            {currentQ.question}
          </h2>
        </div>
      </div>
    );
  };

  const bgColors: Record<string, Record<string, string>> = {
    dark: {
      idle: 'from-slate-900 via-[#061022] to-black',
      correct: 'from-green-950 via-[#0a2012] to-black',
      wrong: 'from-red-950 via-[#250909] to-black'
    },
    light: {
      idle: 'from-slate-100 via-blue-50 to-white',
      correct: 'from-green-100 via-emerald-50 to-white',
      wrong: 'from-red-100 via-rose-50 to-white'
    }
  };

  return (
    <div ref={gameContainerRef} className={`h-[calc(100vh-2rem)] w-full -m-4 md:-m-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${bgColors[theme][feedback]} font-sans ${isDark ? 'text-white' : 'text-slate-900'} flex flex-col relative selection:bg-blue-500/30 transition-colors duration-500 overflow-hidden`} style={{ margin: '-1rem', height: 'calc(100% + 2rem)' }}>
      <div className="absolute top-4 left-4 z-[60] flex items-center gap-3">
        <button 
          onClick={() => onViewChange("home")}
          className={`flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border ${isDark ? 'text-white/80 hover:text-white bg-black/20 hover:bg-black/50 border-white/20' : 'text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white border-slate-300'}`}
          title="Back to Home"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border ${isDark ? 'text-white/80 hover:text-white bg-black/20 hover:bg-black/50 border-white/20' : 'text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white border-slate-300'}`}
          title="Toggle Theme"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <button 
          onClick={async () => {
            if (!document.fullscreenElement) {
              if (gameContainerRef.current) await gameContainerRef.current.requestFullscreen();
            } else {
              await document.exitFullscreen();
            }
          }}
          className={`flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border ${isDark ? 'text-white/80 hover:text-white bg-black/20 hover:bg-black/50 border-white/20' : 'text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white border-slate-300'}`}
          title="Toggle Fullscreen"
        >
          <Maximize size={24} />
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0); }
          15% { transform: translateX(-20px) rotate(-3deg); }
          30% { transform: translateX(20px) rotate(3deg); }
          45% { transform: translateX(-20px) rotate(-3deg); }
          60% { transform: translateX(20px) rotate(3deg); }
          75% { transform: translateX(-10px) rotate(-1deg); }
          90% { transform: translateX(10px) rotate(1deg); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

      {/* Grid Scanline Overlay for TV effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '100% 4px' }}>
      </div>

      {/* Studio Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-yellow-500/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>


      {/* Host Controls Sidebar */}
      {gameState !== 'start' && (
        <div className={`absolute top-0 right-0 h-full ${isDark ? 'bg-slate-950/90' : 'bg-white/95'} backdrop-blur-md border-l ${isDark ? 'border-slate-800' : 'border-slate-200'} p-4 shadow-2xl ${isDark ? 'text-white' : 'text-slate-900'} flex flex-col gap-4 z-50 w-44 overflow-y-auto`}>
          <div className={`font-black text-center border-b border-slate-700 pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'} tracking-widest text-xs`}>HOST PANEL</div>

          <div className="text-center font-bold text-slate-500 text-[10px] tracking-widest -mb-2 mt-2">REVEAL TILE</div>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
              const hasAnswer = !!currentQ?.answers[index];
              const isRevealed = revealedAnswers.includes(index);
              return (
                <button
                  key={index}
                  onClick={() => revealAnswer(index)}
                  disabled={!hasAnswer || isRevealed || gameState === 'start' || gameState === 'game_over'}
                  className={`py-3 bg-slate-800 hover:bg-blue-600 disabled:bg-slate-900 disabled:text-slate-700 rounded ${isDark ? 'text-white' : 'text-slate-900'} font-bold transition-colors shadow-inner text-sm border border-slate-700 disabled:border-slate-800`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="h-px bg-slate-800 my-4"></div>

          <div className="mt-auto flex flex-col gap-3">
            <button 
              onClick={revealAll} 
              disabled={gameState !== 'playing'}
              className={`w-full py-3 ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-900' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'} disabled:opacity-50 disabled:cursor-not-allowed rounded font-bold text-slate-300 transition-colors text-xs border border-slate-700`}
            >
              REVEAL ALL
            </button>
            
            <button 
              onClick={nextRound} 
              disabled={gameState === 'game_over'}
              className="w-full py-4 bg-gradient-to-b from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded font-black transition-all shadow-lg flex flex-col items-center justify-center gap-1 text-sm border-2 border-yellow-300"
            >
              NEXT TOPIC <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      <StrikeOverlay show={showStrike} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col items-center z-10 w-full pb-32 transition-transform duration-300 ${gameState !== 'start' ? 'pr-44' : ''} ${feedback === 'wrong' ? 'animate-shake' : ''}`}>
        
        {renderHeaderInfo()}

        {gameState === 'start' && renderStartScreen()}
        {gameState === 'game_over' && renderGameOver()}

        {(gameState === 'playing' || gameState === 'round_over') && (
          <div className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 px-4 mt-8 md:mt-12 overflow-y-auto">
            
            {/* Team 1 Area */}
            <div className={`flex flex-col items-center gap-3 transition-all duration-700 ${currentPlayer === 1 ? 'scale-110 drop-shadow-[0_0_40px_rgba(59,130,246,0.8)]' : 'opacity-40 grayscale-[60%] scale-95'}`}>
              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl border-[6px] ${currentPlayer === 1 ? 'border-blue-400 bg-gradient-to-br from-blue-500 to-blue-900 shadow-[0_0_30px_rgba(59,130,246,0.5),inset_0_4px_20px_rgba(255,255,255,0.4)]' : 'border-slate-700 bg-slate-800'} flex items-center justify-center relative overflow-hidden`}>
                {currentPlayer === 1 && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                <User size={80} className={currentPlayer === 1 ? (isDark ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : 'text-blue-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]') : 'text-slate-600'} />
              </div>
              <div className={`text-7xl md:text-8xl font-black tracking-tighter drop-shadow-[0_5px_8px_rgba(0,0,0,1)] ${currentPlayer === 1 ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`} style={{ fontFamily: 'Impact, sans-serif' }}>
                {scores[1]}
              </div>
              <div className={`text-xl md:text-3xl font-black uppercase tracking-widest bg-black/50 px-6 py-2 rounded-full border-2 ${currentPlayer === 1 ? 'text-blue-400 border-blue-500/50' : 'text-slate-600 border-slate-800'}`}>Team 1</div>
            </div>

            {/* Center Board */}
            <div className="w-full md:w-auto flex-1 flex justify-center order-first md:order-none mb-8 md:mb-0 relative z-20">
               <AnswerBoard answers={currentQ.answers} revealedIndices={revealedAnswers} isDark={isDark} />
            </div>

            {/* Team 2 Area */}
            <div className={`flex flex-col items-center gap-3 transition-all duration-700 ${currentPlayer === 2 ? 'scale-110 drop-shadow-[0_0_40px_rgba(34,197,94,0.8)]' : 'opacity-40 grayscale-[60%] scale-95'}`}>
               <div className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl border-[6px] ${currentPlayer === 2 ? 'border-green-400 bg-gradient-to-br from-green-500 to-green-900 shadow-[0_0_30px_rgba(34,197,94,0.5),inset_0_4px_20px_rgba(255,255,255,0.4)]' : 'border-slate-700 bg-slate-800'} flex items-center justify-center relative overflow-hidden`}>
                 {currentPlayer === 2 && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                 <User size={80} className={currentPlayer === 2 ? (isDark ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : 'text-blue-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]') : 'text-slate-600'} />
              </div>
              <div className={`text-7xl md:text-8xl font-black tracking-tighter drop-shadow-[0_5px_8px_rgba(0,0,0,1)] ${currentPlayer === 2 ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`} style={{ fontFamily: 'Impact, sans-serif' }}>
                {scores[2]}
              </div>
              <div className={`text-xl md:text-3xl font-black uppercase tracking-widest bg-black/50 px-6 py-2 rounded-full border-2 ${currentPlayer === 2 ? 'text-green-400 border-green-500/50' : 'text-slate-600 border-slate-800'}`}>Team 2</div>
            </div>

          </div>
        )}
      </div>

      {/* Bottom Input Area */}
      {gameState === 'playing' && (
        <div className={`absolute bottom-0 left-0 w-[calc(100%-11rem)] ${isDark ? 'bg-[#030712] border-[#1e293b]' : 'bg-white border-blue-200'} border-t-8 p-6 shadow-[0_-30px_60px_rgba(0,0,0,0.9)] z-20`}>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
          <div className="max-w-5xl mx-auto relative">
            <div className="text-center mb-6 text-xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4">
               <div className={`h-px w-16 ${currentPlayer === 1 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
               <span className={currentPlayer === 1 ? 'text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]' : 'text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]'}>
                 TEAM {currentPlayer}'S TURN TO GUESS
               </span>
               <div className={`h-px w-16 ${currentPlayer === 1 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
            </div>
            <form onSubmit={handleGuessSubmit} className="flex gap-4">
               <button 
                 type="button" 
                 onClick={() => setInputValue('')}
                 className={`px-8 py-5 ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-900' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'} rounded-2xl text-slate-400 font-bold transition-all border-b-4 border-slate-900 active:border-b-0 active:translate-y-1`}
               >
                 CLEAR
               </button>
               <input
                 ref={inputRef}
                 type="text"
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 placeholder="TYPE YOUR ANSWER..."
                 className={`flex-1 ${isDark ? 'bg-[#0f172a] text-white border-[#334155]' : 'bg-slate-50 text-slate-900 border-slate-200'} placeholder-slate-600 px-8 py-5 rounded-2xl font-black text-3xl uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-yellow-500/50 border-[3px] border-[#334155] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] transition-all`}
                 autoComplete="off"
               />
               <button 
                 type="submit"
                 disabled={!inputValue.trim()}
                 className="px-12 py-5 bg-gradient-to-b from-yellow-400 to-amber-600 hover:from-yellow-300 hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-black rounded-2xl font-black transition-all shadow-[0_0_30px_rgba(245,158,11,0.5)] disabled:shadow-none flex items-center text-3xl border-b-[6px] border-amber-700 disabled:border-slate-900 active:border-b-0 active:translate-y-1"
                 style={{ fontFamily: 'Impact, sans-serif' }}
               >
                 SUBMIT
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Round Over Action */}
      {gameState === 'round_over' && (
         <div className="absolute bottom-0 left-0 w-[calc(100%-11rem)] bg-gradient-to-t from-slate-900 to-blue-950 border-t-4 border-blue-800 p-8 shadow-[0_-20px_40px_rgba(0,0,0,0.8)] z-20 flex justify-center">
            <button 
              onClick={nextRound}
              className="px-12 py-5 bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black rounded-full font-black text-3xl transition-all shadow-[0_0_30px_rgba(234,179,8,0.6)] flex items-center gap-4 animate-bounce border-4 border-yellow-200"
            >
              NEXT QUESTION <ChevronRight strokeWidth={4} size={32} />
            </button>
         </div>
      )}

    </div>
  );
}
