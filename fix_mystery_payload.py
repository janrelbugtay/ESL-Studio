import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

payload_old = """      const startGame = () => {
        const gameData = {
          setupTeamCount,
          customQuestions,
          topic: gameTopic,
          className: gameClass,
          folder: gameFolder
        };

        window.parent.postMessage(
          { type: "SAVE_MYSTERY_BOX", data: gameData },
          "*",
        );
      };"""

payload_new = """      const startGame = () => {
        const gameData = {
          setupTeamCount,
          customQuestions,
          topic: gameTopic,
          className: gameClass,
          folder: gameFolder,
          theme: gameTheme
        };

        window.parent.postMessage(
          { type: "SAVE_MYSTERY_BOX", data: gameData },
          "*",
        );
      };"""

content = content.replace(payload_old, payload_new)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
