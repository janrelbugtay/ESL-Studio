import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# 1. Add global variables
vars_str = """
      let gameTopic = "";
      let gameClass = "";
      let gameFolder = "";
"""
content = re.sub(r'let setupTeamCount = 2;', 'let setupTeamCount = 2;' + vars_str, content)

# 2. Update load logic
load_logic = """
          setupTeamCount = gameData.setupTeamCount || 2;
          gameTopic = gameData.topic || "";
          gameClass = gameData.className || "";
          gameFolder = gameData.folder || "";
"""
content = re.sub(r'setupTeamCount = gameData\.setupTeamCount \|\| 2;', load_logic, content)

# 3. Update start game
start_game = """
        const gameData = {
          setupTeamCount,
          customQuestions,
          topic: gameTopic,
          className: gameClass,
          folder: gameFolder
        };
"""
content = re.sub(r'const gameData = \{\s*setupTeamCount,\s*customQuestions,\s*\};', start_game, content)

# 4. Replace Number of Teams UI
teams_ui = r'<div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">\s*<h2 class="text-2xl font-bold mb-6 text-slate-700">1\. Number of Teams</h2>\s*<div class="flex gap-4">\$\{teamButtons\}</div>\s*</div>'

details_ui = """
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <h2 class="text-2xl font-bold mb-6 text-slate-700">1. Game Details</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-2">Topic</label>
                  <input type="text" oninput="gameTopic = this.value" value="${gameTopic}" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none font-medium text-slate-700" placeholder="e.g. Present Simple" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-2">Class</label>
                  <input type="text" oninput="gameClass = this.value" value="${gameClass}" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none font-medium text-slate-700" placeholder="e.g. Grade 3" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-2">Folder</label>
                  <input type="text" oninput="gameFolder = this.value" value="${gameFolder}" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none font-medium text-slate-700" placeholder="e.g. Grammar" />
                </div>
              </div>
            </div>
"""

content = re.sub(teams_ui, details_ui, content)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
