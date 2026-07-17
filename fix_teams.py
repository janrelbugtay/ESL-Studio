import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# Replace setupTeamCount with teams initialization
content = content.replace('let setupTeamCount = 2;', '')
content = content.replace('let teams = [];', 'let teams = [\n        { id: 0, name: "Team 1", score: 0 },\n        { id: 1, name: "Team 2", score: 0 }\n      ];')

# Add addTeam and removeTeam functions
funcs = """      const addTeam = () => {
        teams.push({ id: teams.length, name: `Team ${teams.length + 1}`, score: 0 });
        renderApp();
      };

      const removeTeam = (index) => {
        if (teams.length > 2) {
          teams.splice(index, 1);
          teams.forEach((t, i) => (t.id = i));
          renderApp();
        }
      };

      const toggleSettings = () => {"""
content = content.replace('      const toggleSettings = () => {', funcs)

# Update startGame
old_start_game = """      const startGame = () => {
        playSound("click", isMuted);
        
        const gameData = {
          setupTeamCount,
          customQuestions,
          topic: gameTopic,
          className: gameClass,
          folder: gameFolder
        };"""

new_start_game = """      const startGame = () => {
        playSound("click", isMuted);
        
        const gameData = {
          teams,
          customQuestions,
          topic: gameTopic,
          className: gameClass,
          folder: gameFolder
        };"""
content = content.replace(old_start_game, new_start_game)


# Replace teamButtons with teamsHtml
old_render_setup = """      const renderSetupScreen = () => {
        let teamButtons = [2, 3, 4]
          .map(
            (num) => `
        <button 
          onclick="playSound('click', isMuted); setupTeamCount = ${num}; renderApp();"
          class="w-32 py-4 rounded-xl font-bold text-xl transition-all duration-300 ${
            setupTeamCount === num
              ? "bg-blue-500 text-white shadow-md border-2 border-blue-600"
              : "bg-slate-100 text-slate-500 border-2 border-slate-200 hover:bg-slate-200"
          }"
        >
          ${num} Teams
        </button>
      `,
          )
          .join("");

        let questionsHtml = customQuestions"""

new_render_setup = """      const renderSetupScreen = () => {
        let teamsHtml = teams
          .map(
            (t, idx) => `
          <div class="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl focus-within:border-blue-400">
            <div class="font-bold text-slate-400 w-6">${idx + 1}</div>
            <input 
              type="text" 
              value="${t.name.replace(/"/g, "&quot;")}" 
              oninput="teams[${idx}].name = this.value" 
              class="flex-1 bg-transparent outline-none font-medium text-slate-700" 
              placeholder="Team Name"
            />
            ${teams.length > 2 ? `<button onclick="removeTeam(${idx})" class="text-red-400 hover:text-red-600 transition-colors"><i data-lucide="trash-2" class="w-5 h-5"></i></button>` : ''}
          </div>
        `
          )
          .join("");

        let questionsHtml = customQuestions"""
content = content.replace(old_render_setup, new_render_setup)

# Inject teamsHtml into setup UI
old_setup_ui = """            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <h2 class="text-2xl font-bold mb-6 text-slate-700">1. Game Details</h2>"""
              
new_setup_ui = """            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <h2 class="text-2xl font-bold mb-6 text-slate-700">1. Game Details</h2>"""
# wait, we will just add it before Game Details or after Game Details? "1. Teams", "2. Game Details"
# Let's add it between Game Details and Auto-Generate Questions

old_auto_gen = """            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <h2 class="text-2xl font-bold mb-6 text-slate-700">2. Auto-Generate Questions</h2>"""

new_auto_gen = """            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-700">2. Teams</h2>
                <button onclick="addTeam()" class="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-bold text-sm transition-colors">
                  <i data-lucide="plus" class="w-4 h-4"></i> Add Team
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${teamsHtml}
              </div>
            </div>

            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <h2 class="text-2xl font-bold mb-6 text-slate-700">3. Auto-Generate Questions</h2>"""

content = content.replace(old_auto_gen, new_auto_gen)
content = content.replace('3. Questions List (A-Z)', '4. Questions List (A-Z)')

# Update LOAD_MYSTERY_BOX
old_load = """        if (event.data?.type === "LOAD_MYSTERY_BOX") {
          const gameData = event.data.data;
          
          setupTeamCount = gameData.setupTeamCount || 2;
          gameTopic = gameData.topic || "";
          gameClass = gameData.className || "";
          gameFolder = gameData.folder || "";
          gameTheme = gameData.theme || "royal";

          customQuestions = gameData.customQuestions || customQuestions;
          teams = Array.from({ length: setupTeamCount }, (_, i) => ({
            id: i,
            name: `Team ${i + 1}`,
            score: 0,
          }));"""
          
new_load = """        if (event.data?.type === "LOAD_MYSTERY_BOX") {
          const gameData = event.data.data;
          
          gameTopic = gameData.topic || "";
          gameClass = gameData.className || "";
          gameFolder = gameData.folder || "";
          gameTheme = gameData.theme || "royal";

          customQuestions = gameData.customQuestions || customQuestions;
          
          if (gameData.teams && gameData.teams.length > 0) {
            teams = gameData.teams.map((t, idx) => ({ ...t, id: idx, score: 0 }));
          } else {
            const count = gameData.setupTeamCount || 2;
            teams = Array.from({ length: count }, (_, i) => ({
              id: i,
              name: `Team ${i + 1}`,
              score: 0,
            }));
          }"""

content = content.replace(old_load, new_load)


with open('public/mystery-box.html', 'w') as f:
    f.write(content)
