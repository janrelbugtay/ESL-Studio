import os

content = """import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from "../types";
import { FullscreenButton } from "../components/FullscreenButton";
import { ArrowLeft, Edit3, Trash2, Save, Play, Plus, Sparkles } from "lucide-react";
import { collection, query, where, getDocs, doc, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

type GameScreen = 'editor' | 'setup' | 'loading' | 'game';

interface Sentence {
  id: number | string;
  text: string;
  emoji: string;
  diff: number;
}

interface GameData {
  id: number | string;
  title?: string;
  folderId?: string;
  topic?: string;
  classLevel?: string;
  sentences: Sentence[];
}

export function BubbleSentencePro({ onViewChange, initialGame }: { onViewChange: (view: ViewState) => void, initialGame?: any }) {
  const { user } = useAuth();
  const [screen, setScreen] = useState<GameScreen>(initialGame ? 'setup' : 'editor');
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const [activeGame, setActiveGame] = useState<GameData>(() => {
    if (initialGame) {
      return {
        id: initialGame.id,
        title: initialGame.name || "",
        folderId: initialGame.folderId || "",
        topic: initialGame.topic || "",
        classLevel: initialGame.className || "",
        sentences: initialGame.customSentences || [],
      };
    }
    return {
      id: Date.now(),
      title: "",
      folderId: "",
      topic: "",
      classLevel: "",
      sentences: [{ id: Date.now(), text: "", emoji: "✨", diff: 1 }]
    };
  });

  const saveGame = async (gameData: GameData) => {
    if (!user) {
      alert("You must be logged in to save games.");
      return;
    }

    try {
      const gameToSave = {
        name: gameData.title || "",
        folderId: gameData.folderId || "",
        topic: gameData.topic || "",
        className: gameData.classLevel || "",
        gameType: "bubble-sentence-pro",
        customSentences: gameData.sentences,
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

  const startGame = () => {
    setScreen('game');
    setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'LOAD_GAME',
                data: activeGame
            }, '*');
        }
    }, 500); 
  };

  return (
    <div id="game-container" className="w-full h-full flex flex-col relative bg-slate-50 dark:bg-slate-900 overflow-hidden -mx-4 md:-mx-8 -my-4 md:-my-8">
      
      {screen !== 'game' && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[100px]"></div>
        </div>
      )}

      {screen !== 'game' && (
        <div className="p-6 flex items-center justify-between z-10 relative">
            <button 
                onClick={() => onViewChange('games')}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
                <ArrowLeft size={20} /> Back
            </button>
        </div>
      )}

      {screen === 'editor' && (
        <GameEditor 
          game={activeGame} 
          onSave={saveGame} 
          onCancel={() => onViewChange('games')} 
          folders={folders}
        />
      )}

      {screen === 'setup' && (
        <div className="absolute inset-0 z-40 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8">
            <h2 className="text-5xl font-black mb-12 drop-shadow-lg text-slate-800 dark:text-white">Bubble Island</h2>
            <div className="flex gap-8 max-w-2xl w-full">
                <button onClick={startGame} className="flex-1 glass-panel bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-3xl p-10 flex flex-col items-center border-t-4 border-blue-400 transition-transform hover:scale-105 cursor-pointer text-slate-800 dark:text-white shadow-xl">
                    <div className="text-6xl mb-6 bg-blue-500 w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.6)]">🎮</div>
                    <h3 className="text-3xl font-bold mb-2">Play Game</h3>
                    <p className="text-slate-500 text-center">Start popping bubbles!</p>
                </button>
            </div>
            <div className="flex gap-4 mt-12">
              <button onClick={() => onViewChange('games')} className="px-8 py-3 rounded-full bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-xl font-bold text-slate-800 dark:text-white cursor-pointer transition-colors">Back to Games</button>
              {initialGame && (
                <button onClick={() => setScreen('editor')} className="px-8 py-3 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer transition-colors">
                  <Edit3 size={18} className="inline mr-2" /> Edit Game
                </button>
              )}
            </div>
        </div>
      )}

      {screen === 'game' && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
            <div className="p-4 bg-white border-b flex items-center shadow-sm z-10 shrink-0">
                <button
                    onClick={() => setScreen('setup')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Exit Game
                </button>
                <h1 className="ml-4 font-black text-xl text-slate-800">
                    Bubble Island
                </h1>
                <div className="ml-auto flex items-center"><FullscreenButton targetId="game-container" /></div>
            </div>
            <iframe
                ref={iframeRef}
                src="/bubble-sentence.html"
                className="w-full flex-1 border-none"
                title="Bubble Island"
                onLoad={() => {
                  if (iframeRef.current?.contentWindow) {
                      iframeRef.current.contentWindow.postMessage({
                          type: 'LOAD_GAME',
                          data: activeGame
                      }, '*');
                  }
                }}
            />
        </div>
      )}
    </div>
  );
}

function GameEditor({ game, onSave, onCancel, folders }: { game: GameData, onSave: (g: GameData) => void, onCancel: () => void, folders: { id: string; name: string }[] }) {
  const [folderId, setFolderId] = useState(game.folderId || "");
  const [topic, setTopic] = useState(game.topic || "");
  const [classLevel, setClassLevel] = useState(game.classLevel || "");
  const [sentences, setSentences] = useState<Sentence[]>(game.sentences);
  const [errorMsg, setErrorMsg] = useState("");

  const addSentence = () => {
    setSentences([...sentences, { id: Date.now(), text: '', emoji: '✨', diff: 1 }]);
  };

  const updateSentence = (id: number | string, field: keyof Sentence, value: any) => {
    setSentences(sentences.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSentence = (id: number | string) => {
    setSentences(prev => {
      if (prev.length > 1) {
        return prev.filter(s => s.id !== id);
      }
      return prev;
    });
  };

  const handleSave = () => {
    const generatedTitle = "Bubble Island Game";

    const validSentences = sentences.filter(s => s.text.trim());
    if(validSentences.length === 0) {
      setErrorMsg("Please add at least one complete sentence.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    
    onSave({
      ...game,
      title: generatedTitle,
      folderId,
      topic,
      classLevel,
      sentences: validSentences
    });
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-50 dark:bg-slate-900 overflow-y-auto custom-scrollbar pt-20">
      <div className="w-full min-h-full flex flex-col items-center pb-8 px-4">
      <div className="w-full max-w-4xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col shadow-2xl mb-8 border border-white/20 dark:border-white/10">
        <div className="bg-white dark:bg-slate-800 p-8 flex flex-col gap-6 border-b-2 border-cyan-500/50">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-wide">GAME SETUP</h2>
                <div className="flex gap-3 items-center">
                    <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 cursor-pointer">
                        <Save size={18} /> Save Game
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
                      className="w-full text-sm font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-white px-4 py-3 rounded-xl focus:border-blue-500 placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Class Level</label>
                    <input 
                      type="text" 
                      placeholder="e.g. KET, Starters" 
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      className="w-full text-sm font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-white px-4 py-3 rounded-xl focus:border-blue-500 placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Folder</label>
                    <select 
                      value={folderId}
                      onChange={(e) => setFolderId(e.target.value)}
                      className="w-full text-sm font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-white px-4 py-3 rounded-xl focus:border-blue-500 appearance-none cursor-pointer transition-colors"
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

        <div className="p-6 flex flex-col gap-6 bg-slate-100 dark:bg-slate-900/50">
          {sentences.map((s, index) => (
            <div key={s.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-300 dark:border-slate-700 shadow-sm relative group">
              <button 
                onClick={() => removeSentence(s.id)}
                className="absolute -right-3 -top-3 w-8 h-8 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white border-2 border-white dark:border-slate-800 cursor-pointer z-10"
              >
                <Trash2 size={14} />
              </button>
              
              <div className="flex gap-4 mb-4 items-start">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-500 font-bold flex items-center justify-center shrink-0 border border-cyan-500/30">
                  {index + 1}
                </div>
                <input 
                  type="text"
                  value={s.text}
                  onChange={(e) => updateSentence(s.id, 'text', e.target.value)}
                  placeholder="Type your sentence here..."
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 text-slate-800 dark:text-white font-medium"
                />
              </div>

              <div className="ml-12 flex gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Emoji:</label>
                    <input 
                        type="text"
                        value={s.emoji}
                        onChange={(e) => updateSentence(s.id, 'emoji', e.target.value)}
                        className="w-16 text-center bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-2 outline-none focus:border-cyan-500 text-2xl"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Difficulty (1-5):</label>
                    <input 
                        type="number"
                        min="1"
                        max="5"
                        value={s.diff}
                        onChange={(e) => updateSentence(s.id, 'diff', parseInt(e.target.value) || 1)}
                        className="w-16 text-center bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-2 outline-none focus:border-cyan-500 font-bold"
                    />
                  </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={addSentence}
            className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={20} /> Add Another Sentence
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
"""

with open('src/views/BubbleSentencePro.tsx', 'w') as f:
    f.write(content)
