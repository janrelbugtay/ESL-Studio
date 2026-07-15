import re

with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

content = content.replace("q.question", "q.text")
content = content.replace("q.correctIndex", "q.answerIndex")

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
