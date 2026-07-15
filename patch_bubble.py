import re

with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

# Replace imports
content = re.sub(
    r"import \{ ArrowLeft \} from \"lucide-react\";",
    'import { ArrowLeft, Edit3, Trash2, Heart, Plus, Sparkles, BookOpen, Search, Save, X, Play } from "lucide-react";',
    content
)

# Replace GameScreen
content = re.sub(
    r"type GameScreen = 'intro' \| 'lobby' \| 'teacher' \| 'setup' \| 'loading' \| 'game' \| 'results';",
    "type GameScreen = 'intro' | 'lobby' | 'editor' | 'setup' | 'loading' | 'game' | 'results';",
    content
)

# Replace questionBank with interface Question and initialQuizzes
pattern_qb = r"const questionBank = \[.*?\];"
replacement_qb = """interface Question {
  id: number;
  text: string;
  options: string[];
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
    title: "Modal Verbs",
    subject: "Grammar",
    topic: "Modals",
    classLevel: "KET",
    thumbnail: "🫧",
    isFavorite: true,
    questions: [
      { id: 1, text: "No swimming here. You ______ swim in this lake.", options: modalOptions, answerIndex: 0 },
      { id: 2, text: "Free drinks for children. Children ______ get a free drink.", options: modalOptions, answerIndex: 1 },
      { id: 3, text: "Please arrive before 9 a.m. You ______ arrive before 9 a.m.", options: modalOptions, answerIndex: 2 },
      { id: 4, text: "Advice from the doctor: eat more vegetables. You ______ eat more vegetables.", options: modalOptions, answerIndex: 4 },
      { id: 5, text: "Tickets available online. You ______ buy tickets online.", options: modalOptions, answerIndex: 1 }
    ]
  }
];"""
content = re.sub(pattern_qb, replacement_qb, content, flags=re.DOTALL)

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
