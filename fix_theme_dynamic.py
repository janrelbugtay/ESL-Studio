import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# Remove theme from setup screen
setup_theme_old = """                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-2">Theme</label>
                  <div class="relative">
                    <select onchange="gameTheme = this.value" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none font-medium text-slate-700 appearance-none cursor-pointer">
                      <option value="royal" ${gameTheme === "royal" ? "selected" : ""}>👑 Royal Treasury</option>
                      <option value="space" ${gameTheme === "space" ? "selected" : ""}>🚀 Cosmic Hamster</option>
                      <option value="jungle" ${gameTheme === "jungle" ? "selected" : ""}>🌴 Jungle Explorer</option>
                      <option value="ocean" ${gameTheme === "ocean" ? "selected" : ""}>🌊 Ocean Diver</option>
                    </select>
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <i data-lucide="chevron-down" class="w-5 h-5"></i>
                    </div>
                  </div>
                </div>"""

# Replace grid with 3 cols instead of 4 in setup
content = content.replace('grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', 'grid-cols-1 md:grid-cols-3 gap-6')
content = content.replace(setup_theme_old, '')

# Add theme switcher to the game header
header_buttons_old = """            <div class="flex items-center gap-3">
              <button onclick="toggleMute()" class="p-3 bg-white/10 text-white hover:bg-white hover:text-slate-800 rounded-xl shadow-md transition-colors" title="${isMuted ? "Unmute sounds" : "Mute sounds"}">"""

header_buttons_new = """            <div class="flex items-center gap-3">
              <div class="relative group">
                <button class="p-3 bg-white/10 text-white hover:bg-white hover:text-slate-800 rounded-xl shadow-md transition-colors flex items-center gap-2" title="Change Theme">
                  <i data-lucide="palette" class="w-6 h-6"></i>
                </button>
                <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  <div class="py-1 flex flex-col">
                    <button onclick="changeTheme('royal')" class="px-4 py-3 text-left hover:bg-slate-50 font-bold ${gameTheme === 'royal' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}">👑 Royal Treasury</button>
                    <button onclick="changeTheme('space')" class="px-4 py-3 text-left hover:bg-slate-50 font-bold ${gameTheme === 'space' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}">🚀 Cosmic Hamster</button>
                    <button onclick="changeTheme('jungle')" class="px-4 py-3 text-left hover:bg-slate-50 font-bold ${gameTheme === 'jungle' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}">🌴 Jungle Explorer</button>
                    <button onclick="changeTheme('ocean')" class="px-4 py-3 text-left hover:bg-slate-50 font-bold ${gameTheme === 'ocean' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}">🌊 Ocean Diver</button>
                  </div>
                </div>
              </div>
              <button onclick="toggleMute()" class="p-3 bg-white/10 text-white hover:bg-white hover:text-slate-800 rounded-xl shadow-md transition-colors" title="${isMuted ? "Unmute sounds" : "Mute sounds"}">"""

content = content.replace(header_buttons_old, header_buttons_new)

# Add changeTheme function
change_theme_fn = """      const changeTheme = (newTheme) => {
        gameTheme = newTheme;
        renderApp();
      };
      
      const startGame = () => {"""

content = content.replace('      const startGame = () => {', change_theme_fn)


with open('public/mystery-box.html', 'w') as f:
    f.write(content)
