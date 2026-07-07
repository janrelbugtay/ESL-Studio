import React, { useState, useEffect } from "react";
import {
  Trophy,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Skull,
  Plus,
  Save,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export interface SharkGameData {
  id?: string;
  name: string;
  className: string;
  topic: string;
  sentences: { text: string }[];
  userId: string;
}

// The new Glossary terms and definitions
const SENTENCES = [
  { text: "The most important body parts inside us that help us live" },
  { text: "A group of body parts that work together to do a job" },
  { text: "An organ that cleans our blood and helps digest food" },
  { text: "An organ that breaks down food after we eat" },
  { text: "The job that something does" },
  { text: "To make someone healthy again after they are sick" },
  { text: "Long tubes that take nutrients from food and remove waste" },
  { text: "Two organs that clean our blood and make urine" },
  { text: "An organ that pumps blood around the body" },
  { text: "The movement of blood around the body" },
  { text: "Two organs that help us breathe" },
  { text: "The organ that helps us think, learn, and control our body" },
  { text: "The process of breaking food into nutrients our body can use" },
  { text: "The process of removing waste from the body" },
  {
    text: "The part of the body below the chest where the stomach and intestines are",
  },
  { text: "The upper front part of the body where the heart and lungs are" },
  { text: "LIVER" },
  { text: "STOMACH" },
  { text: "HEART" },
  { text: "BRAIN" },
];

const MAX_STEPS = 5;

// Helper function to shuffle an array safely
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// SVG Coordinates scaled to 1000x500
const P1_POSITIONS = [
  { left: "10%", top: "24%" }, // 0: Top edge (Safest)
  { left: "17%", top: "32%" }, // 1: Step down
  { left: "24%", top: "40%" }, // 2: Step down
  { left: "31%", top: "48%" }, // 3: Step down
  { left: "38%", top: "56%" }, // 4: Step down
  { left: "45%", top: "64%" }, // 5: Edge (near center)
  { left: "50%", top: "70%" }, // 6: Water (Lost)
];

const P2_POSITIONS = [
  { left: "90%", top: "24%" }, // 0: Top edge (Safest)
  { left: "83%", top: "32%" }, // 1: Step down
  { left: "76%", top: "40%" }, // 2: Step down
  { left: "69%", top: "48%" }, // 3: Step down
  { left: "62%", top: "56%" }, // 4: Step down
  { left: "55%", top: "64%" }, // 5: Edge (near center)
  { left: "50%", top: "70%" }, // 6: Water (Lost)
];

export function SharkLadder({
  onViewChange,
  initialGame,
}: {
  onViewChange?: (view: any) => void;
  initialGame?: any;
}) {
  const { user } = useAuth();
  const [gameState, setGameState] = useState(initialGame ? "start" : "menu"); // 'menu', 'create', 'start', 'playing', 'ended'

  // Custom Game State
  const [savedGames, setSavedGames] = useState<SharkGameData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newGameForm, setNewGameForm] = useState<SharkGameData>({
    name: "",
    className: "",
    topic: "",
    sentences: [{ text: "" }],
    userId: user?.uid || "",
  });
  const [activeGameData, setActiveGameData] = useState<SharkGameData | null>(
    initialGame || null,
  );
  const [createStep, setCreateStep] = useState(1); // 1: Metadata, 2: Sentences

  useEffect(() => {
    if (user && gameState === "menu") {
      loadSavedGames();
    }
  }, [user, gameState]);

  const loadSavedGames = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "sharkGames"),
        where("userId", "==", user.uid),
      );
      const querySnapshot = await getDocs(q);
      const games: SharkGameData[] = [];
      querySnapshot.forEach((doc) => {
        games.push({ id: doc.id, ...doc.data() } as SharkGameData);
      });
      setSavedGames(games);
    } catch (error) {
      console.error("Error loading games:", error);
    }
  };

  const handleSaveGame = async () => {
    if (!user) {
      alert("You must be logged in to save games.");
      return;
    }
    if (!newGameForm.name || !newGameForm.className || !newGameForm.topic) {
      alert("Please fill out Name, Class, and Topic.");
      return;
    }
    const validSentences = newGameForm.sentences.filter((s) => s.text.trim());
    if (validSentences.length < 1) {
      alert("Please add at least 1 valid sentence or word.");
      return;
    }

    setIsSaving(true);
    try {
      const gameToSave = {
        ...newGameForm,
        sentences: validSentences,
        userId: user.uid,
      };
      await addDoc(collection(db, "sharkGames"), gameToSave);
      alert("Game saved successfully!");
      if (onViewChange) {
        onViewChange("games");
      } else {
        setGameState("menu");
      }
      setNewGameForm({
        name: "",
        className: "",
        topic: "",
        sentences: [{ text: "" }],
        userId: user.uid,
      });
    } catch (error) {
      console.error("Error saving game:", error);
      alert("Error saving game.");
    } finally {
      setIsSaving(false);
    }
  };

  const addSentenceField = () => {
    setNewGameForm((prev) => ({
      ...prev,
      sentences: [...prev.sentences, { text: "" }],
    }));
  };

  const updateSentence = (index: number, field: "text", value: string) => {
    const newSentences = [...newGameForm.sentences];
    newSentences[index] = { ...newSentences[index], [field]: value };
    setNewGameForm((prev) => ({ ...prev, sentences: newSentences }));
  };

  const removeSentenceField = (index: number) => {
    if (newGameForm.sentences.length <= 1) return;
    const newSentences = [...newGameForm.sentences];
    newSentences.splice(index, 1);
    setNewGameForm((prev) => ({ ...prev, sentences: newSentences }));
  };

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState<{ 1: number; 2: number }>({
    1: 0,
    2: 0,
  }); // Tracks steps up the ladder
  const [eatenPlayer, setEatenPlayer] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sentencesList, setSentencesList] = useState<any[]>([]);

  const [wordPool, setWordPool] = useState<any[]>([]);
  const [selectedWords, setSelectedWords] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sharkAction, setSharkAction] = useState("idle");
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  // Spin Wheel State (Updated for two embedded wheels)
  const [wheelData, setWheelData] = useState<any>({
    1: { rotation: 0, isSpinning: false, result: null },
    2: { rotation: 0, isSpinning: false, result: null },
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [playerAnim, setPlayerAnim] = useState<{
    1: string | null;
    2: string | null;
  }>({ 1: null, 2: null });

  // Play Sound Effects (AudioContext)
  const playSound = (type: string) => {
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "stay") {
        // Success Chime (ascending)
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else {
        // Funny failure sound (descending slide)
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  };

  // Inject Custom Fonts and Keyframes
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Fredoka:wght@500;600;700&display=swap');
      
      .font-supercell { font-family: 'Fredoka', 'Nunito', sans-serif; }
      
      @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
      @keyframes wave { 0%, 100% { transform: translateX(0px) scaleY(1); } 50% { transform: translateX(10px) scaleY(1.05); } }
      @keyframes shark-roar {
        0% { transform: scale(1); }
        25% { transform: scale(1.1); }
        50% { transform: scale(1.05); }
        75% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      @keyframes shake-err {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px) rotate(-2deg); }
        50% { transform: translateX(8px) rotate(2deg); }
        75% { transform: translateX(-8px) rotate(-2deg); }
      }

      /* New Player Animations */
      @keyframes jump-cheer {
        0%, 100% { transform: scale(1) translateY(0); }
        30% { transform: scale(1.1, 0.9) translateY(0); }
        50% { transform: scale(0.9, 1.1) translateY(-30px); }
        70% { transform: scale(1.05, 0.95) translateY(0); }
      }
      @keyframes shrug-anim {
        0%, 100% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(15deg) scale(1.05); }
        75% { transform: rotate(-15deg) scale(1.05); }
      }
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
      
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-float-delayed { animation: float 3s ease-in-out 1.5s infinite; }
      .animate-wave { animation: wave 4s ease-in-out infinite; }
      .animate-shark-roar { animation: shark-roar 1s ease-in-out; }
      .animate-shake-err { animation: shake-err 0.5s ease-in-out; }
      .animate-jump-cheer { animation: jump-cheer 1s cubic-bezier(0.28, 0.84, 0.42, 1); }
      .animate-shrug { animation: shrug-anim 0.8s ease-in-out; }
      .animate-fall { animation: confetti-fall linear forwards; }

      .glass-panel {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
      }
      
      .wheel-bg {
         background: conic-gradient(
            #4ade80 0deg 60deg,
            #f87171 60deg 120deg,
            #4ade80 120deg 180deg,
            #f87171 180deg 240deg,
            #4ade80 240deg 300deg,
            #f87171 300deg 360deg
         );
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (gameState === "playing" && questionIndex < sentencesList.length) {
      const currentSentence = sentencesList[questionIndex].text;
      const isSingleWord = !currentSentence.includes(" ");
      const parts = isSingleWord
        ? currentSentence.split("")
        : currentSentence.split(" ");

      const words = parts.map((word: string, index: number) => ({
        id: `word-${questionIndex}-${index}`,
        text: word,
      }));
      setWordPool(shuffleArray(words));
      setSelectedWords([]);
      setFeedback(null);
    } else if (
      gameState === "playing" &&
      questionIndex >= sentencesList.length
    ) {
      setGameState("ended");
    }
  }, [questionIndex, gameState, sentencesList]);

  // Handle sentence completion check
  useEffect(() => {
    if (gameState !== "playing" || feedback !== null) return;
    if (!sentencesList[questionIndex]) return;

    const targetSentence = sentencesList[questionIndex].text;
    const isSingleWord = !targetSentence.includes(" ");
    const expectedWordCount = isSingleWord
      ? targetSentence.length
      : targetSentence.split(" ").length;

    if (selectedWords.length === expectedWordCount) {
      const formedSentence = selectedWords
        .map((w) => w.text)
        .join(isSingleWord ? "" : " ");

      if (formedSentence === targetSentence) {
        setFeedback("correct");
        setTimeout(() => handleNextTurn(), 1500);
      } else {
        setFeedback("incorrect");
        setSharkAction("roar");
        setTimeout(() => {
          setSharkAction("idle");
          handleNextTurn();
        }, 1800);
      }
    }
  }, [
    selectedWords,
    gameState,
    questionIndex,
    currentPlayer,
    feedback,
    sentencesList,
  ]);

  const handleNextTurn = () => {
    setQuestionIndex((prev) => prev + 1);
    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    setFeedback(null);
    setIsAnswerRevealed(false);
  };

  const startGame = (gameData?: SharkGameData | null) => {
    setActiveGameData(gameData || null);
    if (gameData) {
      setSentencesList(shuffleArray(gameData.sentences));
    } else {
      setSentencesList(shuffleArray(SENTENCES));
    }
    setScores({ 1: 0, 2: 0 });
    setEatenPlayer(null);
    setQuestionIndex(0);
    setCurrentPlayer(1);
    setGameState("playing");
    setIsAnswerRevealed(false);
    setWheelData({
      1: { rotation: 0, isSpinning: false, result: null },
      2: { rotation: 0, isSpinning: false, result: null },
    });
  };

  const selectWord = (word: any) => {
    if (feedback !== null || eatenPlayer !== null) return;
    setSelectedWords([...selectedWords, word]);
    setWordPool(wordPool.filter((w) => w.id !== word.id));
  };

  const deselectWord = (word: any) => {
    if (feedback !== null || eatenPlayer !== null) return;
    setSelectedWords(selectedWords.filter((w) => w.id !== word.id));
    setWordPool([...wordPool, word]);
  };

  const handleSharkClick = () => {
    if (gameState !== "playing" || eatenPlayer !== null) return;
    setSharkAction("roar");
    setEatenPlayer(currentPlayer);
    setTimeout(() => {
      setGameState("ended");
    }, 1500);
  };

  const handleSpinWheel = (player: 1 | 2) => {
    if (wheelData[player].isSpinning) return;

    // Randomize angle and spin
    const randomAngle = Math.floor(Math.random() * 360);
    const extraSpins = 360 * 5; // 5 full spins for visual flair
    const finalRotation = wheelData[player].rotation + extraSpins + randomAngle;

    setWheelData((prev: any) => ({
      ...prev,
      [player]: {
        ...prev[player],
        isSpinning: true,
        result: null,
        rotation: finalRotation,
      },
    }));

    // Wait 4 seconds for CSS transition to finish
    setTimeout(() => {
      // Determine what slice is at the top (0 degrees).
      const offset = (360 - (finalRotation % 360)) % 360;
      const index = Math.floor(offset / 60);
      const result = index % 2 === 0 ? "stay" : "climb";

      setWheelData((prev: any) => ({
        ...prev,
        [player]: { ...prev[player], isSpinning: false, result: result },
      }));

      if (result === "climb") {
        playSound("climb");
        setPlayerAnim((prev) => ({ ...prev, [player]: "climb" }));
        setScores((prev) => {
          const current = prev[player];
          const newScore = current < 6 ? current + 1 : current;
          if (newScore === 6) {
            setSharkAction("roar");
            setTimeout(() => setEatenPlayer(player), 500);
            setTimeout(() => setGameState("ended"), 2000);
          }
          return { ...prev, [player]: newScore };
        });
      } else {
        playSound("stay");
        setShowConfetti(true);
        setPlayerAnim((prev) => ({ ...prev, [player]: "stay" }));
      }

      setTimeout(() => {
        setShowConfetti(false);
        setPlayerAnim({ 1: null, 2: null });
        // Clear result overlay after a short delay
        setWheelData((prev: any) => ({
          ...prev,
          [player]: { ...prev[player], result: null },
        }));
      }, 3000);
    }, 4000);
  };

  const MascotP1 = ({ className, animClass }: any) => (
    <div className={`rounded-full overflow-hidden shadow-xl ring-4 ring-blue-500 bg-white ${className} ${animClass || ""}`}>
      <img src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=300&q=80" alt="Player 1" className="w-full h-full object-cover" />
    </div>
  );

  const MascotP2 = ({ className, animClass }: any) => (
    <div className={`rounded-full overflow-hidden shadow-xl ring-4 ring-pink-500 bg-white ${className} ${animClass || ""}`}>
      <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=300&q=80" alt="Player 2" className="w-full h-full object-cover" />
    </div>
  );

  if (
    gameState === "menu" ||
    gameState === "create" ||
    gameState === "start" ||
    gameState === "ended"
  ) {
    const winner =
      eatenPlayer === 1
        ? 2
        : eatenPlayer === 2
          ? 1
          : scores[1] < scores[2]
            ? 1
            : scores[2] < scores[1]
              ? 2
              : 0;

    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-sky-900 flex flex-col items-center justify-center p-4 font-supercell relative overflow-hidden rounded-3xl">
        {gameState === "ended" && winner !== 0 && !eatenPlayer && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: "10px",
                  height: "20px",
                  backgroundColor: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"][
                    Math.floor(Math.random() * 4)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="max-w-3xl w-full glass-panel rounded-[2.5rem] shadow-2xl p-6 md:p-10 text-center relative z-10 border-4 border-white/50">
          {gameState === "menu" && (
            <>
              <div className="flex justify-center gap-4 mb-6">
                <MascotP1 className="w-20 h-20 animate-float drop-shadow-xl" />
                <MascotP2 className="w-20 h-20 animate-float-delayed drop-shadow-xl" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-6 drop-shadow-sm tracking-tight py-2">
                SHARK LADDER
              </h1>

              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button
                  onClick={() => {
                    if (user) {
                      setCreateStep(1);
                      setGameState("create");
                    } else {
                      alert("You must be logged in to create custom games.");
                    }
                  }}
                  className="w-full bg-gradient-to-b from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-black py-4 px-6 rounded-2xl text-2xl shadow-[0_6px_0_#7e22ce] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-8 h-8 stroke-[3]" /> Create Custom Game
                </button>
              </div>

              {savedGames.length > 0 && (
                <div className="mt-8 text-left border-t-2 border-slate-200 pt-6">
                  <h3 className="font-black text-2xl text-slate-700 mb-4 flex items-center gap-2">
                    <FolderOpen className="w-6 h-6" /> Saved Games
                  </h3>
                  <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
                    {savedGames.map((game) => (
                      <div
                        key={game.id}
                        className="bg-white/80 p-4 rounded-2xl border-2 border-slate-200 flex justify-between items-center hover:border-blue-400 transition-colors"
                      >
                        <div>
                          <h4 className="font-bold text-lg text-slate-800">
                            {game.name}
                          </h4>
                          <p className="text-sm text-slate-500">
                            {game.className} • {game.topic}
                          </p>
                        </div>
                        <button
                          onClick={() => startGame(game)}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-xl shadow-[0_4px_0_#166534] active:shadow-none active:translate-y-[4px] transition-all flex items-center gap-2"
                        >
                          <Play className="w-5 h-5 fill-white" /> Play
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {gameState === "create" && (
            <div className="text-left">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  {createStep === 2 && (
                    <button
                      onClick={() => setCreateStep(1)}
                      className="text-slate-500 hover:text-slate-800 font-bold"
                    >
                      ← Back
                    </button>
                  )}
                  <h2 className="text-3xl font-black text-slate-800">
                    {createStep === 1 ? "Create Game" : "Add Vocabulary"}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    if (onViewChange) {
                      onViewChange("games");
                    } else {
                      setGameState("menu");
                    }
                  }}
                  className="text-slate-500 hover:text-slate-700 font-bold px-4 py-2 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>

              {createStep === 1 ? (
                <>
                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Game Name
                      </label>
                      <input
                        type="text"
                        value={newGameForm.name}
                        onChange={(e) =>
                          setNewGameForm({
                            ...newGameForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800"
                        placeholder="e.g. Unit 4 Vocabulary"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Class
                        </label>
                        <input
                          type="text"
                          value={newGameForm.className}
                          onChange={(e) =>
                            setNewGameForm({
                              ...newGameForm,
                              className: e.target.value,
                            })
                          }
                          className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800"
                          placeholder="e.g. Grade 5"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Topic
                        </label>
                        <input
                          type="text"
                          value={newGameForm.topic}
                          onChange={(e) =>
                            setNewGameForm({
                              ...newGameForm,
                              topic: e.target.value,
                            })
                          }
                          className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800"
                          placeholder="e.g. Science"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (
                        !newGameForm.name ||
                        !newGameForm.className ||
                        !newGameForm.topic
                      ) {
                        alert(
                          "Please fill out Name, Class, and Topic before continuing.",
                        );
                        return;
                      }
                      setCreateStep(2);
                    }}
                    className="w-full bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-black py-4 px-6 rounded-2xl text-xl shadow-[0_6px_0_#1d4ed8] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-2"
                  >
                    Next Step →
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-6 max-h-[40vh] overflow-y-auto pr-2">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-slate-700">
                        Vocabulary & Sentences
                      </h3>
                      <button
                        onClick={addSentenceField}
                        className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg"
                      >
                        <Plus className="w-4 h-4" /> Add Row
                      </button>
                    </div>

                    <div className="space-y-4">
                      {newGameForm.sentences.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 items-start bg-slate-50 p-4 rounded-xl border-2 border-slate-100 relative group"
                        >
                          <div className="bg-blue-100 text-blue-800 font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-blue-200">
                            {idx + 1}
                          </div>
                          <div className="flex-1 space-y-3">
                            <textarea
                              value={s.text}
                              onChange={(e) =>
                                updateSentence(idx, "text", e.target.value)
                              }
                              placeholder="Enter a word (for anagram) or a sentence (for arrange)"
                              className="w-full border-2 border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none resize-none h-20 bg-white font-bold text-slate-800 shadow-sm"
                            />
                          </div>
                          <button
                            onClick={() => removeSentenceField(idx)}
                            className="text-slate-400 hover:text-red-500 p-2 mt-2 shrink-0 bg-white border-2 border-slate-200 rounded-lg hover:border-red-200 hover:bg-red-50 transition-colors"
                            title="Remove row"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveGame}
                    disabled={isSaving}
                    className={`w-full bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-black py-4 px-6 rounded-2xl text-xl shadow-[0_6px_0_#166534] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-2 ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    <Save className="w-6 h-6" />{" "}
                    {isSaving ? "Saving..." : "Save & Close"}
                  </button>
                </>
              )}
            </div>
          )}

          {gameState === "start" && (
            <>
              <div className="flex justify-center gap-4 mb-6">
                <MascotP1 className="w-24 h-24 animate-float drop-shadow-xl" />
                <MascotP2 className="w-24 h-24 animate-float-delayed drop-shadow-xl" />
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-2 drop-shadow-sm tracking-tight py-2">
                SHARK LADDER
              </h1>

              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setGameState("menu")}
                  className="text-slate-500 hover:text-slate-800 font-bold underline"
                >
                  Back to Menu
                </button>
              </div>

              <div className="bg-white/90 text-slate-700 p-6 md:p-8 rounded-3xl mb-8 border-4 border-slate-200 text-left max-h-[40vh] overflow-y-auto shadow-inner w-full text-sm md:text-base">
                <h3 className="font-black text-2xl mb-4 text-slate-800 flex items-center gap-2">
                  <span className="text-3xl">🦈</span> Game Instructions
                </h3>
                <ul className="space-y-3 font-bold">
                  <li className="flex gap-2">
                    <span>•</span> Divide the class into two teams.
                  </li>
                  <li className="flex gap-2">
                    <span>•</span> One student from each team comes to the
                    board.
                  </li>
                  <li className="flex gap-2">
                    <span>•</span> Rearrange the words to build the correct
                    sentence or definition.
                  </li>
                  <li className="flex gap-2">
                    <span>•</span> The teacher checks both teams' answers.
                  </li>
                  <li className="flex gap-2">
                    <span>•</span> If needed, click{" "}
                    <strong className="text-blue-600 bg-blue-100 px-2 rounded">
                      Show Answer
                    </strong>{" "}
                    to reveal the correct sentence.
                  </li>
                  <li className="flex gap-2">
                    <span>•</span> The teacher decides which team loses the
                    round. The losing team must spin the wheel.
                  </li>
                  <li className="flex gap-2">
                    <span>•</span> The wheel has two possible outcomes:
                    <ul className="ml-6 mt-2 space-y-2">
                      <li>
                        🪜{" "}
                        <strong className="text-red-600 uppercase tracking-wide">
                          Climb Down (Lose)
                        </strong>{" "}
                        – Move one step closer to the shark.
                      </li>
                      <li>
                        🛑{" "}
                        <strong className="text-green-500 uppercase tracking-wide">
                          Stay (Safe)
                        </strong>{" "}
                        – Remain on the current step.
                      </li>
                    </ul>
                  </li>
                  <li className="flex gap-2 mt-2">
                    <span>•</span>{" "}
                    <span className="text-red-600">
                      If a team's character falls into the shark and gets eaten,
                      that team loses the game!
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => startGame()}
                className="group relative inline-flex items-center justify-center space-x-3 w-full bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-black py-5 px-10 rounded-full text-3xl transition-all active:scale-95 shadow-[0_8px_0_#166534] hover:shadow-[0_6px_0_#166534] hover:translate-y-[2px] active:shadow-none active:translate-y-[8px]"
              >
                <Play className="w-10 h-10 fill-white" />
                <span className="drop-shadow-md">PLAY NOW</span>
              </button>
            </>
          )}

          {gameState === "ended" && (
            <>
              {eatenPlayer ? (
                <div className="flex flex-col items-center justify-center bg-red-100 text-red-700 font-black p-6 rounded-3xl mb-6 border-4 border-red-400 shadow-lg">
                  <Skull className="w-20 h-20 mb-4 text-red-600 animate-pulse drop-shadow-md" />
                  <span className="text-3xl uppercase tracking-widest">
                    Player {eatenPlayer} was eaten and LOSES!
                  </span>
                </div>
              ) : (
                <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)] animate-bounce" />
              )}

              {!eatenPlayer && (
                <h1 className="text-5xl font-black text-slate-800 mb-6">
                  Game Over!
                </h1>
              )}

              <div className="text-4xl md:text-5xl font-black mb-10 tracking-wide uppercase drop-shadow-md">
                {winner === 1 && (
                  <span className="text-blue-600">Player 1 Wins!</span>
                )}
                {winner === 2 && (
                  <span className="text-pink-600">Player 2 Wins!</span>
                )}
                {winner === 0 && !eatenPlayer && (
                  <span className="text-purple-600">It's a Tie!</span>
                )}
              </div>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setGameState("menu")}
                  className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black py-5 px-6 rounded-full text-xl transition-all active:scale-95 shadow-[0_8px_0_#94a3b8] active:shadow-none active:translate-y-[8px]"
                >
                  MENU
                </button>
                <button
                  onClick={() => startGame(activeGameData)}
                  className="w-2/3 flex items-center justify-center gap-3 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-black py-5 px-10 rounded-full text-2xl transition-all active:scale-95 shadow-[0_8px_0_#166534] hover:shadow-[0_6px_0_#166534] hover:translate-y-[2px] active:shadow-none active:translate-y-[8px]"
                >
                  <RotateCcw className="w-8 h-8" />
                  <span className="drop-shadow-md">PLAY AGAIN</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Positioning logic for characters
  const p1Position =
    eatenPlayer === 1
      ? {
          left: "50%",
          top: "70%",
          transform: "translate(-50%, -50%) scale(0) rotate(180deg)",
        }
      : {
          ...P1_POSITIONS[Math.min(scores[1] || 0, 6)],
          transform: "translate(-50%, -100%) scale(1)",
        };

  const p2Position =
    eatenPlayer === 2
      ? {
          left: "50%",
          top: "70%",
          transform: "translate(-50%, -50%) scale(0) rotate(-180deg)",
        }
      : {
          ...P2_POSITIONS[Math.min(scores[2] || 0, 6)],
          transform: "translate(-50%, -100%) scale(1)",
        };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#0f172a] flex flex-col font-supercell overflow-hidden relative rounded-3xl">
      {/* Top HUD Bar */}
      <div className="w-full bg-white/95 backdrop-blur-md px-2 md:px-4 py-3 flex justify-between items-center shadow-lg z-20 sticky top-0 rounded-b-3xl">
        {/* Player 1 HUD & Spin */}
        <div className="flex items-center gap-1 md:gap-3">
          <div
            className={`flex items-center gap-2 md:gap-3 px-2 py-1 pr-3 md:pr-6 rounded-full transition-all duration-300 ${currentPlayer === 1 ? "bg-blue-100 ring-4 ring-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-105" : "bg-slate-100 opacity-60"}`}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border-2 border-blue-200 flex justify-center items-center">
              <MascotP1 className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div>
              <div className="font-bold text-blue-900 leading-tight text-xs md:text-base">
                Player 1
              </div>
              <div className="font-black text-blue-600 text-[10px] md:text-sm">
                Step: {scores[1]}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleSpinWheel(1)}
            disabled={wheelData[1].isSpinning}
            className={`bg-purple-600 hover:bg-purple-500 text-white font-black text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2 rounded-full shadow-md transition-all flex items-center gap-1 border-b-2 border-purple-800 ${wheelData[1].isSpinning ? "opacity-50 cursor-not-allowed border-b-0 translate-y-[2px]" : "active:scale-95 active:border-b-0"}`}
            title="Spin Wheel for Player 1"
          >
            <span className="text-base md:text-lg">🎡</span>
            <span className="hidden lg:inline">Spin</span>
          </button>
        </div>

        <div className="text-center px-1">
          <div className="font-black text-slate-400 tracking-widest text-[10px] md:text-sm uppercase">
            Round
          </div>
          <div className="text-sm md:text-xl font-bold text-slate-800 bg-slate-100 px-3 md:px-6 py-1 rounded-full shadow-inner">
            {questionIndex + 1} / {sentencesList.length}
          </div>
        </div>

        {/* Player 2 HUD & Spin */}
        <div className="flex items-center gap-1 md:gap-3">
          <button
            onClick={() => handleSpinWheel(2)}
            disabled={wheelData[2].isSpinning}
            className={`bg-purple-600 hover:bg-purple-500 text-white font-black text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2 rounded-full shadow-md transition-all flex items-center gap-1 border-b-2 border-purple-800 ${wheelData[2].isSpinning ? "opacity-50 cursor-not-allowed border-b-0 translate-y-[2px]" : "active:scale-95 active:border-b-0"}`}
            title="Spin Wheel for Player 2"
          >
            <span className="hidden lg:inline">Spin</span>
            <span className="text-base md:text-lg">🎡</span>
          </button>
          <div
            className={`flex items-center gap-2 md:gap-3 px-2 py-1 pl-3 md:pl-6 rounded-full transition-all duration-300 ${currentPlayer === 2 ? "bg-pink-100 ring-4 ring-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.6)] scale-105" : "bg-slate-100 opacity-60 flex-row-reverse"}`}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border-2 border-pink-200 flex justify-center items-center">
              <MascotP2 className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className={currentPlayer === 2 ? "text-left" : "text-right"}>
              <div className="font-bold text-pink-900 leading-tight text-xs md:text-base">
                Player 2
              </div>
              <div className="font-black text-pink-600 text-[10px] md:text-sm">
                Step: {scores[2]}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex-grow relative overflow-hidden flex flex-col justify-end">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center -z-20 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 to-blue-900/80 -z-10 backdrop-blur-[2px]"></div>

        {/* Term Definition Header */}
        <div className="absolute top-4 w-full z-10 flex justify-center pointer-events-none">
          <div className="bg-sky-900/80 backdrop-blur-sm border-2 border-sky-400/50 rounded-3xl px-8 py-3 shadow-2xl text-center">
            <span className="block text-sky-300 text-xl md:text-2xl font-bold uppercase tracking-widest">
              {sentencesList[questionIndex]?.text?.includes(" ")
                ? "Rearrange the Words"
                : "Unscramble the Letters"}
            </span>
          </div>
        </div>

        {/* Main Interactive SVG Area */}
        <div className="relative w-full max-w-5xl mx-auto aspect-[2/1] z-10 mt-16">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full drop-shadow-2xl overflow-visible"
          >
            <rect
              x="0"
              y="300"
              width="1000"
              height="200"
              fill="url(#ocean-grad)"
            />
            <path
              d="M0,300 Q250,290 500,300 T1000,300 L1000,500 L0,500 Z"
              fill="url(#ocean-surface)"
              className="animate-wave"
              opacity="0.6"
            />

            {/* THE SHARK */}
            <g
              transform="translate(500, 380)"
              onClick={handleSharkClick}
              className="cursor-pointer pointer-events-auto"
            >
              <g
                className={
                  sharkAction === "roar"
                    ? "animate-shark-roar"
                    : "hover:scale-[1.02] transition-transform"
                }
                style={{ transformOrigin: "0px -50px" }}
              >
                <foreignObject x="-150" y="-150" width="300" height="300">
                  <div className="w-full h-full rounded-full border-8 border-sky-400 shadow-[0_0_50px_rgba(56,189,248,0.8)] overflow-hidden bg-sky-900 pointer-events-none">
                     <img src="https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=500&q=80" className="w-full h-full object-cover" alt="Shark" />
                  </div>
                </foreignObject>
              </g>
            </g>

            {/* WOODEN STAIRS P1 (Left) */}
            <g>
              {[0, 1, 2, 3, 4, 5].map((step) => {
                const x = 100 + step * 70;
                const y = 120 + step * 40;
                return (
                  <g key={`l-step-${step}`}>
                    <rect
                      x={x - 10}
                      y={y + 20}
                      width="20"
                      height={500 - (y + 20)}
                      fill="#451a03"
                    />
                    <path
                      d={`M${x - 40},${y + 20} L${x + 40},${y + 20} L${x + 40},${y} L${x - 40},${y} Z`}
                      fill="url(#wood-light)"
                      stroke="#451a03"
                      strokeWidth="2"
                    />
                    <path
                      d={`M${x - 40},${y + 20} L${x + 40},${y + 20} L${x + 40},${y + 35} L${x - 40},${y + 35} Z`}
                      fill="url(#wood-main)"
                      stroke="#451a03"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </g>

            {/* WOODEN STAIRS P2 (Right) */}
            <g transform="translate(1000, 0) scale(-1, 1)">
              {[0, 1, 2, 3, 4, 5].map((step) => {
                const x = 100 + step * 70;
                const y = 120 + step * 40;
                return (
                  <g key={`r-step-${step}`}>
                    <rect
                      x={x - 10}
                      y={y + 20}
                      width="20"
                      height={500 - (y + 20)}
                      fill="#451a03"
                    />
                    <path
                      d={`M${x - 40},${y + 20} L${x + 40},${y + 20} L${x + 40},${y} L${x - 40},${y} Z`}
                      fill="url(#wood-light)"
                      stroke="#451a03"
                      strokeWidth="2"
                    />
                    <path
                      d={`M${x - 40},${y + 20} L${x + 40},${y + 20} L${x + 40},${y + 35} L${x - 40},${y + 35} Z`}
                      fill="url(#wood-main)"
                      stroke="#451a03"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </g>

            <defs>
              <linearGradient id="ocean-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient
                id="ocean-surface"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="shark-body" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient
                id="shark-highlight"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor="#cbd5e1" />
                <stop offset="80%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="wood-main" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="wood-light" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>
          </svg>

          {/* Embedded Spin Wheel Player 1 (Left Sky) */}
          <div
            className="absolute z-10 flex flex-col items-center pointer-events-none transition-all"
            style={{
              left: "12%",
              top: "30%",
              transform: "translate(-50%, -50%)",
              width: "18%",
            }}
          >
            {/* Pointer */}
            <div className="w-0 h-0 border-l-[8px] md:border-l-[10px] border-r-[8px] md:border-r-[10px] border-t-[15px] md:border-t-[20px] border-transparent border-t-slate-800 z-20 mb-[-10px] md:mb-[-12px] drop-shadow-md"></div>
            {/* Wheel */}
            <div
              className="w-full aspect-square rounded-full border-4 md:border-[5px] border-blue-900 shadow-xl overflow-hidden wheel-bg pointer-events-auto cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center justify-center relative"
              style={{
                transform: `rotate(${wheelData[1].rotation}deg)`,
                transition: wheelData[1].isSpinning
                  ? "transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)"
                  : "none",
              }}
              onClick={() => handleSpinWheel(1)}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex items-start justify-center pt-2 md:pt-4"
                  style={{ transform: `rotate(${i * 60 + 30}deg)` }}
                >
                  <span className="font-black text-white text-[8px] md:text-[11px] lg:text-xs drop-shadow-md tracking-wider">
                    {i % 2 === 0 ? "STAY" : "CLIMB"}
                  </span>
                </div>
              ))}
              {/* Center Pivot */}
              <div className="absolute w-[15%] aspect-square bg-slate-800 rounded-full border-2 border-slate-600 z-10"></div>
            </div>
            {/* Result Animation Overlay */}
            {wheelData[1].result && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-bounce">
                <div
                  className={`text-4xl md:text-6xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] ${wheelData[1].result === "climb" ? "text-red-400" : "text-green-400"}`}
                >
                  {wheelData[1].result === "climb" ? "⏬" : "🛡️"}
                </div>
              </div>
            )}
          </div>

          {/* Embedded Spin Wheel Player 2 (Right Sky) */}
          <div
            className="absolute z-10 flex flex-col items-center pointer-events-none transition-all"
            style={{
              left: "88%",
              top: "30%",
              transform: "translate(-50%, -50%)",
              width: "18%",
            }}
          >
            {/* Pointer */}
            <div className="w-0 h-0 border-l-[8px] md:border-l-[10px] border-r-[8px] md:border-r-[10px] border-t-[15px] md:border-t-[20px] border-transparent border-t-slate-800 z-20 mb-[-10px] md:mb-[-12px] drop-shadow-md"></div>
            {/* Wheel */}
            <div
              className="w-full aspect-square rounded-full border-4 md:border-[5px] border-pink-900 shadow-xl overflow-hidden wheel-bg pointer-events-auto cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center justify-center relative"
              style={{
                transform: `rotate(${wheelData[2].rotation}deg)`,
                transition: wheelData[2].isSpinning
                  ? "transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)"
                  : "none",
              }}
              onClick={() => handleSpinWheel(2)}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex items-start justify-center pt-2 md:pt-4"
                  style={{ transform: `rotate(${i * 60 + 30}deg)` }}
                >
                  <span className="font-black text-white text-[8px] md:text-[11px] lg:text-xs drop-shadow-md tracking-wider">
                    {i % 2 === 0 ? "STAY" : "CLIMB"}
                  </span>
                </div>
              ))}
              {/* Center Pivot */}
              <div className="absolute w-[15%] aspect-square bg-slate-800 rounded-full border-2 border-slate-600 z-10"></div>
            </div>
            {/* Result Animation Overlay */}
            {wheelData[2].result && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-bounce">
                <div
                  className={`text-4xl md:text-6xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] ${wheelData[2].result === "climb" ? "text-red-400" : "text-green-400"}`}
                >
                  {wheelData[2].result === "climb" ? "⏬" : "🛡️"}
                </div>
              </div>
            )}
          </div>

          {/* Players Overlay */}
          <div
            className={`absolute w-16 h-16 md:w-20 md:h-20 z-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none`}
            style={{
              left: p1Position.left,
              top: p1Position.top,
              transform: p1Position.transform,
              opacity: eatenPlayer === 1 ? 0 : 1,
            }}
          >
            <MascotP1
              className="w-full h-full drop-shadow-[0_10px_5px_rgba(0,0,0,0.4)]"
              animClass={playerAnim[1]}
            />
          </div>

          <div
            className={`absolute w-16 h-16 md:w-20 md:h-20 z-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none`}
            style={{
              left: p2Position.left,
              top: p2Position.top,
              transform: p2Position.transform,
              opacity: eatenPlayer === 2 ? 0 : 1,
            }}
          >
            <MascotP2
              className="w-full h-full drop-shadow-[0_10px_5px_rgba(0,0,0,0.4)]"
              animClass={playerAnim[2]}
            />
          </div>
        </div>
      </div>

      {/* Interactive Building Area */}
      <div className="w-full bg-slate-900/40 backdrop-blur-xl border-t border-white/20 rounded-t-[3rem] p-4 md:p-8 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div
            className={`w-full min-h-[120px] p-6 rounded-3xl bg-white/95 backdrop-blur-sm transition-all duration-300 flex flex-wrap content-start items-center justify-center gap-3 mb-6 relative shadow-[inset_0_-6px_0_rgba(0,0,0,0.05)] ${
              feedback === "correct"
                ? "ring-8 ring-green-400 bg-green-50 scale-105"
                : feedback === "incorrect"
                  ? "ring-8 ring-red-500 bg-red-50 animate-shake-err"
                  : "ring-4 ring-slate-200"
            }`}
          >
            <div className="absolute bottom-4 left-8 right-8 border-b-4 border-dashed border-slate-300 pointer-events-none rounded-full"></div>

            {selectedWords.length === 0 && (
              <span className="text-slate-400 italic text-xl md:text-2xl font-bold select-none z-10">
                Build your answer here...
              </span>
            )}

            {selectedWords.map((word) => (
              <button
                key={word.id}
                onClick={() => deselectWord(word)}
                className={`text-xl md:text-2xl font-black py-3 px-5 rounded-2xl shadow-md transition-transform transform hover:scale-105 active:scale-95 z-10 ${
                  feedback === "correct"
                    ? "bg-green-500 text-white shadow-[0_6px_0_#166534] cursor-default"
                    : feedback === "incorrect"
                      ? "bg-red-500 text-white shadow-[0_6px_0_#991b1b]"
                      : "bg-slate-800 text-white shadow-[0_6px_0_#0f172a] hover:bg-slate-700"
                }`}
              >
                {word.text}
              </button>
            ))}

            {feedback === "correct" && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded-full p-4 shadow-2xl animate-bounce z-30">
                <CheckCircle className="w-20 h-20 text-green-500" />
              </div>
            )}
          </div>

          <div className="w-full flex flex-wrap justify-center gap-4 min-h-[100px]">
            {wordPool.map((word) => (
              <button
                key={word.id}
                onClick={() => selectWord(word)}
                className={`text-xl md:text-2xl font-black bg-white text-slate-800 py-4 px-6 rounded-2xl border-b-[6px] border-slate-300 transition-all active:border-b-0 active:translate-y-[6px] outline-none hover:bg-slate-50 hover:text-blue-600 ${
                  feedback !== null ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {word.text}
              </button>
            ))}
          </div>

          {}
          <div className="mt-8 flex flex-col items-center gap-4 w-full">
            <div className="flex gap-4">
              <button
                onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
                className="text-slate-400 hover:text-white border-2 border-slate-600 hover:border-slate-400 px-6 py-3 rounded-full font-bold transition-all active:scale-95 text-sm uppercase tracking-widest"
              >
                {isAnswerRevealed ? "Hide Answer" : "Show Answer"}
              </button>
            </div>

            {isAnswerRevealed && (
              <div className="w-full max-w-4xl bg-yellow-300 text-yellow-900 border-4 border-yellow-500 px-8 py-5 rounded-3xl font-black text-2xl md:text-3xl shadow-xl animate-pulse text-center leading-tight">
                {sentencesList[questionIndex]?.text}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confetti Particles */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {[...Array(60)].map((_, i) => {
            const color = [
              "#ef4444",
              "#3b82f6",
              "#10b981",
              "#f59e0b",
              "#ec4899",
              "#a855f7",
            ][Math.floor(Math.random() * 6)];
            const left = Math.random() * 100 + "vw";
            const animDuration = Math.random() * 2 + 2 + "s";
            const delay = Math.random() * 0.2 + "s";
            return (
              <div
                key={i}
                className="absolute top-[-10vh] w-4 h-6 animate-fall rounded-sm opacity-90 shadow-sm"
                style={{
                  left,
                  backgroundColor: color,
                  animationDuration: animDuration,
                  animationDelay: delay,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
