with open('src/views/BubblePop.tsx', 'a') as f:
    f.write("""

function QuizEditor({ quiz, onSave, onCancel }: { quiz: Quiz, onSave: (q: Quiz) => void, onCancel: () => void }) {
  const [title, setTitle] = useState(quiz.title);
  const [subject, setSubject] = useState(quiz.subject);
  const [topic, setTopic] = useState(quiz.topic || "");
  const [classLevel, setClassLevel] = useState(quiz.classLevel || "");
  const [questions, setQuestions] = useState<Question[]>(quiz.questions);
  const [errorMsg, setErrorMsg] = useState("");

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: '', options: ['', '', '', '', '', ''], answerIndex: 0 }]);
  };

  const updateQuestion = (id: number, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId: number, optIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addOption = (qId: number) => {
    setQuestions(questions.map(q => {
        if (q.id === qId && q.options.length < 6) {
            return { ...q, options: [...q.options, ''] };
        }
        return q;
    }));
  };

  const removeOption = (qId: number) => {
    setQuestions(questions.map(q => {
        if (q.id === qId && q.options.length > 2) {
            const newOptions = [...q.options];
            newOptions.pop();
            // fix answer index if it was pointing to the removed option
            const newAnswerIndex = q.answerIndex >= newOptions.length ? newOptions.length - 1 : q.answerIndex;
            return { ...q, options: newOptions, answerIndex: newAnswerIndex };
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

  return (
    <div className="absolute inset-0 z-40 bg-slate-900 flex flex-col items-center py-8 px-4 overflow-y-auto">
      <div className="w-full max-w-4xl glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl mb-8">
        <div className="bg-slate-800/80 p-6 flex flex-col gap-4 border-b-2 border-blue-500/50">
            <div className="flex justify-between items-start">
                <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-extrabold bg-transparent outline-none border-b-2 border-transparent focus:border-blue-400 uppercase text-white"
                placeholder="QUIZ TITLE"
                />
                <div className="flex gap-2">
                    <button onClick={onCancel} className="px-4 py-2 rounded-xl text-slate-300 font-bold hover:bg-slate-700 transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 cursor-pointer">
                        <Save size={18} /> Save Quiz
                    </button>
                </div>
            </div>
            
            <div className="flex gap-4">
                <input 
                type="text" 
                placeholder="Subject" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-sm font-bold bg-slate-800 border border-slate-700 outline-none text-blue-300 px-4 py-1.5 rounded-lg focus:border-blue-500"
                />
                <input 
                type="text" 
                placeholder="Topic" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-sm font-bold bg-slate-800 border border-slate-700 outline-none text-blue-300 px-4 py-1.5 rounded-lg focus:border-blue-500"
                />
                <input 
                type="text" 
                placeholder="Class" 
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="text-sm font-bold bg-slate-800 border border-slate-700 outline-none text-blue-300 px-4 py-1.5 rounded-lg focus:border-blue-500"
                />
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
                    <input 
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                      placeholder={`Option ${optIndex + 1}`}
                      className={`flex-1 bg-slate-900 border ${q.answerIndex === optIndex ? 'border-blue-500/50 bg-blue-500/10 text-blue-300' : 'border-slate-700 text-slate-300'} rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm font-medium`}
                    />
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
""")
