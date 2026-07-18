import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ViewState } from "../types";
import { FullscreenButton } from "../components/FullscreenButton";
import { ArrowLeft } from "lucide-react";

const QUESTION_DB = [
  { text: "He likes movies, ____?", correct: "doesn’t he?", wrong: ["does he?"] },
  { text: "She is your friend, ____?", correct: "isn’t she?", wrong: ["is she?"] },
  { text: "They can swim well, ____?", correct: "can’t they?", wrong: ["can they?"] },
  { text: "Tom plays football, ____?", correct: "doesn’t he?", wrong: ["does he?"] },
  { text: "You are happy today, ____?", correct: "aren’t you?", wrong: ["are you?"] },
  { text: "It is raining, ____?", correct: "isn’t it?", wrong: ["is it?"] },
  { text: "Mary has a new bike, ____?", correct: "hasn’t she?", wrong: ["has she?"] },
  { text: "We will go tomorrow, ____?", correct: "won’t we?", wrong: ["will we?"] },
  { text: "Jack can drive, ____?", correct: "can’t he?", wrong: ["can he?"] },
  { text: "The cat is sleeping, ____?", correct: "isn’t it?", wrong: ["is it?"] },
  { text: "Anna works here, ____?", correct: "doesn’t she?", wrong: ["does she?"] },
  { text: "They were late, ____?", correct: "weren’t they?", wrong: ["were they?"] },
  { text: "You like apples, ____?", correct: "don’t you?", wrong: ["do you?"] },
  { text: "He was tired, ____?", correct: "wasn’t he?", wrong: ["was he?"] },
  { text: "She can dance, ____?", correct: "can’t she?", wrong: ["can she?"] },
  { text: "The boys are outside, ____?", correct: "aren’t they?", wrong: ["are they?"] },
  { text: "It was cold yesterday, ____?", correct: "wasn’t it?", wrong: ["was it?"] },
  { text: "We should study, ____?", correct: "shouldn’t we?", wrong: ["should we?"] },
  { text: "Peter has finished, ____?", correct: "hasn’t he?", wrong: ["has he?"] },
  { text: "You were at school, ____?", correct: "weren’t you?", wrong: ["were you?"] },
  { text: "She sings beautifully, ____?", correct: "doesn’t she?", wrong: ["does she?"] },
  { text: "They are playing, ____?", correct: "aren’t they?", wrong: ["are they?"] },
  { text: "He will help us, ____?", correct: "won’t he?", wrong: ["will he?"] },
  { text: "Lucy likes pizza, ____?", correct: "doesn’t she?", wrong: ["does she?"] },
  { text: "The dog can jump, ____?", correct: "can’t it?", wrong: ["can it?"] },
  { text: "We are ready, ____?", correct: "aren’t we?", wrong: ["are we?"] },
  { text: "Sam was here, ____?", correct: "wasn’t he?", wrong: ["was he?"] },
  { text: "You have seen this film, ____?", correct: "haven’t you?", wrong: ["have you?"] },
  { text: "It looks nice, ____?", correct: "doesn’t it?", wrong: ["does it?"] },
  { text: "They live nearby, ____?", correct: "don’t they?", wrong: ["do they?"] },
  { text: "He is a teacher, ____?", correct: "isn’t he?", wrong: ["is he?"] },
  { text: "Sarah can speak English, ____?", correct: "can’t she?", wrong: ["can she?"] },
  { text: "We were busy, ____?", correct: "weren’t we?", wrong: ["were we?"] },
  { text: "The baby is sleeping, ____?", correct: "isn’t it?", wrong: ["is it?"] },
  { text: "John likes reading, ____?", correct: "doesn’t he?", wrong: ["does he?"] },
  { text: "You will come, ____?", correct: "won’t you?", wrong: ["will you?"] },
  { text: "They have a car, ____?", correct: "haven’t they?", wrong: ["have they?"] },
  { text: "The girls are singing, ____?", correct: "aren’t they?", wrong: ["are they?"] },
  { text: "He should listen, ____?", correct: "shouldn’t he?", wrong: ["should he?"] },
  { text: "It was fun, ____?", correct: "wasn’t it?", wrong: ["was it?"] },
  { text: "She has a brother, ____?", correct: "hasn’t she?", wrong: ["has she?"] },
  { text: "We can win, ____?", correct: "can’t we?", wrong: ["can we?"] },
  { text: "Ben studies hard, ____?", correct: "doesn’t he?", wrong: ["does he?"] },
  { text: "You are coming, ____?", correct: "aren’t you?", wrong: ["are you?"] },
  { text: "The birds can fly, ____?", correct: "can’t they?", wrong: ["can they?"] },
  { text: "They were excited, ____?", correct: "weren’t they?", wrong: ["were they?"] },
  { text: "Emma likes chocolate, ____?", correct: "doesn’t she?", wrong: ["does she?"] },
  { text: "He is at home, ____?", correct: "isn’t he?", wrong: ["is he?"] },
  { text: "We have finished, ____?", correct: "haven’t we?", wrong: ["have we?"] },
  { text: "The children are happy, ____?", correct: "aren’t they?", wrong: ["are they?"] }
];

const generateQuestion = () => {
  const q = QUESTION_DB[Math.floor(Math.random() * QUESTION_DB.length)];
  const wrongOpt = q.wrong[Math.floor(Math.random() * q.wrong.length)];
  const options = Math.random() > 0.5 ? [q.correct, wrongOpt] : [wrongOpt, q.correct];
  return {
    text: q.text,
    options,
    correctIndex: options.indexOf(q.correct)
  };
};

const SumoCharacter = ({ team, isPushing, isStunned, positionStyle, flip }: any) => {
  const isLeft = team === 'left';
  const clothingColor = isLeft ? "#2563eb" : "#dc2626";

  let rotation = 0;
  let translateX = 0;
  let translateY = 0;

  if (isPushing) {
    rotation = isLeft ? 15 : -15;
    translateX = isLeft ? 35 : -35;
  } else if (isStunned) {
    rotation = isLeft ? -25 : 25; 
    translateX = isLeft ? -25 : 25;
    translateY = 15;
  }

  const transform = `rotate(${rotation}deg) translateX(${translateX}px) translateY(${translateY}px)`;

  return (
    <div 
      className="absolute bottom-4 z-10 w-28 h-36 md:w-56 md:h-64 transition-all duration-200 ease-out origin-bottom"
      style={{ ...positionStyle, transform }}
    >
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl overflow-visible">
        <g transform={flip ? "scale(-1, 1) translate(-100, 0)" : ""}>
          <ellipse cx="50" cy="115" rx="40" ry="6" fill="rgba(0,0,0,0.2)" />
          <rect x="30" y="80" width="18" height="32" rx="9" fill="#e5c8b0" />
          <rect x="52" y="80" width="18" height="32" rx="9" fill="#e5c8b0" />
          <circle cx="50" cy="65" r="42" fill="#ffdfc4" />
          <path d="M 15 45 C 20 10, 80 10, 85 45 Z" fill="#1f2937" />
          <path d="M 50 20 C 45 0, 65 0, 60 20 Z" fill="#1f2937" />
          <rect x="47" y="18" width="14" height="4" fill="#fbbf24" rx="2" />
          {isStunned ? (
            <g>
              <path d="M 35 45 L 45 55 M 45 45 L 35 55" stroke="#1f2937" strokeWidth="3" />
              <path d="M 65 45 L 75 55 M 75 45 L 65 55" stroke="#1f2937" strokeWidth="3" />
              <path d="M 45 65 Q 55 60 65 65" fill="none" stroke="#1f2937" strokeWidth="2" />
            </g>
          ) : (
            <g>
              <circle cx="45" cy="50" r="4" fill="#1f2937" />
              <circle cx="75" cy="50" r="4" fill="#1f2937" />
              <path d="M 50 62 Q 55 68 60 62" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
          <path d="M 8 68 Q 50 90 92 68 L 88 82 Q 50 102 12 82 Z" fill={clothingColor} />
          <path d="M 38 78 L 62 78 L 58 112 L 42 112 Z" fill={clothingColor} />
          <path d={isPushing ? "M 55 60 L 105 50" : "M 55 60 Q 85 75 95 65"} fill="none" stroke="#ffdfc4" strokeWidth="16" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export function Sumo({ onViewChange }: { onViewChange: (view: ViewState) => void }) {
  const [gameState, setGameState] = useState('menu'); 
  const [leftTeam, setLeftTeam] = useState<any>({ score: 0, q: null, stunned: false, pushing: false });
  const [rightTeam, setRightTeam] = useState<any>({ score: 0, q: null, stunned: false, pushing: false });
  const [battlePos, setBattlePos] = useState(50);
  const [winner, setWinner] = useState<string | null>(null);

  const stateRef = useRef({ gameState, leftTeam, rightTeam, battlePos });
  useEffect(() => {
    stateRef.current = { gameState, leftTeam, rightTeam, battlePos };
  }, [gameState, leftTeam, rightTeam, battlePos]);

  const startGame = () => {
    setLeftTeam({ score: 0, q: generateQuestion(), stunned: false, pushing: false });
    setRightTeam({ score: 0, q: generateQuestion(), stunned: false, pushing: false });
    setBattlePos(50);
    setWinner(null);
    setGameState('playing');
  };

  const handleAnswer = useCallback((teamStr: string, selectedIndex: number) => {
    const state = stateRef.current;
    if (state.gameState !== 'playing') return;

    const isLeft = teamStr === 'left';
    const teamState = isLeft ? state.leftTeam : state.rightTeam;
    const setTeamState = isLeft ? setLeftTeam : setRightTeam;

    if (teamState.stunned || teamState.pushing) return;

    if (selectedIndex === teamState.q.correctIndex) {
      setTeamState((prev: any) => ({ ...prev, pushing: true, score: prev.score + 1 }));
      const shiftAmount = 12; 
      
      setBattlePos(prev => {
        const next = isLeft ? prev + shiftAmount : prev - shiftAmount;
        if (next >= 98) { setWinner('Blue Team'); setGameState('end'); }
        if (next <= 2) { setWinner('Red Team'); setGameState('end'); }
        return next;
      });
      
      setTimeout(() => {
        setTeamState((prev: any) => ({ ...prev, pushing: false, q: generateQuestion() }));
      }, 400);
    } else {
      setTeamState((prev: any) => ({ ...prev, stunned: true }));
      setBattlePos(prev => Math.max(2, Math.min(98, isLeft ? prev - 10 : prev + 10)));
      setTimeout(() => setTeamState((prev: any) => ({ ...prev, stunned: false })), 1200);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.gameState !== 'playing') return;
      const key = e.key.toLowerCase();
      // Left Team Controls: A and D
      if (key === 'a') handleAnswer('left', 0);
      if (key === 'd') handleAnswer('left', 1);
      // Right Team Controls: Left Arrow and Right Arrow
      if (key === 'arrowleft') handleAnswer('right', 0);
      if (key === 'arrowright') handleAnswer('right', 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswer]);

  const renderQuestionText = (text: string) => {
    // Specifically split on "____" to safely replace it cleanly with the underline
    const parts = text.split('____');
    if (parts.length === 1) return text;
    return parts.map((part, i, arr) => (
      <React.Fragment key={i}>
        {part}
        {i !== arr.length - 1 && (
          <span className="inline-block border-b-4 border-yellow-400 min-w-[3rem] mx-1 text-yellow-300">
            &nbsp;
          </span>
        )}
      </React.Fragment>
    ));
  };

  if (gameState === 'menu') {
    return (
      <div id="game-container" className="h-[calc(100vh-2rem)] bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center font-sans p-4 overflow-hidden relative" style={{ margin: '-1rem', height: 'calc(100% + 2rem)' }}>
        <div className="absolute top-4 left-4 z-[60] flex items-center gap-2">
          <button 
            onClick={() => onViewChange("home")}
            className="flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 dark:bg-black/20 hover:bg-slate-300/50 dark:hover:bg-black/50 border-slate-300/50 dark:border-white/20"
          >
            <ArrowLeft size={24} />
          </button>
          <FullscreenButton targetId="game-container" />
        </div>
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] text-center shadow-2xl border-b-8 border-yellow-500 max-w-lg w-full">
          <div className="mb-6 flex justify-center gap-6 animate-pulse">
             <div className="w-12 h-12 bg-blue-600 rounded-full border-4 border-blue-900 shadow-lg"></div>
             <div className="w-12 h-12 bg-red-600 rounded-full border-4 border-red-900 shadow-lg"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-indigo-900 italic uppercase tracking-tighter leading-tight">QUESTION TAGS SHOWDOWN</h1>
          <p className="text-slate-500 mb-8 font-bold text-lg uppercase tracking-widest">Master the Tags</p>
          <button onClick={startGame} className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-2xl font-black px-12 py-6 rounded-full shadow-[0_8px_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all w-full md:w-auto">
            START BATTLE
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'end') {
    return (
      <div id="game-container" className="h-[calc(100vh-2rem)] bg-slate-100 dark:bg-black/95 flex items-center justify-center font-sans p-4 overflow-hidden relative" style={{ margin: '-1rem', height: 'calc(100% + 2rem)' }}>
        <div className="absolute top-4 left-4 z-[60] flex items-center gap-2">
          <button 
            onClick={() => onViewChange("home")}
            className="flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 dark:bg-black/20 hover:bg-slate-300/50 dark:hover:bg-black/50 border-slate-300/50 dark:border-white/20"
          >
            <ArrowLeft size={24} />
          </button>
          <FullscreenButton targetId="game-container" />
        </div>
        <div className="bg-white p-10 md:p-16 rounded-[2.5rem] text-center shadow-2xl border-8 border-yellow-400">
          <h2 className={`text-5xl md:text-7xl font-black mb-4 uppercase italic ${winner === 'Blue Team' ? 'text-blue-600' : 'text-red-600'}`}>
            {winner}
          </h2>
          <p className="text-2xl font-black text-slate-800 mb-10 uppercase tracking-widest">Wins the Match!</p>
          <button onClick={startGame} className="bg-emerald-600 text-white text-2xl md:text-3xl font-black px-12 py-5 rounded-full hover:bg-emerald-500 shadow-[0_6px_0_#065f46] active:translate-y-1 active:shadow-none transition-all">
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="game-container" className="h-[calc(100vh-2rem)] w-full bg-indigo-50 dark:bg-indigo-950 p-2 md:p-4 flex flex-col md:flex-row gap-2 md:gap-4 select-none overflow-hidden font-sans relative" style={{ margin: '-1rem', height: 'calc(100% + 2rem)' }}>
      <div className="absolute top-4 left-4 z-[60] flex items-center gap-2">
        <button 
          onClick={() => onViewChange("home")}
          className="flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 dark:bg-black/20 hover:bg-slate-300/50 dark:hover:bg-black/50 border-slate-300/50 dark:border-white/20"
        >
          <ArrowLeft size={24} />
        </button>
        <FullscreenButton targetId="game-container" />
      </div>

      {/* Blue Team Side */}
      <div className="w-full md:w-1/4 bg-blue-700 rounded-3xl md:rounded-[2.5rem] flex flex-row md:flex-col p-3 md:p-6 pt-16 md:pt-16 shadow-2xl border-b-4 md:border-b-0 md:border-r-8 border-blue-900/50">
        <div className="flex flex-col md:flex-row justify-between items-center mb-0 md:mb-6 pr-4 md:pr-0">
          <h2 className="text-xs md:text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-widest whitespace-nowrap">BLUE TEAM</h2>
          <div className="bg-slate-200 dark:bg-black/30 px-3 md:px-4 py-1 md:py-2 rounded-xl text-xl md:text-3xl font-black text-slate-800 dark:text-white">{leftTeam.score}</div>
        </div>
        
        <div className="hidden md:flex bg-blue-800/80 flex-1 rounded-3xl p-4 md:p-8 items-center justify-center shadow-inner mb-6 relative overflow-hidden border border-blue-400/20">
          <p className="text-slate-800 dark:text-white text-lg md:text-2xl font-bold text-center leading-relaxed">
            {renderQuestionText(leftTeam.q?.text || "")}
          </p>
          {leftTeam.stunned && (
            <div className="absolute inset-0 bg-red-600/60 backdrop-blur-sm flex items-center justify-center animate-pulse">
              <span className="text-slate-800 dark:text-white font-black italic text-3xl drop-shadow-lg">MISS!</span>
            </div>
          )}
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-4 flex-1 md:flex-none ${leftTeam.stunned ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          {leftTeam.q?.options.map((opt: string, idx: number) => (
            <button key={idx} onClick={() => handleAnswer('left', idx)}
              className="bg-white hover:bg-blue-50 text-blue-900 rounded-xl md:rounded-3xl py-3 md:py-6 text-sm md:text-2xl font-black shadow-[0_4px_0_#1e3a8a] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center md:justify-between px-2 md:px-8">
              <span className="hidden md:inline text-blue-400">{idx === 0 ? 'A:' : 'D:'}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Arena */}
      <div className="flex-1 bg-[#fefae0] rounded-3xl md:rounded-[3rem] relative overflow-hidden border-4 md:border-8 border-amber-900/20 shadow-inner min-h-[150px] mt-16 md:mt-0">
        {/* Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[110%] aspect-square flex items-center justify-center">
          <div className="w-full h-full bg-[#bc6c25] rounded-full border-[10px] md:border-[30px] border-[#8b5e34] shadow-2xl transform scale-y-[0.6] relative">
             <div className="h-full w-1 bg-white/20 absolute left-1/2 -translate-x-1/2"></div>
          </div>
        </div>

        <div className="absolute top-1/2 w-full h-0 transition-all duration-300 ease-out"
             style={{ left: `${battlePos}%` }}>
          <SumoCharacter team="left" 
            isPushing={leftTeam.pushing} isStunned={leftTeam.stunned} flip={false}
            positionStyle={{ left: '-110px', bottom: '-1rem' }} />
          <SumoCharacter team="right" 
            isPushing={rightTeam.pushing} isStunned={rightTeam.stunned} flip={true}
            positionStyle={{ left: '0px', bottom: '-1rem' }} />
        </div>

        {/* Mobile View Question Text */}
        <div className="md:hidden absolute top-4 left-0 w-full px-4 flex justify-between gap-3 z-10">
            <div className={`bg-blue-900/90 p-2 rounded-xl text-slate-100 dark:text-white text-[10px] font-bold w-1/2 text-center shadow-lg ${leftTeam.stunned ? 'bg-red-900' : ''}`}>
                {leftTeam.stunned ? "MISS!" : leftTeam.q?.text}
            </div>
            <div className={`bg-red-900/90 p-2 rounded-xl text-slate-100 dark:text-white text-[10px] font-bold w-1/2 text-center shadow-lg ${rightTeam.stunned ? 'bg-red-900' : ''}`}>
                {rightTeam.stunned ? "MISS!" : rightTeam.q?.text}
            </div>
        </div>
      </div>

      {/* Red Team Side (Options UNDER Question) */}
      <div className="w-full md:w-1/4 bg-red-700 rounded-3xl md:rounded-[2.5rem] flex flex-row md:flex-col p-3 md:p-6 shadow-2xl border-t-4 md:border-t-0 md:border-l-8 border-red-900/50">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-0 md:mb-6 pl-4 md:pl-0 w-full">
          <div className="bg-slate-200 dark:bg-black/30 px-3 md:px-4 py-1 md:py-2 rounded-xl text-xl md:text-3xl font-black text-slate-800 dark:text-white order-2 md:order-1">{rightTeam.score}</div>
          <h2 className="text-xs md:text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-widest order-1 md:order-2 whitespace-nowrap">RED TEAM</h2>
        </div>

        {/* Question Area */}
        <div className="hidden md:flex bg-red-800/80 flex-1 rounded-3xl p-4 md:p-8 items-center justify-center shadow-inner mb-6 relative overflow-hidden border border-red-400/20">
          <p className="text-slate-800 dark:text-white text-lg md:text-2xl font-bold text-center leading-relaxed">
            {renderQuestionText(rightTeam.q?.text || "")}
          </p>
          {rightTeam.stunned && (
            <div className="absolute inset-0 bg-red-600/60 backdrop-blur-sm flex items-center justify-center animate-pulse">
              <span className="text-slate-800 dark:text-white font-black italic text-3xl drop-shadow-lg">MISS!</span>
            </div>
          )}
        </div>

        {/* Options Grid (Now at the bottom) */}
        <div className={`grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-4 flex-1 md:flex-none ${rightTeam.stunned ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          {rightTeam.q?.options.map((opt: string, idx: number) => (
            <button key={idx} onClick={() => handleAnswer('right', idx)}
              className="bg-white hover:bg-red-50 text-red-900 rounded-xl md:rounded-3xl py-3 md:py-6 text-sm md:text-2xl font-black shadow-[0_4px_0_#991b1b] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center md:justify-between px-2 md:px-8">
              <span className="hidden md:inline text-red-400 uppercase">{idx === 0 ? '←:' : '→:'}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
