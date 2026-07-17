import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# Add isSettingsOpen
content = content.replace('let activeBox = null;', 'let activeBox = null;\n      let isSettingsOpen = false;')

# Add toggleSettings function
toggle_settings_fn = """      const toggleSettings = () => {
        isSettingsOpen = !isSettingsOpen;
        renderApp();
      };
      
      const changeTheme = (newTheme) => {"""
content = content.replace('      const changeTheme = (newTheme) => {', toggle_settings_fn)


# Replace header buttons
header_buttons_old = """            <div class="flex items-center gap-3">
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
              <button onclick="toggleMute()" class="p-3 bg-white/10 text-white hover:bg-white hover:text-slate-800 rounded-xl shadow-md transition-colors" title="${isMuted ? "Unmute sounds" : "Mute sounds"}">
                ${isMuted ? `<i data-lucide="volume-x" class="w-6 h-6"></i>` : `<i data-lucide="volume-2" class="w-6 h-6"></i>`}
              </button>
              <button onclick="resetGame()" class="p-3 bg-white/10 text-white hover:bg-red-500 hover:text-white rounded-xl shadow-md transition-colors" title="Reset Scores">
                <i data-lucide="refresh-cw" class="w-6 h-6"></i>
              </button>
              <button onclick="returnToSetup()" class="flex items-center gap-2 px-5 py-3 bg-white text-slate-900 hover:bg-slate-200 rounded-xl shadow-md transition-colors font-bold">
                <i data-lucide="settings" class="w-5 h-5"></i> Setup
              </button>
            </div>"""

header_buttons_new = """            <div class="flex items-center gap-3">
              <button onclick="resetGame()" class="p-3 bg-white/10 text-white hover:bg-red-500 hover:text-white rounded-xl shadow-md transition-colors" title="Reset Scores">
                <i data-lucide="refresh-cw" class="w-6 h-6"></i>
              </button>
              <button onclick="toggleSettings()" class="flex items-center gap-2 px-5 py-3 bg-white text-slate-900 hover:bg-slate-200 rounded-xl shadow-md transition-colors font-bold">
                <i data-lucide="settings" class="w-5 h-5"></i> Settings
              </button>
            </div>"""

content = content.replace(header_buttons_old, header_buttons_new)

# Add settings modal
settings_modal_html = """
        let settingsModalHtml = "";
        if (isSettingsOpen) {
          settingsModalHtml = `
          <div class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border-[6px] border-indigo-100">
              <h2 class="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <i data-lucide="settings" class="w-8 h-8 text-indigo-500"></i> Settings
              </h2>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-3">Theme</label>
                  <div class="grid grid-cols-2 gap-3">
                    <button onclick="changeTheme('royal')" class="p-3 text-left rounded-xl border-[3px] transition-all font-bold ${gameTheme === 'royal' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}">👑 Royal Treasury</button>
                    <button onclick="changeTheme('space')" class="p-3 text-left rounded-xl border-[3px] transition-all font-bold ${gameTheme === 'space' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}">🚀 Cosmic</button>
                    <button onclick="changeTheme('jungle')" class="p-3 text-left rounded-xl border-[3px] transition-all font-bold ${gameTheme === 'jungle' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}">🌴 Jungle</button>
                    <button onclick="changeTheme('ocean')" class="p-3 text-left rounded-xl border-[3px] transition-all font-bold ${gameTheme === 'ocean' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}">🌊 Ocean</button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-3">Audio</label>
                  <button onclick="toggleMute()" class="w-full p-4 text-left rounded-xl border-[3px] transition-all font-bold flex items-center justify-between ${!isMuted ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' : 'border-slate-200 text-slate-500'}">
                    <span class="flex items-center gap-2">
                      ${!isMuted ? '<i data-lucide="volume-2" class="w-6 h-6"></i> Sound Enabled' : '<i data-lucide="volume-x" class="w-6 h-6"></i> Sound Muted'}
                    </span>
                    <div class="w-14 h-8 rounded-full transition-colors relative ${!isMuted ? 'bg-green-500' : 'bg-slate-300'}">
                      <div class="absolute top-1 bottom-1 w-6 bg-white rounded-full transition-all ${!isMuted ? 'left-7' : 'left-1'}"></div>
                    </div>
                  </button>
                </div>
              </div>

              <button onclick="toggleSettings()" class="mt-8 w-full py-4 bg-slate-800 text-white rounded-xl font-black text-xl hover:bg-slate-700 transition-colors shadow-lg active:scale-95">
                Done
              </button>
              
              <button onclick="toggleSettings()" class="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                <i data-lucide="x" class="w-6 h-6"></i>
              </button>
            </div>
          </div>
          `;
        }
"""

content = content.replace('        let gameOverHtml = "";', settings_modal_html + '\n        let gameOverHtml = "";')
content = content.replace('${gameOverHtml}', '${gameOverHtml}\n            ${settingsModalHtml}')


# Remove setup button from game over html
game_over_btn_old = """              <div class="flex gap-4 w-full">
                <button onclick="returnToSetup()" class="flex-1 px-8 py-5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-black text-xl transition-all">Setup Options</button>
                <button onclick="resetGame()" class="flex-[2] px-12 py-5 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-2xl font-black text-2xl shadow-xl transition-all hover:scale-105">Play Again</button>
              </div>"""
              
game_over_btn_new = """              <div class="flex gap-4 w-full">
                <button onclick="resetGame()" class="flex-1 px-12 py-5 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-2xl font-black text-2xl shadow-xl transition-all hover:scale-105">Play Again</button>
              </div>"""

content = content.replace(game_over_btn_old, game_over_btn_new)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
