import React, { useState, useEffect } from 'react';
import { ViewState } from "../types";
import { FullscreenButton } from "../components/FullscreenButton";
import { ChevronLeft, Plus, Edit3, Trash2, Play, Search, Sparkles, Save, X, BookOpen, Clock, Heart, ArrowLeft, Download, Maximize, Minimize } from 'lucide-react';
import Papa from 'papaparse';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { playSound } from '../lib/audio';

interface Question {
  id: number;
  text: string;
  options: [string, string, string];
  answerIndex: number;
}

interface Quiz {
  id: number;
  title: string;
  subject: string;
  topic?: string;
  classLevel?: string;
  questions: Question[];
  thumbnail: string;
  isFavorite?: boolean;
}

const initialQuizzes: Quiz[] = [
  {
    id: 1,
    title: "Question Tags (Present & Past)",
    subject: "Grammar",
    topic: "Question Tags",
    classLevel: "KET",
    thumbnail: "📝",
    isFavorite: true,
    questions: [
      { id: 1, text: "He is happy, ____?", options: ["is he?", "isn’t he?", "aren’t they?"], answerIndex: 1 },
      { id: 2, text: "They are playing football, ____?", options: ["are they?", "aren’t they?", "isn’t he?"], answerIndex: 1 },
      { id: 3, text: "She can swim well, ____?", options: ["can’t she?", "can she?", "isn’t she?"], answerIndex: 0 },
      { id: 4, text: "Tom likes apples, ____?", options: ["doesn’t he?", "does he?", "aren’t they?"], answerIndex: 0 },
      { id: 5, text: "You are my friend, ____?", options: ["are you?", "aren’t you?", "doesn’t he?"], answerIndex: 1 },
    ]
  },
  {
    id: 2,
    title: "Simple Past Tense",
    subject: "Grammar",
    thumbnail: "🕰️",
    isFavorite: false,
    questions: [
      { id: 1, text: "Yesterday, I ____ to the park.", options: ["go", "goes", "went"], answerIndex: 2 },
      { id: 2, text: "They ____ pizza for dinner.", options: ["eat", "ate", "eated"], answerIndex: 1 },
      { id: 3, text: "She ____ a beautiful song.", options: ["sings", "sang", "sung"], answerIndex: 1 },
    ]
  },
  {
    id: 3,
    title: "Yoga Vocabulary",
    subject: "Vocabulary",
    thumbnail: "🧘‍♀️",
    isFavorite: true,
    questions: [
      { id: 1, text: "What is the English word for sitting cross-legged in yoga?", options: ["Tree Pose", "Downward Dog", "Lotus Pose"], answerIndex: 2 },
      { id: 2, text: "When you breathe in deeply, you...", options: ["Inhale", "Exhale", "Hold"], answerIndex: 0 },
    ]
  }
];

export function YogaQuiz({ onViewChange }: { onViewChange: (view: ViewState) => void }) {
  const [currentView, setCurrentView] = useState<'lobby' | 'editor' | 'game'>('lobby');
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('yogaQuizzes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialQuizzes;
      }
    }
    return initialQuizzes;
  });
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    localStorage.setItem('yogaQuizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  const navigateTo = (view: 'lobby' | 'editor' | 'game', quiz: Quiz | null = null) => {
    setActiveQuiz(quiz);
    setCurrentView(view);
  };

  const saveQuiz = (quiz: Quiz) => {
    setQuizzes(prev => {
      if (prev.find(q => q.id === quiz.id)) {
        return prev.map(q => q.id === quiz.id ? quiz : q);
      } else {
        return [quiz, ...prev];
      }
    });
    navigateTo('lobby');
  };

  const deleteQuiz = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuizzes(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div id="game-container" className="h-[calc(100vh-2rem)] w-full -m-4 md:-m-8 bg-[#ccfbf1] text-slate-900 flex flex-col font-sans overflow-hidden relative selection:bg-teal-500/30 rounded-xl" 
         style={{ margin: '-1rem', height: 'calc(100% + 2rem)', backgroundImage: 'radial-gradient(#99f6e4 2px, transparent 2px)', backgroundSize: '40px 40px' }}>
      
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes popIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes bounce {
            0%, 100% { transform: translateY(0) scale(1.05); }
            50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
      `}</style>

      {/* Top Navbar */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-teal-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => currentView === 'lobby' ? onViewChange("home") : navigateTo('lobby')} className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:bg-teal-700 transition-colors">
            <ChevronLeft size={18} fill="currentColor" />
          </button>
          <span className="font-black text-xl tracking-tight text-teal-900 cursor-pointer hidden sm:block" onClick={() => navigateTo('lobby')}>
            YOGA STUDIO
          </span>
        </div>
        <div className="flex items-center gap-3">
          <FullscreenButton targetId="game-container" />
        </div>

        {currentView === 'lobby' && (
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600/50" size={18} />
            <input 
              type="text" 
              placeholder="Search quizzes..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-teal-50 border border-teal-100 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-sm font-medium text-teal-900 placeholder:text-teal-600/50"
            />
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
           {currentView === 'lobby' && (
            <button 
              onClick={() => navigateTo('editor', { id: Date.now(), title: 'New Yoga Quiz', subject: 'Grammar', thumbnail: '🧘‍♀️', questions: [{ id: Date.now(), text: '', options: ['', '', ''], answerIndex: 0 }] })}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md shadow-teal-200 cursor-pointer"
            >
              <Plus size={18} /> <span className="hidden sm:inline">Create Quiz</span>
            </button>
           )}
           <div className="w-9 h-9 rounded-full bg-teal-100 border-2 border-teal-200 flex items-center justify-center text-teal-700 font-bold overflow-hidden cursor-pointer">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=YogaTeacher" alt="Profile" />
           </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 overflow-hidden flex flex-col">
        {currentView === 'lobby' && <QuizLobby quizzes={quizzes} navigateTo={navigateTo} onDelete={deleteQuiz} />}
        {currentView === 'editor' && <QuizEditor quiz={activeQuiz!} onSave={saveQuiz} onCancel={() => navigateTo('lobby')} />}
        {currentView === 'game' && <YogaGame quiz={activeQuiz!} onBack={() => navigateTo('lobby')} />}
      </main>
    </div>
  );
}

// --- Components ---

function QuizLobby({ quizzes, navigateTo, onDelete }: { quizzes: Quiz[], navigateTo: (view: any, quiz?: any) => void, onDelete: (id: number, e: React.MouseEvent) => void }) {
  return (
    <div className="h-full flex flex-col animate-pop">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 shrink-0 bg-white/60 p-6 rounded-3xl border border-teal-100 shadow-sm backdrop-blur-sm">
        <div>
            <h1 className="text-3xl font-extrabold text-teal-900 mb-1">My Quizzes</h1>
            <p className="text-teal-700 font-medium text-sm">Create and manage your yoga grammar quizzes.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-teal-100 text-teal-700 font-bold hover:bg-teal-50 transition-colors shadow-sm cursor-pointer">
            <BookOpen size={18} /> Subject
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-2">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-3xl p-6 border-2 border-teal-100 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-2xl bg-teal-100 border-2 border-teal-200 flex items-center justify-center text-3xl shadow-inner relative z-10">
                  {quiz.thumbnail}
                </div>
                <div className="flex gap-1 relative z-10 bg-white/80 backdrop-blur rounded-lg p-1 border border-teal-50">
                  <button className="p-2 text-teal-400 hover:text-amber-500 transition-colors cursor-pointer rounded-md hover:bg-amber-50">
                    <Heart size={18} fill={quiz.isFavorite ? "currentColor" : "none"} className={quiz.isFavorite ? "text-amber-500" : ""} />
                  </button>
                  <button onClick={() => navigateTo('editor', quiz)} className="p-2 text-teal-400 hover:text-teal-600 transition-colors cursor-pointer rounded-md hover:bg-teal-50">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={(e) => onDelete(quiz.id, e)} className="p-2 text-teal-400 hover:text-red-500 transition-colors cursor-pointer rounded-md hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mb-6 flex-1">
                <h3 className="text-xl font-bold text-teal-950 leading-tight mb-2 group-hover:text-teal-700 transition-colors">{quiz.title}</h3>
                <div className="flex items-center gap-3 text-sm font-bold text-teal-600/70">
                  <span className="bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-md flex items-center gap-1.5"><Clock size={14}/> {quiz.questions.length} Qs</span>
                  <span className="bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-md">{quiz.subject}</span>
                </div>
              </div>

              <div className="mt-auto">
                <button 
                  onClick={() => navigateTo('game', quiz)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition-all shadow-md shadow-teal-200 cursor-pointer text-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Play size={20} fill="currentColor" /> Play Game
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuizEditor({ quiz, onSave, onCancel }: { quiz: Quiz, onSave: (q: Quiz) => void, onCancel: () => void }) {
  const [title, setTitle] = useState(quiz.title);
  const [subject, setSubject] = useState(quiz.subject);
  const [topic, setTopic] = useState(quiz.topic || "");
  const [classLevel, setClassLevel] = useState(quiz.classLevel || "");
  const [questions, setQuestions] = useState<Question[]>(quiz.questions);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: '', options: ['', '', ''], answerIndex: 0 }]);
  };

  const updateQuestion = (id: number, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId: number, optIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options] as [string, string, string];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const removeQuestion = (id: number) => {
    setQuestions(prev => {
      if (prev.length > 1) {
        return prev.filter(q => q.id !== id);
      }
      return prev;
    });
  };

  const generateWithAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setTitle(title || 'AI Generated Grammar Quiz');
      setQuestions([
        { id: Date.now()+1, text: "The sky is blue, ____?", options: ["isn't it?", "does it?", "aren't they?"], answerIndex: 0 },
        { id: Date.now()+2, text: "You can play the piano, ____?", options: ["can you?", "can't you?", "doesn't he?"], answerIndex: 1 },
        { id: Date.now()+3, text: "She went to the store, ____?", options: ["didn't she?", "doesn't she?", "wasn't she?"], answerIndex: 0 },
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSave = () => {
    if(!title.trim()) {
      setErrorMsg("Please enter a title");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    const validQuestions = questions.filter(q => q.text.trim());
    if(validQuestions.length === 0) {
      setErrorMsg("Please add at least one complete question.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    
    onSave({
      ...quiz,
      title,
      subject,
      topic,
      classLevel,
      questions: validQuestions
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedQuestions: Question[] = [];
        let errorCount = 0;

        results.data.slice(2).forEach((row: any, index) => {
            const values = row as string[];
            
            if (values.length >= 4) {
                const text = values[0] || '';
                const opt1 = values[1] || '';
                const opt2 = values[2] || '';
                const opt3 = values[3] || '';
                let ansIdx = 0;
                
                if (values[4]) {
                    const parsedAns = values[4].toString().trim().toUpperCase();
                    if (parsedAns === 'A') ansIdx = 0;
                    else if (parsedAns === 'B') ansIdx = 1;
                    else if (parsedAns === 'C') ansIdx = 2;
                }

                if (text && opt1) {
                   parsedQuestions.push({
                       id: Date.now() + index,
                       text,
                       options: [opt1, opt2, opt3],
                       answerIndex: ansIdx
                   });
                } else {
                   errorCount++;
                }
            } else {
                errorCount++;
            }
        });

        if (parsedQuestions.length > 0) {
            setQuestions(prev => {
                if (prev.length === 1 && !prev[0].text.trim()) {
                    return parsedQuestions;
                } else {
                    return [...prev, ...parsedQuestions];
                }
            });
            setShowImportModal(false);
            if (errorCount > 0) {
               setErrorMsg(`Imported ${parsedQuestions.length} questions. Skipped ${errorCount} invalid rows.`);
               setTimeout(() => setErrorMsg(""), 4000);
            }
        } else {
            setErrorMsg("Could not find any valid questions in the CSV.");
            setTimeout(() => setErrorMsg(""), 4000);
        }
        
        e.target.value = '';
      },
      error: (error: any) => {
          setErrorMsg(`Error parsing CSV: ${error.message}`);
          setTimeout(() => setErrorMsg(""), 4000);
      }
    });
  };

  const poses = ['🧘‍♀️ Pose A', '🙆‍♀️ Pose B', '🧎‍♀️ Pose C'];

  return (
    <div className="h-full flex flex-col w-full max-w-5xl mx-auto animate-pop bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border-4 border-teal-100 dark:border-teal-900/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 dark:bg-teal-900/20 rounded-bl-full pointer-events-none"></div>
      
      {/* Editor Header */}
      <div className="px-8 py-6 border-b-2 border-teal-50 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-slate-800 relative z-10 shrink-0">
        <div className="flex-1 min-w-[250px]">
            <input 
            type="text" 
            placeholder="Quiz Title (e.g., Present Continuous)" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-black bg-transparent border-none outline-none placeholder:text-teal-200 dark:placeholder:text-teal-700 text-teal-900 dark:text-white w-full mb-2"
            />
            <div className="flex gap-4">
                <input 
                type="text" 
                placeholder="Subject" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-sm font-bold bg-teal-50 dark:bg-slate-700 border-2 border-teal-100 dark:border-slate-600 outline-none placeholder:text-teal-300 dark:placeholder:text-teal-500 text-teal-700 dark:text-teal-200 px-4 py-1.5 rounded-lg focus:border-teal-400 dark:focus:border-teal-500"
                />
                <input 
                type="text" 
                placeholder="Topic" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-sm font-bold bg-teal-50 dark:bg-slate-700 border-2 border-teal-100 dark:border-slate-600 outline-none placeholder:text-teal-300 dark:placeholder:text-teal-500 text-teal-700 dark:text-teal-200 px-4 py-1.5 rounded-lg focus:border-teal-400 dark:focus:border-teal-500"
                />
                <input 
                type="text" 
                placeholder="Class" 
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="text-sm font-bold bg-teal-50 dark:bg-slate-700 border-2 border-teal-100 dark:border-slate-600 outline-none placeholder:text-teal-300 dark:placeholder:text-teal-500 text-teal-700 dark:text-teal-200 px-4 py-1.5 rounded-lg focus:border-teal-400 dark:focus:border-teal-500"
                />
            </div>
        </div>
        <div className="flex gap-3 items-center">
          {errorMsg && <span className="text-red-500 text-sm font-bold mr-2 animate-pop">{errorMsg}</span>}
          <button onClick={onCancel} className="px-5 py-2.5 font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-slate-700 hover:bg-teal-100 dark:hover:bg-slate-600 rounded-xl transition-all cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-200 transition-all cursor-pointer">
            <Save size={18} /> Save Quiz
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-8 py-4 border-b-2 border-teal-50 dark:border-slate-700 flex items-center justify-between bg-white/50 dark:bg-slate-800/50 backdrop-blur shrink-0 relative z-10">
        <p className="text-teal-600 dark:text-teal-400 font-bold text-sm">Add questions and assign options to the 3 yoga poses.</p>
        <div className="flex gap-2">
            <button 
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-slate-700 hover:bg-teal-200 dark:hover:bg-slate-600 rounded-xl transition-all cursor-pointer shadow-sm"
            >
                <Download size={16} /> Import CSV
            </button>
            <button 
            onClick={generateWithAI}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-xl transition-all cursor-pointer shadow-sm"
            >
            <Sparkles size={16} className={isGenerating ? "animate-pulse" : ""} /> 
            {isGenerating ? "Generating..." : "Auto-Generate with AI"}
            </button>
        </div>
      </div>

      {/* Rows Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 bg-teal-50/30 dark:bg-slate-900/50 relative z-10">
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-teal-100 dark:border-slate-700 shadow-sm relative group transition-all hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-md">
              <div className="absolute -left-4 -top-4 w-10 h-10 bg-teal-600 dark:bg-teal-700 text-white font-black rounded-xl flex items-center justify-center shadow-md rotate-[-5deg]">
                {index + 1}
              </div>
              
              <button onClick={() => removeQuestion(q.id)} className="absolute top-4 right-4 p-2 text-teal-300 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={20} />
              </button>

              <div className="mb-6 ml-6 pr-8">
                  <label className="block text-xs font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-2">Question Text</label>
                  <input 
                    type="text" 
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                    placeholder="e.g. He is happy, ____?"
                    className="w-full bg-teal-50/50 dark:bg-slate-900 border-2 border-teal-100 dark:border-slate-600 rounded-xl p-4 outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold text-lg text-teal-900 dark:text-white"
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                  {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className={`p-4 rounded-2xl border-2 transition-all ${q.answerIndex === optIndex ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-500 dark:border-teal-400 shadow-sm' : 'bg-white dark:bg-slate-700 border-teal-100 dark:border-slate-600'}`}>
                          <div className="flex items-center justify-between mb-3">
                              <span className="font-black text-teal-800 dark:text-teal-200 flex items-center gap-2 text-lg">
                                  {poses[optIndex]}
                              </span>
                              <label className="flex items-center cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name={`answer-${q.id}`} 
                                    checked={q.answerIndex === optIndex}
                                    onChange={() => updateQuestion(q.id, 'answerIndex', optIndex)}
                                    className="sr-only"
                                  />
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${q.answerIndex === optIndex ? 'border-teal-600 bg-teal-600' : 'border-teal-300 bg-white'}`}>
                                      {q.answerIndex === optIndex && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                  </div>
                                  <span className={`ml-2 font-bold text-sm ${q.answerIndex === optIndex ? 'text-teal-700' : 'text-teal-400'}`}>Correct</span>
                              </label>
                          </div>
                          <input 
                            type="text" 
                            value={opt}
                            onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                            placeholder={`Option ${optIndex + 1}`}
                            className="w-full bg-white border-2 border-teal-100 rounded-xl p-3 outline-none focus:border-teal-400 transition-all font-medium text-teal-900"
                          />
                      </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addQuestion}
          className="w-full mt-8 py-6 rounded-3xl border-4 border-dashed border-teal-200 text-teal-600 font-black text-xl hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm"
        >
          <Plus size={24} /> Add Another Question
        </button>
      </div>

      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-pop border-4 border-teal-100">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b-2 border-teal-50">
              <h2 className="text-2xl font-black text-teal-900">Import From Spreadsheet</h2>
              <button onClick={() => setShowImportModal(false)} className="text-teal-400 hover:text-teal-600 bg-teal-50 hover:bg-teal-100 p-2 rounded-xl transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            {/* Body */}
            <div className="p-8 bg-teal-50/30">
               <div className="border-4 border-dashed border-teal-200 bg-white p-8 rounded-2xl text-center shadow-sm">
                 <ol className="text-teal-800 font-bold mb-8 text-left space-y-4 text-lg inline-block">
                   <li>1. <a href="https://docs.google.com/spreadsheets/d/1DuJQTg11mWTe1ieNtOOee_Zhjy0djbYk/copy" target="_blank" rel="noreferrer" className="text-teal-500 hover:text-teal-600 underline underline-offset-4 decoration-2">Copy</a> or <a href="https://docs.google.com/spreadsheets/d/1DuJQTg11mWTe1ieNtOOee_Zhjy0djbYk/export?format=csv" className="text-teal-500 hover:text-teal-600 underline underline-offset-4 decoration-2">Download</a> our template.</li>
                   <li>2. Fill it out and export as CSV</li>
                   <li>3. Upload Below</li>
                 </ol>
                 <label className="bg-teal-500 hover:bg-teal-600 text-white font-black py-4 px-10 rounded-2xl cursor-pointer inline-block transition-all shadow-[0_6px_0_#0f766e] hover:translate-y-1 hover:shadow-[0_4px_0_#0f766e] active:translate-y-3 active:shadow-none text-xl w-full">
                   Upload CSV
                   <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                 </label>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function YogaGame({ quiz, onBack }: { quiz: Quiz, onBack: () => void }) {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [teams, setTeams] = useState([
        { id: '1', name: 'Team 1', score: 0, colorIdx: 0 },
        { id: '2', name: 'Team 2', score: 0, colorIdx: 1 }
    ]);

    const teamColors = [
        { bg: 'bg-blue-500', border: 'border-blue-600', borderLight: 'border-blue-200', text: 'text-blue-600' },
        { bg: 'bg-rose-500', border: 'border-rose-600', borderLight: 'border-rose-200', text: 'text-rose-600' },
        { bg: 'bg-green-500', border: 'border-green-600', borderLight: 'border-green-200', text: 'text-green-600' },
        { bg: 'bg-purple-500', border: 'border-purple-600', borderLight: 'border-purple-200', text: 'text-purple-600' },
        { bg: 'bg-orange-500', border: 'border-orange-600', borderLight: 'border-orange-200', text: 'text-orange-600' },
        { bg: 'bg-cyan-500', border: 'border-cyan-600', borderLight: 'border-cyan-200', text: 'text-cyan-600' }
    ];

    const addTeam = () => {
        const newId = Date.now().toString();
        setTeams([...teams, { id: newId, name: `Team ${teams.length + 1}`, score: 0, colorIdx: teams.length % teamColors.length }]);
    };

    const updateTeamScore = (id: string, delta: number) => {
        setTeams(teams.map(t => t.id === id ? { ...t, score: Math.max(0, t.score + delta) } : t));
    };

    const [isAnswering, setIsAnswering] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState<{text: string, isCorrect: boolean, poseIndex: number}[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [timer, setTimer] = useState<number | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const fallbackEmojis = ['🧘‍♀️', '🙆‍♀️', '🧎‍♀️']; // Always correspond to Pose 0, 1, 2

    const startGame = () => {
        setCurrentIdx(0);
        setTeams(teams.map(t => ({ ...t, score: 0 })));
        setGameState('playing');
        loadQuestion(0);
    };

    const loadQuestion = (idx: number) => {
        setIsAnswering(false);
        setSelectedOption(null);
        
        const currentItem = quiz.questions[idx];
        let opts = [
            { text: currentItem.options[0], isCorrect: currentItem.answerIndex === 0, poseIndex: 0 },
            { text: currentItem.options[1], isCorrect: currentItem.answerIndex === 1, poseIndex: 1 },
            { text: currentItem.options[2], isCorrect: currentItem.answerIndex === 2, poseIndex: 2 }
        ];
        
        // Shuffle the rendering order so the correct answer isn't always in the same visual position
        // The pose emoji will stay attached to its original index
        opts.sort(() => Math.random() - 0.5);
        setShuffledOptions(opts);
    };

    const handleAnswer = (index: number, isCorrect: boolean) => {
        if (isAnswering) return;
        setIsAnswering(true);
        setSelectedOption(index);
        
        if (isCorrect) {
            playSound('correct');
            setShowConfetti(true);
        } else {
            playSound('incorrect');
        }

        let timeLeft = 3;
        setTimer(timeLeft);
        
        const countdownInterval = setInterval(() => {
            timeLeft -= 1;
            if (timeLeft > 0) {
                setTimer(timeLeft);
            } else {
                clearInterval(countdownInterval);
                setTimer(null);
                setShowConfetti(false);
                const nextIdx = currentIdx + 1;
                if (nextIdx < quiz.questions.length) {
                    setCurrentIdx(nextIdx);
                    loadQuestion(nextIdx);
                } else {
                    setGameState('end');
                }
            }
        }, 1000);
    };

    return (
      <div className={`flex-1 flex items-center justify-center p-2 md:p-6 mx-auto animate-fade-in ${isFullscreen ? 'fixed inset-0 z-50 bg-teal-50 w-full h-full max-w-none' : 'w-full max-w-[1400px]'}`}>
          {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} style={{ position: 'fixed', zIndex: 100, top: 0, left: 0 }} />}
          
          <div className={`bg-white shadow-2xl w-full overflow-hidden border-8 border-teal-500 relative flex flex-col ${isFullscreen ? 'h-full rounded-none border-0' : 'min-h-[75vh] rounded-[3rem]'}`}>
              
              {timer !== null && (
                  <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/40 backdrop-blur-sm">
                      <div className="text-[12rem] font-black text-teal-500 drop-shadow-2xl animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]">
                          {timer}
                      </div>
                  </div>
              )}
              
              {gameState === 'start' && (
                  <div className="p-4 md:p-8 xl:p-12 text-center flex flex-col items-center justify-center flex-grow overflow-y-auto">
                      <div className="text-[4rem] md:text-[6rem] mb-6 p-4 bg-teal-50 border-4 border-teal-100 shadow-inner rounded-[2rem] w-full max-w-2xl flex justify-around items-center shrink-0">
                          <span>🧘‍♀️</span> <span>🙆‍♀️</span> <span>🧎‍♀️</span>
                      </div>
                      
                      <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-teal-800 mb-4 tracking-tight drop-shadow-sm shrink-0">{quiz.title}</h1>
                      <p className="text-lg md:text-2xl text-teal-600/80 mb-8 font-bold max-w-3xl leading-relaxed shrink-0">
                          Test your knowledge! Choose the correct answer by picking one of the yoga poses.
                      </p>
                      
                      <div className="flex gap-4 w-full max-w-2xl shrink-0 mt-auto md:mt-0 pb-4">
                          <button onClick={onBack} className="bg-teal-100 hover:bg-teal-200 text-teal-700 font-black py-6 px-8 rounded-full text-2xl transition transform hover:scale-105 shadow-[0_8px_0_#99f6e4] hover:translate-y-1 active:shadow-none active:translate-y-3 cursor-pointer shrink-0">
                              <ArrowLeft size={32} />
                          </button>
                          <button onClick={startGame} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-black py-6 px-16 rounded-full text-3xl md:text-4xl transition transform hover:scale-105 shadow-[0_12px_0_#0f766e] hover:shadow-[0_6px_0_#0f766e] hover:translate-y-2 active:shadow-none active:translate-y-4 cursor-pointer">
                              START GAME
                          </button>
                      </div>
                  </div>
              )}

              {gameState === 'playing' && (
                  <div className="flex flex-col h-full flex-grow relative animate-fade-in">
                      {/* Header with progress */}
                      <div className="bg-teal-50 p-4 md:p-8 border-b-8 border-teal-100 flex flex-row justify-between items-start shrink-0 gap-4">
                          {/* Left Teams */}
                          <div className="flex flex-col items-start gap-4 flex-1">
                              {teams.slice(0, Math.ceil(teams.length / 2)).map(team => {
                                  const theme = teamColors[team.colorIdx];
                                  return (
                                      <div key={team.id} className={`flex items-stretch rounded-[3rem] shadow-xl border-[12px] ${theme.border} overflow-hidden shrink-0 transform transition-transform hover:scale-105`}>
                                          <button onClick={() => updateTeamScore(team.id, 1)} className={`px-6 md:px-10 py-4 md:py-6 font-black text-white ${theme.bg} hover:brightness-110 transition-all flex items-center gap-4 md:gap-8 cursor-pointer`}>
                                              <span className="text-3xl md:text-5xl">{team.name}</span>
                                              <span className="bg-white/20 px-6 md:px-8 py-2 md:py-4 rounded-[2rem] text-6xl md:text-8xl drop-shadow-xl leading-none">{team.score}</span>
                                          </button>
                                          <button onClick={() => updateTeamScore(team.id, -1)} className={`px-4 md:px-6 py-2 bg-white hover:bg-gray-100 text-gray-700 transition-colors border-l-[12px] ${theme.borderLight} flex items-center justify-center cursor-pointer`}>
                                              <span className="font-black text-5xl md:text-7xl leading-none opacity-40 hover:opacity-100">-</span>
                                          </button>
                                      </div>
                                  );
                              })}
                          </div>
                          
                          {/* Center Controls */}
                          <div className="flex flex-col items-center gap-6 shrink-0 z-10">
                              <div className="font-bold text-teal-800 bg-teal-200/50 px-8 md:px-12 py-4 md:py-6 rounded-[3rem] shadow-sm border-8 border-teal-200 text-center flex items-center justify-center gap-4">
                                  <span className="text-2xl md:text-4xl">Q <span className="text-5xl md:text-7xl font-black">{currentIdx + 1}</span> / {quiz.questions.length}</span>
                              </div>
                              <div className="flex flex-wrap items-center justify-center gap-4">
                                <button onClick={toggleFullscreen} className="p-4 md:p-6 text-teal-600 hover:bg-teal-200 rounded-[2rem] transition-colors font-bold cursor-pointer bg-teal-100 shadow-sm" title="Fullscreen">
                                    {isFullscreen ? <Minimize size={36} /> : <Maximize size={36} />}
                                </button>
                                <button onClick={onBack} className="px-6 md:px-10 py-4 md:py-6 text-teal-600 hover:bg-teal-200 rounded-[2rem] transition-colors font-black cursor-pointer bg-teal-100 shadow-sm text-2xl uppercase tracking-widest">
                                  Exit
                                </button>
                                <button onClick={addTeam} className="px-6 md:px-10 py-4 md:py-6 text-teal-600 hover:bg-teal-200 rounded-[2rem] transition-colors font-black cursor-pointer bg-teal-100 shadow-sm flex items-center gap-3 text-2xl uppercase tracking-widest">
                                    <Plus size={36} /> Team
                                </button>
                              </div>
                          </div>
                          
                          {/* Right Teams */}
                          <div className="flex flex-col items-end gap-4 flex-1">
                              {teams.slice(Math.ceil(teams.length / 2)).map(team => {
                                  const theme = teamColors[team.colorIdx];
                                  return (
                                      <div key={team.id} className={`flex items-stretch rounded-[3rem] shadow-xl border-[12px] ${theme.border} overflow-hidden shrink-0 transform transition-transform hover:scale-105`}>
                                          <button onClick={() => updateTeamScore(team.id, -1)} className={`px-4 md:px-6 py-2 bg-white hover:bg-gray-100 text-gray-700 transition-colors border-r-[12px] ${theme.borderLight} flex items-center justify-center cursor-pointer`}>
                                              <span className="font-black text-5xl md:text-7xl leading-none opacity-40 hover:opacity-100">-</span>
                                          </button>
                                          <button onClick={() => updateTeamScore(team.id, 1)} className={`px-6 md:px-10 py-4 md:py-6 font-black text-white ${theme.bg} hover:brightness-110 transition-all flex items-center gap-4 md:gap-8 cursor-pointer`}>
                                              <span className="bg-white/20 px-6 md:px-8 py-2 md:py-4 rounded-[2rem] text-6xl md:text-8xl drop-shadow-xl leading-none">{team.score}</span>
                                              <span className="text-3xl md:text-5xl">{team.name}</span>
                                          </button>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      <div className="p-6 md:p-10 xl:p-16 flex-grow flex flex-col justify-center overflow-y-auto bg-white/50">
                          {/* Question */}
                          <div className="text-center mb-10 md:mb-16">
                              <p className="text-teal-500 font-black uppercase tracking-widest text-lg md:text-xl mb-4 md:mb-6">Complete the sentence...</p>
                              <h2 className="text-3xl md:text-5xl xl:text-6xl font-black text-indigo-900 bg-indigo-50 py-10 px-8 md:px-16 rounded-[3rem] border-8 border-indigo-100 shadow-inner inline-block min-w-[60%] max-w-[95%] leading-tight">
                                  {quiz.questions[currentIdx]?.text}
                              </h2>
                          </div>

                          {/* Answer Buttons */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-12 w-full max-w-7xl mx-auto">
                              {shuffledOptions.map((opt, index) => {
                                  let btnClasses = "w-full bg-white border-8 border-gray-100 text-gray-700 font-bold p-6 md:p-8 xl:p-10 rounded-[3rem] transition-all duration-300 flex flex-col items-center text-center shadow-lg relative group outline-none ";
                                  
                                  if (isAnswering) {
                                      if (index === selectedOption) {
                                          if (opt.isCorrect) {
                                              btnClasses += "bg-[#a7f3d0] border-[#059669] text-[#064e3b] scale-105 z-10 shadow-2xl animate-[bounce_0.6s_ease-out_forwards]";
                                          } else {
                                              btnClasses += "bg-[#fecaca] border-[#dc2626] text-[#7f1d1d] animate-[shake_0.5s_ease-out_forwards]";
                                          }
                                      } else if (opt.isCorrect) {
                                          btnClasses += "bg-[#a7f3d0] border-[#059669] text-[#064e3b] scale-105 z-10 shadow-2xl";
                                      } else {
                                          btnClasses += "opacity-60 scale-95";
                                      }
                                  } else {
                                     btnClasses += "hover:border-teal-400 hover:bg-teal-50 hover:shadow-2xl hover:scale-[1.02] cursor-pointer";
                                  }

                                  return (
                                      <button 
                                         key={index}
                                         disabled={isAnswering}
                                         onClick={() => handleAnswer(index, opt.isCorrect)}
                                         className={btnClasses}
                                      >
                                          <div className={`w-full h-32 md:h-48 xl:h-56 rounded-[2rem] overflow-hidden relative bg-teal-50/50 border-4 border-teal-100 mb-4 md:mb-6 shadow-inner transition-transform duration-300 shrink-0 flex items-center justify-center ${!isAnswering ? 'group-hover:scale-[1.05]' : ''}`}>
                                              <span className="text-[5rem] md:text-[7rem] xl:text-[9rem] drop-shadow-sm">{fallbackEmojis[opt.poseIndex]}</span>
                                          </div>
                                          <span className="text-xl md:text-2xl xl:text-3xl font-black text-gray-800 leading-tight w-full flex items-center justify-center break-words pb-2 flex-grow">{opt.text}</span>
                                      </button>
                                  );
                              })}
                          </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-teal-100 h-6 absolute bottom-0 left-0 shrink-0 overflow-hidden">
                          <div className="bg-teal-500 h-full transition-all duration-500 ease-out rounded-r-full" style={{ width: `${(currentIdx / quiz.questions.length) * 100}%` }}></div>
                      </div>
                  </div>
              )}

              {gameState === 'end' && (
                  <div className="p-8 md:p-16 xl:p-24 text-center flex flex-col items-center justify-center flex-grow animate-fade-in">
                      <div className="text-[6rem] md:text-[10rem] mb-10 drop-shadow-2xl animate-bounce">🏆</div>
                      <h1 className="text-6xl md:text-8xl xl:text-9xl font-black text-teal-800 mb-6 drop-shadow-sm">Namaste!</h1>
                      <p className="text-2xl md:text-4xl text-teal-600/80 mb-12 font-bold">You finished the quiz.</p>
                      
                      <div className="bg-indigo-50 border-8 border-indigo-100 rounded-[3rem] p-8 md:p-12 mb-12 w-full max-w-4xl shadow-inner mx-auto relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-100/50 rounded-bl-full pointer-events-none"></div>
                          <p className="text-indigo-400 font-black text-2xl md:text-3xl uppercase tracking-widest mb-6 relative z-10">Final Scores</p>
                          <div className="flex flex-wrap justify-center gap-4 md:gap-6 relative z-10">
                              {[...teams].sort((a,b) => b.score - a.score).map((team, idx) => (
                                  <div key={team.id} className={`flex flex-col items-center bg-white p-4 md:p-6 rounded-2xl shadow-sm border-4 min-w-[120px] md:min-w-[150px] ${idx === 0 ? 'border-yellow-400 scale-110 shadow-lg' : 'border-gray-100'}`}>
                                      {idx === 0 && <span className="text-4xl mb-2 drop-shadow-sm">👑</span>}
                                      <span className={`font-bold text-lg md:text-xl mb-2 text-gray-600`}>{team.name}</span>
                                      <span className={`text-4xl md:text-5xl font-black ${teamColors[team.colorIdx].text}`}>{team.score}</span>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="flex gap-4 w-full max-w-2xl mx-auto">
                          <button onClick={onBack} className="bg-teal-100 hover:bg-teal-200 text-teal-700 font-black py-6 px-8 rounded-full text-2xl transition transform hover:scale-105 shadow-[0_8px_0_#99f6e4] hover:translate-y-1 active:shadow-none active:translate-y-3 cursor-pointer shrink-0">
                              <ArrowLeft size={32} /> Lobby
                          </button>
                          <button onClick={startGame} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-black py-6 md:py-8 px-12 md:px-20 rounded-full text-3xl md:text-5xl transition transform hover:scale-105 shadow-[0_12px_0_#0f766e] hover:shadow-[0_6px_0_#0f766e] hover:translate-y-2 active:shadow-none active:translate-y-4 cursor-pointer">
                              PLAY AGAIN
                          </button>
                      </div>
                  </div>
              )}
          </div>
      </div>
    );
}
