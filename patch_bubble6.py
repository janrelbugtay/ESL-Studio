import re

with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

# I will find the lobby screen and teacher screen and replace them.
# The lobby screen starts at `{screen === 'lobby' && (` and ends before `{screen === 'editor' && (` Wait, teacher is currently `teacher`.
lobby_pattern = r"\{/\* Screen: Lobby \*/\}(.*?)\{/\* Screen: Setup \*/\}"
lobby_replacement = """{/* Screen: Lobby */}
      {screen === 'lobby' && (
        <div className="absolute inset-0 z-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-slate-900 flex flex-col p-8 overflow-hidden">
            <div className="max-w-6xl w-full mx-auto flex flex-col h-full">
                <div className="flex justify-between items-center mb-8 bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border-b-4 border-blue-500 shadow-xl">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center text-3xl">🧑‍🎓</div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-white mb-1">Bubble Academy Lobby</h1>
                            <p className="text-blue-300 font-medium text-sm">Select a quiz to play or create your own.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="glass-panel rounded-xl px-4 py-2 flex flex-col items-center border-t-2 border-yellow-400">
                            <span className="text-xs text-slate-400 uppercase font-bold">Coins</span>
                            <span className="font-bold text-yellow-400">{playerData.coins}</span>
                        </div>
                        <div className="glass-panel rounded-xl px-4 py-2 flex flex-col items-center border-t-2 border-blue-400">
                            <span className="text-xs text-slate-400 uppercase font-bold">Level</span>
                            <span className="font-bold text-blue-400">{playerData.level}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border-2 border-slate-700 text-white font-bold hover:bg-slate-700 transition-colors shadow-sm cursor-pointer">
                            <BookOpen size={18} /> Subject
                        </button>
                    </div>
                    <button 
                        onClick={() => {
                            setActiveQuiz({ id: Date.now(), title: "New Bubble Quiz", subject: "General", questions: [{ id: Date.now(), text: "", options: ["", "", "", "", "", ""], answerIndex: 0 }], thumbnail: "🫧" });
                            setScreen('editor');
                        }}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 cursor-pointer"
                    >
                        <Plus size={18} /> Create Quiz
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scroll pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-2">
                        {quizzes.map((quiz) => (
                            <div key={quiz.id} className="bg-slate-800/80 rounded-3xl p-6 border-2 border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 group flex flex-col relative overflow-hidden backdrop-blur-md">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border-2 border-blue-400/50 flex items-center justify-center text-3xl shadow-inner relative z-10">
                                        {quiz.thumbnail}
                                    </div>
                                    <div className="flex gap-1 relative z-10 bg-slate-900/80 backdrop-blur rounded-lg p-1 border border-slate-700">
                                        <button className="p-2 text-slate-400 hover:text-pink-500 transition-colors cursor-pointer rounded-md hover:bg-slate-800">
                                            <Heart size={18} fill={quiz.isFavorite ? "currentColor" : "none"} className={quiz.isFavorite ? "text-pink-500" : ""} />
                                        </button>
                                        <button onClick={() => { setActiveQuiz(quiz); setScreen('editor'); }} className="p-2 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer rounded-md hover:bg-slate-800">
                                            <Edit3 size={18} />
                                        </button>
                                        <button onClick={(e) => deleteQuiz(quiz.id, e)} className="p-2 text-slate-400 hover:text-red-400 transition-colors cursor-pointer rounded-md hover:bg-slate-800">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4 flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{quiz.title}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs font-bold px-2 py-1 bg-slate-700 text-slate-300 rounded-md">
                                            {quiz.subject}
                                        </span>
                                        {quiz.topic && (
                                            <span className="text-xs font-bold px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md">
                                                {quiz.topic}
                                            </span>
                                        )}
                                        {quiz.classLevel && (
                                            <span className="text-xs font-bold px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md">
                                                {quiz.classLevel}
                                            </span>
                                        )}
                                        <span className="text-xs font-bold px-2 py-1 bg-slate-700 text-slate-300 rounded-md flex items-center gap-1">
                                            {quiz.questions.length} Qs
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => { setActiveQuiz(quiz); setScreen('setup'); }}
                                    className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer"
                                >
                                    <Play size={18} className="fill-current" /> Play Game
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Screen: Editor */}
      {screen === 'editor' && activeQuiz && (
        <QuizEditor 
          quiz={activeQuiz} 
          onSave={saveQuiz} 
          onCancel={() => setScreen('lobby')} 
        />
      )}

      {/* Screen: Setup */}"""
content = re.sub(lobby_pattern, lobby_replacement, content, flags=re.DOTALL)

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
