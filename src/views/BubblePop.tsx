import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from "../types";
import { FullscreenButton } from "../components/FullscreenButton";
import { ArrowLeft, Edit3, Trash2, Heart, Plus, Sparkles, BookOpen, Search, Save, X, Play, Folder } from "lucide-react";
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

type GameScreen = 'intro' | 'lobby' | 'editor' | 'setup' | 'loading' | 'game' | 'results';

interface PlayerData {
  level: number;
  xp: number;
  xpNext: number;
  coins: number;
}

interface StatsData {
  gamesPlayed: number;
  bubblesPopped: number;
}

interface Question {
  id: number | string;
  text: string;
  options: string[];
  answerIndex: number;
}

interface Quiz {
  id: number | string;
  title?: string;
  subject?: string;
  folderId?: string;
  topic?: string;
  classLevel?: string;
  questions: Question[];
  thumbnail?: string;
  isFavorite?: boolean;
}

export function BubblePop({ onViewChange, initialGame }: { onViewChange: (view: ViewState) => void, initialGame?: any }) {
  const { user } = useAuth();
  const [screen, setScreen] = useState<GameScreen>(initialGame ? 'setup' : 'editor');
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (user) {
      const fetchFolders = async () => {
        const qFolders = query(collection(db, "gameFolders"), where("userId", "==", user.uid));
        const foldersSnap = await getDocs(qFolders);
        const f: any[] = [];
        foldersSnap.forEach(doc => f.push({ id: doc.id, ...doc.data() }));
        setFolders(f);
      };
      fetchFolders();
    }
  }, [user]);
  const [playerData, setPlayerData] = useState<PlayerData>({
    level: 12, xp: 2430, xpNext: 3000, coins: 150
  });

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(() => {
    if (initialGame) {
      return {
        id: initialGame.id,
        title: initialGame.name || "",
        folderId: initialGame.folderId || "",
        topic: initialGame.topic || "",
        classLevel: initialGame.className || "",
        questions: initialGame.customQuestions || [],
      };
    }
    return {
      id: Date.now(),
      title: "",
      folderId: "",
      topic: "",
      classLevel: "",
      questions: [{ id: Date.now(), text: "", options: ["", "", "", ""], answerIndex: 0 }]
    };
  });

  const saveQuiz = async (quiz: Quiz) => {
    if (!user) {
      alert("You must be logged in to save games.");
      return;
    }

    try {
      const gameToSave = {
        name: quiz.title || "",
        folderId: quiz.folderId || "",
        topic: quiz.topic || "",
        className: quiz.classLevel || "",
        gameType: "bubble-pop",
        customQuestions: quiz.questions,
        userId: user.uid,
        updatedAt: new Date().toISOString(),
      };

      if (initialGame?.id) {
        await updateDoc(doc(db, "mysteryBoxGames", initialGame.id), gameToSave);
      } else {
        await addDoc(collection(db, "mysteryBoxGames"), {
          ...gameToSave,
          createdAt: new Date().toISOString(),
        });
      }
      onViewChange("games");
    } catch (error) {
      console.error("Error saving game:", error);
      alert("Error saving game.");
    }
  };

  const [statsData, setStatsData] = useState<StatsData>({
    gamesPlayed: 0, bubblesPopped: 0
  });
  
  const [numPlayers, setNumPlayers] = useState(1);
  const [scores, setScores] = useState([0, 0]);
  const [questionText, setQuestionText] = useState("Loading...");
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [resultsTitle, setResultsTitle] = useState("Good Try!");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Game engine state refs
  const gameState = useRef({
    isActive: false,
    numPlayers: 1,
    scores: [0, 0],
    currentQuestionIndex: 0,
    combo: 0,
    maxCombo: 0,
    correctPops: 0,
    wrongPops: 0,
    questionStartTime: 0,
    questions: [] as Question[]
  });
  
  const questionTimerRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Graphics state
  const graphicsState = useRef({
    bubbles: [] as any[],
    particles: [] as any[],
    shockwaves: [] as any[],
    floatingTexts: [] as any[],
    isQuestionActive: false
  });
  
  const pointerColors = [
    { main: '#3b82f6', glow: 'rgba(59, 130, 246, 0.6)' }, 
    { main: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)' }  
  ];

  const pointers = useRef([
    { x: -100, y: -100, active: false, history: [] as any[], color: pointerColors[0] },
    { x: -100, y: -100, active: false, history: [] as any[], color: pointerColors[1] }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('bubbleAcademySave');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.player) setPlayerData(parsed.player);
            if (parsed.stats) setStatsData(parsed.stats);
        } catch (e) {}
    }
    
    return () => {
      gameState.current.isActive = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, []);

  const saveGame = (p: PlayerData, s: StatsData) => {
    localStorage.setItem('bubbleAcademySave', JSON.stringify({ player: p, stats: s }));
  };

  const initAudio = () => {
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
    }
  };

  const playSound = (type: 'pop' | 'win' | 'lose') => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    const now = audioCtxRef.current.currentTime;
    const comboMultiplier = Math.min(gameState.current.combo || 0, 10);
    const pitchShift = 1 + (comboMultiplier * 0.1); 
    
    if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 * pitchShift, now);
        osc.frequency.exponentialRampToValueAtTime(100 * pitchShift, now + 0.1);
        gainNode.gain.setValueAtTime(0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.15);
    } else if (type === 'win') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440 * pitchShift, now);
        osc.frequency.setValueAtTime(554.37 * pitchShift, now + 0.1);
        osc.frequency.setValueAtTime(659.25 * pitchShift, now + 0.2);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now); osc.stop(now + 0.45);
    } else if (type === 'lose') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.3);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.35);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanedText = text.replace(/_+/g, "blank");
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.rate = 0.85; 
        utterance.pitch = 1.1; 
        window.speechSynthesis.speak(utterance);
    }
  };

  const startGameMode = async (players: number) => {
    setNumPlayers(players);
    gameState.current.numPlayers = players;
    initAudio();
    
    setScreen('loading');
    
    if (!videoRef.current?.srcObject) {
       await setupCamera();
    }
    
    gameState.current = {
        isActive: true,
        numPlayers: players,
        scores: [0, 0],
        currentQuestionIndex: 0,
        combo: 0,
        maxCombo: 0,
        correctPops: 0,
        wrongPops: 0,
        questionStartTime: 0,
        questions: activeQuiz ? [...activeQuiz.questions].sort(() => 0.5 - Math.random()).slice(0, Math.min(5, activeQuiz.questions.length)) : []
    };
    
    setScores([0, 0]);
    setCombo(0);
    setShowCombo(false);

    setScreen('game');
    
    setTimeout(() => {
        runGameEngine();
        startQuestion();
    }, 100);
  };

  class Bubble {
      index: number; text: string; isCorrect: boolean; color: string;
      radius: number; scale: number; targetScale: number;
      x: number; y: number; baseVy: number; vy: number; vx: number;
      time: number; popped: boolean; state: string; width: number; height: number;
      imageElement?: HTMLImageElement;

      constructor(index: number, text: string, isCorrect: boolean, totalOptions: number, w: number, h: number) {
          this.index = index; this.text = text; this.isCorrect = isCorrect;
          const bubbleColors = ['#ef4444', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#f97316'];
          this.color = bubbleColors[index % bubbleColors.length];
          this.width = w; this.height = h;
          
          this.radius = Math.min(w, h) * 0.09; 
          this.scale = 0; 
          this.targetScale = 1;
          
          const sectionWidth = w / totalOptions;
          this.x = (sectionWidth * index) + (sectionWidth / 2) + ((Math.random() - 0.5) * sectionWidth * 0.4); 
          this.y = -this.radius - (Math.random() * 200); 
          this.baseVy = 1.5 + Math.random();
          this.vy = this.baseVy;
          this.vx = (Math.random() - 0.5) * 1.5; 
          this.time = Math.random() * 100;
          this.popped = false;
          this.state = 'normal';

          if (this.text.startsWith('data:image') || this.text.startsWith('http')) {
              this.imageElement = new Image();
              this.imageElement.onload = () => { (this.imageElement as any).isLoaded = true; };
              this.imageElement.src = this.text;
          }
      }
      update() {
          if (this.popped) return;
          this.time += 0.05;
          this.scale += (this.targetScale - this.scale) * 0.15;
          this.x += this.vx + Math.sin(this.time) * 1.5;
          this.y += this.vy + Math.cos(this.time * 0.5) * 0.5;
          if (this.y > this.height + this.radius) {
              this.y = -this.radius;
              this.x = (this.width * 0.15) + (Math.random() * this.width * 0.7);
          }
          if (this.x < this.radius || this.x > this.width - this.radius) this.vx *= -1;
      }
      draw(ctx: CanvasRenderingContext2D) {
          if (this.popped) return;
          ctx.save();
          ctx.translate(this.x, this.y);
          const wobble = 1 + Math.sin(this.time * 2) * 0.03;
          let finalScale = this.scale * wobble;
          if(this.state === 'shaking') finalScale += (Math.random() - 0.5) * 0.1;
          ctx.scale(finalScale, 1/finalScale);

          const grad = ctx.createRadialGradient(-this.radius*0.3, -this.radius*0.3, this.radius*0.1, 0, 0, this.radius);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          grad.addColorStop(0.2, this.color);
          grad.addColorStop(0.8, this.color + 'aa');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.shadowBlur = 0; 

          ctx.beginPath();
          ctx.arc(-this.radius*0.3, -this.radius*0.3, this.radius*0.4, Math.PI, Math.PI*1.5);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = this.radius * 0.15;
          ctx.lineCap = 'round';
          ctx.stroke();

          if (this.imageElement && (this.imageElement as any).isLoaded) {
              ctx.save();
              ctx.beginPath();
              ctx.arc(0, 0, this.radius * 0.8, 0, Math.PI * 2);
              ctx.clip();
              const imgSize = this.radius * 1.6;
              ctx.drawImage(this.imageElement, -imgSize/2, -imgSize/2, imgSize, imgSize);
              ctx.restore();
          } else if (!this.imageElement) {
              ctx.fillStyle = '#ffffff';
              const fontSize = this.text.length > 4 ? this.radius * 0.40 : this.radius * 0.55;
              ctx.font = `900 ${fontSize}px 'Fredoka', sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.shadowColor = 'rgba(0,0,0,0.6)';
              ctx.shadowBlur = 4;
              ctx.fillText(this.text, 0, this.radius * 0.05);
          }
          ctx.restore();
      }
      checkCollision(px: number, py: number) {
          if (this.popped || this.scale < 0.8) return false;
          const dx = this.x - px;
          const dy = this.y - py;
          return (dx*dx + dy*dy) < (this.radius * this.radius);
      }
  }

  class Particle {
      x: number; y: number; color: string; isSparkle: boolean;
      vx: number; vy: number; life: number; size: number;
      constructor(x: number, y: number, color: string, isSparkle = false) {
          this.x = x; this.y = y; this.color = color; this.isSparkle = isSparkle;
          const speed = isSparkle ? 20 : 12;
          this.vx = (Math.random() - 0.5) * speed;
          this.vy = (Math.random() - 0.5) * speed;
          this.life = 1.0;
          this.size = isSparkle ? Math.random() * 4 + 2 : Math.random() * 8 + 4;
      }
      update() {
          this.x += this.vx; this.y += this.vy;
          this.vy += 0.4; this.life -= 0.03;
      }
      draw(ctx: CanvasRenderingContext2D) {
          if (this.life <= 0) return;
          ctx.save();
          ctx.globalAlpha = this.life;
          if (this.isSparkle) {
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#ffffff';
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
              ctx.fill();
          } else {
              ctx.fillStyle = this.color;
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
              ctx.fill();
          }
          ctx.restore();
      }
  }

  class Shockwave {
      x: number; y: number; color: string; radius: number; life: number;
      constructor(x: number, y: number, color: string) {
          this.x = x; this.y = y; this.color = color;
          this.radius = 10; this.life = 1.0;
      }
      update() { this.radius += 8; this.life -= 0.05; }
      draw(ctx: CanvasRenderingContext2D) {
          if (this.life <= 0) return;
          ctx.save();
          ctx.globalAlpha = this.life;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.lineWidth = 4;
          ctx.strokeStyle = this.color;
          ctx.stroke();
          ctx.restore();
      }
  }

  class FloatingText {
      x: number; y: number; text: string; color: string; life: number; vy: number; size: number;
      constructor(x: number, y: number, text: string, color: string, isCombo = false) {
          this.x = x; this.y = y; this.text = text; this.color = color;
          this.life = 1.0; this.vy = -2; this.size = isCombo ? 60 : 40;
      }
      update() { this.y += this.vy; this.life -= 0.015; }
      draw(ctx: CanvasRenderingContext2D) {
          if (this.life <= 0) return;
          ctx.save();
          ctx.globalAlpha = this.life;
          ctx.font = `900 ${this.size}px 'Fredoka', sans-serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.lineWidth = 6; ctx.strokeStyle = '#000000';
          ctx.strokeText(this.text, this.x, this.y);
          ctx.fillStyle = this.color;
          ctx.fillText(this.text, this.x, this.y);
          ctx.restore();
      }
  }

  const createExplosion = (x: number, y: number, color: string) => {
      graphicsState.current.shockwaves.push(new Shockwave(x, y, color));
      for (let i=0; i<20; i++) graphicsState.current.particles.push(new Particle(x, y, color, false)); 
      for (let i=0; i<15; i++) graphicsState.current.particles.push(new Particle(x, y, color, true));  
  };

  const startQuestion = () => {
    if (gameState.current.currentQuestionIndex >= gameState.current.questions.length) {
        showResults();
        return;
    }
    const q = gameState.current.questions[gameState.current.currentQuestionIndex];
    setQuestionText(q.text);
    speakText(q.text);
    
    graphicsState.current.bubbles = []; 
    graphicsState.current.floatingTexts = [];
    graphicsState.current.isQuestionActive = false;
    
    let timeLeft = 3; 
    setCountdown(timeLeft);
    
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    
    questionTimerRef.current = setInterval(() => {
        if (!gameState.current.isActive) {
            clearInterval(questionTimerRef.current);
            return;
        }
        timeLeft--;
        if (timeLeft > 0) {
            setCountdown(timeLeft);
            playSound('pop'); 
        } else {
            clearInterval(questionTimerRef.current);
            setCountdown(null);
            
            const w = containerRef.current?.clientWidth || 800;
            const h = containerRef.current?.clientHeight || 600;

            q.options.forEach((optText, i) => {
                graphicsState.current.bubbles.push(new Bubble(i, optText, i === q.answerIndex, q.options.length, w, h));
            });
            
            graphicsState.current.isQuestionActive = true;
            gameState.current.questionStartTime = Date.now(); 
        }
    }, 1000);
  };

  const handlePop = (bubble: any, playerIndex: number) => {
    if (!graphicsState.current.isQuestionActive) return;
    
    bubble.state = 'shaking'; 
    
    setTimeout(() => {
        bubble.popped = true;
        createExplosion(bubble.x, bubble.y, bubble.color);
        
        if (bubble.isCorrect) {
            playSound('win');
            setStatsData(prev => ({...prev, bubblesPopped: prev.bubblesPopped + 1}));
            gameState.current.correctPops++;
            gameState.current.combo++;
            
            if(gameState.current.combo > gameState.current.maxCombo) {
                gameState.current.maxCombo = gameState.current.combo;
            }
            
            let points = 10 * Math.min(gameState.current.combo, 4);
            const timeTaken = Date.now() - gameState.current.questionStartTime;
            if (timeTaken < 2000) { 
                points += 15;
                const w = containerRef.current?.clientWidth || 800;
                const h = containerRef.current?.clientHeight || 600;
                graphicsState.current.floatingTexts.push(new FloatingText(w/2, h/2 - 100, "FAST HANDS!", '#fbbf24', true));
            }
            
            gameState.current.scores[playerIndex] += points;
            
            graphicsState.current.floatingTexts.push(new FloatingText(bubble.x, bubble.y, `+${points}`, '#4ade80'));
            
            if(gameState.current.combo > 1) {
                setCombo(gameState.current.combo);
                setShowCombo(true);
                // Trigger re-render animation using a small timeout hack in real life, but React handles it by remounting if keyed or we can just rely on css animation triggers on state change.
            }
            
            setScores([...gameState.current.scores]);
            graphicsState.current.isQuestionActive = false;
            
            graphicsState.current.bubbles.forEach(b => {
                if (!b.popped) {
                    setTimeout(() => {
                        b.popped = true;
                        createExplosion(b.x, b.y, b.color);
                        playSound('pop');
                    }, Math.random() * 300);
                }
            });

            setQuestionText(`Amazing!`);
            speakText("Correct!");
            
            setTimeout(() => {
                gameState.current.currentQuestionIndex++;
                setShowCombo(false);
                startQuestion();
            }, 2000);

        } else {
            playSound('lose');
            gameState.current.wrongPops++;
            gameState.current.combo = 0; 
            setShowCombo(false);

            const penalty = 5;
            gameState.current.scores[playerIndex] = Math.max(0, gameState.current.scores[playerIndex] - penalty);
            setScores([...gameState.current.scores]);
            
            graphicsState.current.floatingTexts.push(new FloatingText(bubble.x, bubble.y, `-${penalty}`, '#ef4444'));
            
            if (canvasRef.current) {
                canvasRef.current.classList.add('shake');
                setTimeout(() => canvasRef.current?.classList.remove('shake'), 400);
            }
        }
    }, 100);
  };

  const showResults = () => {
    gameState.current.isActive = false;
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    
    const total = gameState.current.correctPops + gameState.current.wrongPops;
    const acc = total === 0 ? 0 : Math.round((gameState.current.correctPops / total) * 100);
    const totalScore = gameState.current.scores[0] + gameState.current.scores[1];
    
    const xp = totalScore + (gameState.current.maxCombo * 20);
    const coins = Math.floor(xp / 10);
    
    let newLevel = playerData.level;
    let newXp = playerData.xp + xp;
    let newXpNext = playerData.xpNext;

    if(newXp >= newXpNext) {
        newLevel++;
        newXp -= newXpNext;
        newXpNext = Math.floor(newXpNext * 1.5);
    }

    const newPlayerData = {
        ...playerData,
        level: newLevel,
        xp: newXp,
        xpNext: newXpNext,
        coins: playerData.coins + coins
    };

    const newStatsData = {
        ...statsData,
        gamesPlayed: statsData.gamesPlayed + 1
    };

    setPlayerData(newPlayerData);
    setStatsData(newStatsData);
    saveGame(newPlayerData, newStatsData);

    setAccuracy(acc);
    setXpEarned(xp);
    setCoinsEarned(coins);
    
    let title = "Good Try!";
    if (acc > 90) title = "Perfect Round!";
    else if (acc > 70) title = "Excellent!";
    setResultsTitle(title);
    
    playSound('win');
    setScreen('results');
  };

  const runGameEngine = () => {
    if (!gameState.current.isActive) return;
    
    animationRef.current = requestAnimationFrame(runGameEngine);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    if (videoRef.current && videoRef.current.readyState >= 2) {
        ctx.save();
        ctx.translate(width, 0); ctx.scale(-1, 1);
        
        const vRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
        const cRatio = width / height;
        let dWidth, dHeight, dx, dy;

        if (vRatio > cRatio) {
            dHeight = height; dWidth = height * vRatio;
            dx = (width - dWidth) / 2; dy = 0;
        } else {
            dWidth = width; dHeight = width / vRatio;
            dx = 0; dy = (height - dHeight) / 2;
        }
        
        ctx.globalAlpha = 0.3; 
        ctx.drawImage(videoRef.current, dx, dy, dWidth, dHeight);
        ctx.restore();
    }

    graphicsState.current.bubbles.forEach(b => { b.update(); b.draw(ctx); });
    
    ctx.globalCompositeOperation = 'lighter'; 
    graphicsState.current.particles = graphicsState.current.particles.filter(p => p.life > 0);
    graphicsState.current.particles.forEach(p => { p.update(); p.draw(ctx); });
    
    graphicsState.current.shockwaves = graphicsState.current.shockwaves.filter(s => s.life > 0);
    graphicsState.current.shockwaves.forEach(s => { s.update(); s.draw(ctx); });
    ctx.globalCompositeOperation = 'source-over'; 

    graphicsState.current.floatingTexts = graphicsState.current.floatingTexts.filter(ft => ft.life > 0);
    graphicsState.current.floatingTexts.forEach(ft => { ft.update(); ft.draw(ctx); });

    pointers.current.forEach((pointer, pIndex) => {
        if (pointer.active) {
            pointer.history.push({x: pointer.x, y: pointer.y});
            if (pointer.history.length > 15) pointer.history.shift();

            if (graphicsState.current.isQuestionActive) {
                graphicsState.current.bubbles.forEach(b => {
                    if (b.checkCollision(pointer.x, pointer.y)) handlePop(b, pIndex);
                });
            }
            pointer.active = false; 
        } else if (pointer.history.length > 0) {
            pointer.history.shift(); 
        }

        if (pointer.history.length > 1) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath();
            ctx.moveTo(pointer.history[0].x, pointer.history[0].y);
            for (let i = 1; i < pointer.history.length; i++) {
                ctx.lineTo(pointer.history[i].x, pointer.history[i].y);
            }
            ctx.strokeStyle = pointer.color.glow;
            ctx.lineWidth = 30;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            
            ctx.strokeStyle = pointer.color.main;
            ctx.lineWidth = 10;
            ctx.stroke();
            ctx.restore();
            
            const tip = pointer.history[pointer.history.length - 1];
            ctx.save();
            ctx.translate(tip.x, tip.y);
            ctx.rotate(Date.now() * 0.005);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = pointer.color.main;
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.moveTo(0, -20); ctx.quadraticCurveTo(5, -5, 20, 0);
            ctx.quadraticCurveTo(5, 5, 0, 20); ctx.quadraticCurveTo(-5, 5, -20, 0);
            ctx.quadraticCurveTo(-5, -5, 0, -20);
            ctx.fill();
            ctx.restore();
        }
    });
  };

  const onResults = (results: any) => {
    if (!gameState.current.isActive) return;
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        let detected = [];
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            const tip = results.multiHandLandmarks[i][8];
            detected.push({ x: (1.0 - tip.x) * width, y: tip.y * height });
        }
        detected.sort((a, b) => a.x - b.x);

        if (gameState.current.numPlayers === 1 && detected.length > 0) {
            pointers.current[0].x = detected[0].x; pointers.current[0].y = detected[0].y;
            pointers.current[0].active = true;
        } else if (gameState.current.numPlayers === 2) {
            if (detected.length === 1) {
                const isLeft = detected[0].x < width / 2;
                pointers.current[isLeft ? 0 : 1].x = detected[0].x;
                pointers.current[isLeft ? 0 : 1].y = detected[0].y;
                pointers.current[isLeft ? 0 : 1].active = true;
            } else if (detected.length >= 2) {
                pointers.current[0].x = detected[0].x; pointers.current[0].y = detected[0].y; pointers.current[0].active = true;
                pointers.current[1].x = detected[1].x; pointers.current[1].y = detected[1].y; pointers.current[1].active = true;
            }
        }
    }
  };

  const setupCamera = async () => {
    try {
        const win = window as any;
        if (win.Hands && win.Camera) {
            const hands = new win.Hands({locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
            hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
            hands.onResults(onResults);
            
            if (videoRef.current) {
                const camera = new win.Camera(videoRef.current, {
                    onFrame: async () => { if (videoRef.current) await hands.send({image: videoRef.current}); },
                    width: 1280, height: 720
                });
                await camera.start();
            }
        }
    } catch (e) {
        console.error(e);
    }
  };

  useEffect(() => {
    if (canvasRef.current && screen === 'game') {
        const handleMouseMove = (e: MouseEvent) => {
            if (!gameState.current.isActive) return;
            const rect = canvasRef.current!.getBoundingClientRect();
            const width = rect.width;
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            
            if (gameState.current.numPlayers === 1) {
                pointers.current[0].x = mx; pointers.current[0].y = my; pointers.current[0].active = true;
            } else {
                const isLeft = mx < width / 2;
                pointers.current[isLeft ? 0 : 1].x = mx; pointers.current[isLeft ? 0 : 1].y = my;
                pointers.current[isLeft ? 0 : 1].active = true;
            }
        };
        canvasRef.current.addEventListener('mousemove', handleMouseMove);
        return () => canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
    }
  }, [screen]);

  return (
    <div id="game-container" className="h-[calc(100vh-2rem)] w-full -m-4 md:-m-8 bg-[#0f172a] text-white flex flex-col font-['Fredoka',sans-serif] overflow-hidden relative selection:bg-cyan-500/30 rounded-xl" style={{ margin: '-1rem', height: 'calc(100% + 2rem)' }} ref={containerRef}>
      
      {/* Back button overlay */}
      <button 
        onClick={() => {
            gameState.current.isActive = false;
            onViewChange("home");
        }}
        className="absolute top-4 left-4 z-[60] flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border text-white/80 hover:text-white bg-black/20 hover:bg-black/50 border-white/20"
      >
        <ArrowLeft size={24} />
      </button>
        <FullscreenButton targetId="game-container" className="ml-2" />

      <style>{`
        .glass-panel {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .btn-primary {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            transition: all 0.2s;
        }
        .btn-primary:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 10px 25px rgba(139, 92, 246, 0.5);
        }
        .loading-bar-container {
            width: 300px; height: 20px; background: rgba(0,0,0,0.3);
            border-radius: 10px; overflow: hidden; border: 2px solid rgba(255,255,255,0.2);
        }
        .loading-bar-fill {
            height: 100%; background: linear-gradient(90deg, #4ade80, #3b82f6);
            transition: width 0.1s linear;
        }
        @keyframes popIn {
            0% { transform: scale(0); opacity: 0; }
            80% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
            10%, 90% { transform: translate3d(-10px, 0, 0); }
            20%, 80% { transform: translate3d(15px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-20px, 0, 0); }
            40%, 60% { transform: translate3d(20px, 0, 0); }
        }
      `}</style>
      
      <video ref={videoRef} className="hidden" autoPlay playsInline></video>

      {/* Screen: Intro */}
      {screen === 'intro' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900">
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] tracking-wider">
                BUBBLE ACADEMY
            </h1>
            <p className="mt-4 text-xl text-slate-400">Loading Magic Engines...</p>
        </div>
      )}

      {/* Screen: Editor */}
      {screen === 'editor' && activeQuiz && (
        <QuizEditor 
          quiz={activeQuiz} 
          onSave={saveQuiz} 
          onCancel={() => onViewChange('games')} 
          folders={folders}
        />
      )}

      {/* Screen: Setup */}
      {screen === 'setup' && (
        <div className="absolute inset-0 z-40 bg-slate-900 flex flex-col items-center justify-center p-8">
            <h2 className="text-5xl font-black mb-12 drop-shadow-lg text-white">Select Game Mode</h2>
            <div className="flex gap-8 max-w-4xl w-full">
                <button onClick={() => startGameMode(1)} className="flex-1 glass-panel hover:bg-white/10 rounded-3xl p-10 flex flex-col items-center border-t-4 border-blue-400 transition-transform hover:scale-105 cursor-pointer text-white">
                    <div className="text-6xl mb-6 bg-blue-500 w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.6)]">👤</div>
                    <h3 className="text-3xl font-bold mb-2">1 Player</h3>
                    <p className="text-slate-400 text-center">Practice and earn maximum XP.</p>
                </button>
                <button onClick={() => startGameMode(2)} className="flex-1 glass-panel hover:bg-white/10 rounded-3xl p-10 flex flex-col items-center border-t-4 border-red-400 transition-transform hover:scale-105 cursor-pointer text-white">
                    <div className="text-6xl mb-6 bg-red-500 w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.6)]">👥</div>
                    <h3 className="text-3xl font-bold mb-2">2 Players</h3>
                    <p className="text-slate-400 text-center">Compete side-by-side!</p>
                </button>
            </div>
            <div className="flex gap-4 mt-12">
              <button onClick={() => onViewChange('games')} className="px-8 py-3 rounded-full glass-panel hover:bg-white/20 text-xl font-bold text-white cursor-pointer">Back to Games</button>
              {initialGame && (
                <button onClick={() => setScreen('editor')} className="px-8 py-3 rounded-full glass-panel border border-blue-500/50 hover:bg-blue-500/20 text-xl font-bold text-blue-300 cursor-pointer">
                  <Edit3 size={18} className="inline mr-2" /> Edit Game
                </button>
              )}
            </div>
        </div>
      )}

      {/* Screen: Loading */}
      {screen === 'loading' && (
        <div className="absolute inset-0 z-40 bg-[#0f172a] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-[spin_120s_linear_infinite]"></div>
            <div className="text-6xl mb-8 animate-bounce z-10">🫧</div>
            <h2 className="text-3xl font-bold mb-2 z-10 text-white">Loading Camera & AI...</h2>
            <p className="text-slate-400 mb-8 z-10">Please grant camera permissions.</p>
            <div className="loading-bar-container z-10">
                <div className="loading-bar-fill animate-[pulse_2s_infinite]" style={{ width: '100%' }}></div>
            </div>
        </div>
      )}

      {/* Screen: Game */}
      {screen === 'game' && (
        <div className="absolute inset-0 z-30 flex flex-col">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,#1e3a8a,#0f172a)] z-0 pointer-events-none"></div>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10"></canvas>

            <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none z-20 pt-20">
                <div className="flex justify-between items-start w-full gap-4">
                    
                    <div className="glass-panel bg-slate-900/80 rounded-2xl p-4 min-w-[200px] border-l-4 border-blue-500 flex items-center gap-4 backdrop-blur-md">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(59,130,246,0.6)]">P1</div>
                        <div>
                            <div className="text-sm font-bold text-blue-400 uppercase tracking-wider">Score</div>
                            <div className="text-3xl font-black">{scores[0]}</div>
                        </div>
                    </div>

                    <div className="glass-panel bg-slate-900/90 rounded-2xl flex-grow max-w-4xl p-6 text-center border-t-4 border-indigo-500 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                        <h1 className="text-2xl md:text-4xl font-black text-white leading-relaxed drop-shadow-md">{questionText}</h1>
                        
                        {showCombo && (
                            <div key={`combo-${combo}`} className="absolute right-4 top-1/2 -translate-y-1/2 text-center animate-pop">
                                <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Combo</div>
                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-orange-500">x{combo}</div>
                            </div>
                        )}
                    </div>

                    {numPlayers === 2 ? (
                        <div className="glass-panel bg-slate-900/80 rounded-2xl p-4 min-w-[200px] border-r-4 border-red-500 flex items-center justify-end gap-4 backdrop-blur-md">
                            <div className="text-right">
                                <div className="text-sm font-bold text-red-400 uppercase tracking-wider">Score</div>
                                <div className="text-3xl font-black">{scores[1]}</div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.6)]">P2</div>
                        </div>
                    ) : (
                        <div className="min-w-[200px]"></div>
                    )}
                </div>

                <div className="flex justify-between items-end w-full">
                    <button onClick={() => {
                        gameState.current.isActive = false;
                        if (questionTimerRef.current) clearInterval(questionTimerRef.current);
                        setScreen('setup');
                    }} className="glass-panel px-6 py-2 rounded-full hover:bg-white/20 font-bold pointer-events-auto border border-white/20 cursor-pointer">Exit</button>
                    
                    {countdown !== null ? (
                        <div className="glass-panel bg-blue-900/80 rounded-full px-8 py-3 border-2 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                            <span className="text-2xl font-bold text-blue-200">Bubbles in <span className="text-white text-3xl font-black">{countdown}</span>...</span>
                        </div>
                    ) : <div></div>}
                    <div className="w-[100px]"></div>
                </div>
            </div>
        </div>
      )}

      {/* Screen: Results */}
      {screen === 'results' && (
        <div className="absolute inset-0 z-50 bg-[#0f121b] flex flex-col items-center justify-center overflow-hidden font-sans">
            <div className="rounded-3xl p-8 max-w-2xl w-full text-center relative z-10 bg-[#252836] shadow-2xl border border-slate-700/50">
                <h2 className="text-3xl md:text-4xl font-black text-yellow-400 uppercase tracking-widest mb-6 drop-shadow-sm">{resultsTitle}</h2>
                <div className="flex justify-center gap-3 mb-10">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="relative">
                            <svg 
                                viewBox="0 0 24 24" 
                                className={`w-12 h-12 md:w-16 md:h-16 transition-all duration-500 transform ${accuracy >= (star * 20 - 10) ? 'scale-100 opacity-100' : 'scale-75 opacity-30 grayscale'}`}
                                style={{
                                    filter: accuracy >= (star * 20 - 10) ? 'drop-shadow(0 8px 6px rgba(0,0,0,0.4))' : 'none',
                                    animation: accuracy >= (star * 20 - 10) ? `popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${star * 0.1}s both` : 'none'
                                }}
                            >
                                <path 
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                                    fill={accuracy >= (star * 20 - 10) ? "#facc15" : "#475569"} 
                                    stroke={accuracy >= (star * 20 - 10) ? "#ca8a04" : "#334155"} 
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 md:gap-6 mb-10">
                    <div className="bg-[#303343] p-5 rounded-xl border border-white/5 shadow-inner flex flex-col items-center justify-center">
                        <div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">Accuracy</div>
                        <div className="text-3xl md:text-5xl font-black text-emerald-400 drop-shadow-sm">{accuracy}%</div>
                    </div>
                    <div className="bg-[#303343] p-5 rounded-xl border border-white/5 shadow-inner flex flex-col items-center justify-center">
                        <div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">Score</div>
                        <div className="text-3xl md:text-5xl font-black text-sky-400 drop-shadow-sm">{numPlayers === 1 ? scores[0] : `P1:${scores[0]} P2:${scores[1]}`}</div>
                    </div>
                    <div className="bg-[#303343] p-5 rounded-xl border border-white/5 shadow-inner flex flex-col items-center justify-center">
                        <div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">XP Earned</div>
                        <div className="text-2xl md:text-4xl font-black text-fuchsia-400 drop-shadow-sm">+{xpEarned}</div>
                    </div>
                    <div className="bg-[#303343] p-5 rounded-xl border border-white/5 shadow-inner flex flex-col items-center justify-center">
                        <div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">Coins Earned</div>
                        <div className="text-2xl md:text-4xl font-black text-yellow-400 drop-shadow-sm">+{coinsEarned}</div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={() => setScreen('setup')} className="px-8 py-4 bg-[#393c4b] hover:bg-[#444857] rounded-xl font-black text-lg transition-colors cursor-pointer text-white shadow-lg">Back to Setup</button>
                    <button onClick={() => startGameMode(numPlayers)} className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 rounded-xl font-black text-lg text-white cursor-pointer shadow-lg hover:shadow-indigo-500/25 transition-all">Play Again</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}


function QuizEditor({ quiz, onSave, onCancel, folders }: { quiz: Quiz, onSave: (q: Quiz) => void, onCancel: () => void, folders: { id: string; name: string }[] }) {
  const [folderId, setFolderId] = useState(quiz.folderId || "");
  const [topic, setTopic] = useState(quiz.topic || "");
  const [classLevel, setClassLevel] = useState(quiz.classLevel || "");
  const [questions, setQuestions] = useState<Question[]>(quiz.questions);
  const [errorMsg, setErrorMsg] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(null);

  const generateImageForOption = async (qId: number, optIndex: number, promptText: string) => {
    if (!promptText.trim()) {
        setErrorMsg("Enter text in the option first to generate an emoji.");
        setTimeout(() => setErrorMsg(""), 3000);
        return;
    }
    
    setIsGeneratingImage(`${qId}-${optIndex}`);
    try {
        const res = await fetch("/api/generate-emoji", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: promptText })
        });
        
        if (!res.ok) {
            let errorDetails = res.statusText;
            try {
                const errData = await res.json();
                errorDetails = errData.error || res.statusText;
                if (typeof errorDetails === 'string' && errorDetails.includes('exceeded your current quota')) {
                  errorDetails = "Free tier quota exceeded. Please wait a minute and try again.";
                }
            } catch (e) {}
            throw new Error(`Failed to generate emoji: ${errorDetails}`);
        }
        
        const data = await res.json();
        if (data.emoji) {
            updateOption(qId, optIndex, `${data.emoji} ${promptText}`);
        } else {
            throw new Error("No emoji returned");
        }
    } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "Failed to generate emoji");
        setTimeout(() => setErrorMsg(""), 3000);
    } finally {
        setIsGeneratingImage(null);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: '', options: ['', '', '', ''], answerIndex: 0 }]);
  };

  const updateQuestion = (id: number | string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId: number | string, optIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addOption = (qId: number | string) => {
    setQuestions(questions.map(q => {
        if (q.id === qId && q.options.length < 6) {
            return { ...q, options: [...q.options, ''] };
        }
        return q;
    }));
  };

  const removeOption = (qId: number | string) => {
    setQuestions(questions.map(q => {
        if (q.id === qId && q.options.length > 2) {
            const newOptions = [...q.options];
            newOptions.pop();
            const newAnswerIndex = q.answerIndex >= newOptions.length ? newOptions.length - 1 : q.answerIndex;
            return { ...q, options: newOptions, answerIndex: newAnswerIndex };
        }
        return q;
    }));
  };

  const removeQuestion = (id: number | string) => {
    setQuestions(prev => {
      if (prev.length > 1) {
        return prev.filter(q => q.id !== id);
      }
      return prev;
    });
  };

  const handleSave = () => {
    const generatedTitle = "Bubble Pop Game";

    const validQuestions = questions.filter(q => q.text.trim());
    if(validQuestions.length === 0) {
      setErrorMsg("Please add at least one complete question.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    
    onSave({
      ...quiz,
      title: generatedTitle,
      folderId,
      topic,
      classLevel,
      questions: validQuestions
    });
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-900 flex flex-col items-center py-8 px-4 overflow-y-auto">
      <div className="w-full max-w-4xl glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl mb-8">
        <div className="bg-slate-800/80 p-8 flex flex-col gap-6 border-b-2 border-blue-500/50">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-white tracking-wide">GAME EDITOR</h2>
                <div className="flex gap-3 items-center">
                    <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 cursor-pointer">
                        <Save size={18} /> Save Quiz
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Topic</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Present Simple" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full text-sm font-medium bg-slate-900 border border-slate-700 outline-none text-white px-4 py-3 rounded-xl focus:border-blue-500 placeholder-slate-600 transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Class Level</label>
                    <input 
                      type="text" 
                      placeholder="e.g. KET, Starters" 
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      className="w-full text-sm font-medium bg-slate-900 border border-slate-700 outline-none text-white px-4 py-3 rounded-xl focus:border-blue-500 placeholder-slate-600 transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Folder</label>
                    <select 
                      value={folderId}
                      onChange={(e) => setFolderId(e.target.value)}
                      className="w-full text-sm font-medium bg-slate-900 border border-slate-700 outline-none text-white px-4 py-3 rounded-xl focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                    >
                      <option value="">No Folder (Root)</option>
                      {folders.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                </div>
            </div>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 text-red-400 p-3 mx-6 mt-6 rounded-lg font-medium text-center border border-red-500/30 animate-pulse">
            {errorMsg}
          </div>
        )}

        <div className="p-6 flex flex-col gap-6 bg-slate-900/50">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-sm relative group">
              <button 
                onClick={() => removeQuestion(q.id)}
                className="absolute -right-3 -top-3 w-8 h-8 bg-slate-700 text-slate-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white border-2 border-slate-900 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
              
              <div className="flex gap-4 mb-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 border border-blue-500/30">
                  {index + 1}
                </div>
                <input 
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                  placeholder="Type your question here..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white font-medium"
                />
              </div>

              <div className="ml-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name={`answer-${q.id}`} 
                      checked={q.answerIndex === optIndex}
                      onChange={() => updateQuestion(q.id, 'answerIndex', optIndex)}
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500 bg-slate-900 border-slate-600"
                    />
                    {opt.startsWith('data:image') || opt.startsWith('http') ? (
                      <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5 pr-3">
                        <img src={opt} alt="Option" className="w-8 h-8 rounded object-cover" />
                        <span className="text-xs text-slate-400 flex-1 truncate">Image Generated</span>
                        <button onClick={() => updateOption(q.id, optIndex, '')} className="text-red-400 hover:text-red-300 cursor-pointer p-1">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center gap-2">
                        <input 
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                          placeholder={`Option ${optIndex + 1}`}
                          className={`flex-1 min-w-0 bg-slate-900 border ${q.answerIndex === optIndex ? 'border-blue-500/50 bg-blue-500/10 text-blue-300' : 'border-slate-700 text-slate-300'} rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm font-medium`}
                        />
                        <button 
                          onClick={() => generateImageForOption(q.id, optIndex, opt)}
                          disabled={isGeneratingImage === `${q.id}-${optIndex}`}
                          className="bg-purple-500/20 text-purple-400 p-2 rounded-lg hover:bg-purple-500 hover:text-white transition-colors disabled:opacity-50 shrink-0 cursor-pointer flex items-center justify-center"
                          title="Generate Emoji"
                        >
                          {isGeneratingImage === `${q.id}-${optIndex}` ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Sparkles size={16} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="ml-12 mt-3 flex gap-2">
                  <button onClick={() => addOption(q.id)} disabled={q.options.length >= 6} className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded hover:bg-slate-600 disabled:opacity-50 cursor-pointer">+ Option</button>
                  <button onClick={() => removeOption(q.id)} disabled={q.options.length <= 2} className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded hover:bg-slate-600 disabled:opacity-50 cursor-pointer">- Option</button>
              </div>
            </div>
          ))}

          <button 
            onClick={addQuestion}
            className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl text-slate-400 font-bold hover:bg-slate-800 hover:border-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={20} /> Add Another Question
          </button>
        </div>
      </div>
    </div>
  );
}
