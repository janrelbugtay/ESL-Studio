with open('public/bubble-sentence.html', 'r') as f:
    content = f.read()

replacements = [
    ('👨‍🏫 Teacher</button>', '👨‍🏫 Game Setup</button>'),
    ('👨‍🏫 Teacher Studio</h2>', '👨‍🏫 Game Setup Lobby</h2>'),
    ('Exit Studio</button>', 'Exit Lobby</button>')
]

for old, new in replacements:
    content = content.replace(old, new)

with open('public/bubble-sentence.html', 'w') as f:
    f.write(content)
