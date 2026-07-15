import re

with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

sg_pattern = r"gameState\.current\.questions = \[\.\.\.questionBank\]\.sort\(\(\) => Math\.random\(\) - 0\.5\);"
sg_replacement = """if (!activeQuiz) return;
    gameState.current.questions = [...activeQuiz.questions].sort(() => Math.random() - 0.5);"""

content = re.sub(sg_pattern, sg_replacement, content)

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
