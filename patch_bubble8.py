import re

with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

content = content.replace("questions: [...questionBank].sort(() => 0.5 - Math.random()).slice(0, 5)", 
"""questions: activeQuiz ? [...activeQuiz.questions].sort(() => 0.5 - Math.random()).slice(0, Math.min(5, activeQuiz.questions.length)) : []""")

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
