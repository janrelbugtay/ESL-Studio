import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

load_old = """          gameTopic = gameData.topic || "";
          gameClass = gameData.className || "";
          gameFolder = gameData.folder || "";"""

load_new = """          gameTopic = gameData.topic || "";
          gameClass = gameData.className || "";
          gameFolder = gameData.folder || "";
          gameTheme = gameData.theme || "royal";"""

content = content.replace(load_old, load_new)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
