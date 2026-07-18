import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

content = content.replace('gameState = "playing";', '''if (gameData.editMode) {
            gameState = "setup";
          } else {
            gameState = "playing";
          }''', 1)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
