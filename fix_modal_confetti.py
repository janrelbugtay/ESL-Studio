import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

content = content.replace("currentOutcome.type === 'points'", "currentOutcome.id.startsWith('add')")
content = content.replace("currentOutcome.type === 'lose'", "currentOutcome.id.startsWith('sub') || currentOutcome.id.startsWith('minus')")

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
