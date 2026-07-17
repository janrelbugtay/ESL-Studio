import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# Add gameTheme variable
content = content.replace('let gameFolder = "";\n      let availableFolders = [];', 
"""let gameFolder = "";
      let availableFolders = [];
      let gameTheme = "royal"; // royal, space, jungle, ocean""")

# Add Theme to Game Details
details_old = """              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div class="relative">
                    <select onchange="gameFolder = this.value" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none font-medium text-slate-700 appearance-none cursor-pointer">
                      <option value="" ${gameFolder === "" ? "selected" : ""}>No Folder (Root)</option>
                      ${availableFolders.map(f => `<option value="${f.name}" ${gameFolder === f.name ? "selected" : ""}>${f.name}</option>`).join("")}
                    </select>
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <i data-lucide="chevron-down" class="w-5 h-5"></i>
                    </div>
                  </div>
                </div>
              </div>"""

details_new = """              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div class="relative">
                    <select onchange="gameFolder = this.value" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none font-medium text-slate-700 appearance-none cursor-pointer">
                      <option value="" ${gameFolder === "" ? "selected" : ""}>No Folder (Root)</option>
                      ${availableFolders.map(f => `<option value="${f.name}" ${gameFolder === f.name ? "selected" : ""}>${f.name}</option>`).join("")}
                    </select>
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <i data-lucide="chevron-down" class="w-5 h-5"></i>
                    </div>
                  </div>
                </div>
                <div>
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
                </div>
              </div>"""

content = content.replace(details_old, details_new)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
