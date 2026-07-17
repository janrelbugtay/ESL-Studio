import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# Update randomOutcome usage
old_random_outcome = """        const randomOutcome =
          OUTCOMES[Math.floor(Math.random() * OUTCOMES.length)];"""
          
new_random_outcome = """        const outcomes = getOutcomes();
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];"""

content = content.replace(old_random_outcome, new_random_outcome)

# Add changeDifficulty to toggleSettings
old_toggle_settings = """      const toggleSettings = () => {
        isSettingsOpen = !isSettingsOpen;
        renderApp();
      };
      
      const changeTheme = (newTheme) => {"""
      
new_toggle_settings = """      const toggleSettings = () => {
        isSettingsOpen = !isSettingsOpen;
        renderApp();
      };
      
      const changeDifficulty = (newDiff) => {
        gameDifficulty = newDiff;
        renderApp();
      };
      
      const changeTheme = (newTheme) => {"""

content = content.replace(old_toggle_settings, new_toggle_settings)

# Add to settingsModalHtml
old_settings = """                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-3">Theme</label>"""
                  
new_settings = """                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-3">Difficulty</label>
                  <div class="grid grid-cols-3 gap-2 mb-6">
                    <button onclick="changeDifficulty('normal')" class="p-2 text-center rounded-xl border-[3px] transition-all font-bold text-sm ${gameDifficulty === 'normal' ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-green-300'}">Normal</button>
                    <button onclick="changeDifficulty('medium')" class="p-2 text-center rounded-xl border-[3px] transition-all font-bold text-sm ${gameDifficulty === 'medium' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-orange-300'}">Medium</button>
                    <button onclick="changeDifficulty('difficult')" class="p-2 text-center rounded-xl border-[3px] transition-all font-bold text-sm ${gameDifficulty === 'difficult' ? 'border-red-500 bg-red-50 text-red-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-red-300'}">Difficult</button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-3">Theme</label>"""

content = content.replace(old_settings, new_settings)


# Save gameDifficulty in SAVE_MYSTERY_BOX
old_save = """        const gameData = {
          teams,
          customQuestions,
          topic: gameTopic,
          className: gameClass,
          folder: gameFolder
        };"""
new_save = """        const gameData = {
          teams,
          customQuestions,
          topic: gameTopic,
          className: gameClass,
          folder: gameFolder,
          difficulty: gameDifficulty
        };"""
content = content.replace(old_save, new_save)


# Load gameDifficulty in LOAD_MYSTERY_BOX
old_load = """          gameTopic = gameData.topic || "";
          gameClass = gameData.className || "";
          gameFolder = gameData.folder || "";
          gameTheme = gameData.theme || "royal";"""
new_load = """          gameTopic = gameData.topic || "";
          gameClass = gameData.className || "";
          gameFolder = gameData.folder || "";
          gameTheme = gameData.theme || "royal";
          gameDifficulty = gameData.difficulty || "normal";"""
content = content.replace(old_load, new_load)


with open('public/mystery-box.html', 'w') as f:
    f.write(content)
