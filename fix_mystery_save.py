import re

with open('src/views/MysteryBox.tsx', 'r') as f:
    content = f.read()

content = content.replace('gameType: "mystery-box",', 'gameType: "mystery-box",\n            theme: gameData.theme,')

with open('src/views/MysteryBox.tsx', 'w') as f:
    f.write(content)
