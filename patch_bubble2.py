import re

with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

# Add quizzes state
state_pattern = r"const \[playerData, setPlayerData\] = useState<PlayerData>\(\{(.*?)\}\);"
state_replacement = """const [playerData, setPlayerData] = useState<PlayerData>({\\1});
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('bubbleQuizzes');
    try {
        return saved ? JSON.parse(saved) : initialQuizzes;
    } catch {
        return initialQuizzes;
    }
  });
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    localStorage.setItem('bubbleQuizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  const saveQuiz = (quiz: Quiz) => {
    setQuizzes(prev => {
      if (prev.find(q => q.id === quiz.id)) {
        return prev.map(q => q.id === quiz.id ? quiz : q);
      } else {
        return [quiz, ...prev];
      }
    });
    setScreen('lobby');
  };

  const deleteQuiz = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuizzes(prev => prev.filter(q => q.id !== id));
  };
"""
content = re.sub(state_pattern, state_replacement, content, flags=re.DOTALL)

# Update gameState questions array
gs_pattern = r"questions: \[\] as typeof questionBank"
gs_replacement = r"questions: [] as Question[]"
content = re.sub(gs_pattern, gs_replacement, content)

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
