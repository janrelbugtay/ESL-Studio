import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

old_select = """                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-2">Folder</label>
                  <select onchange="gameFolder = this.value" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none font-medium text-slate-700">
                    <option value="" ${gameFolder === "" ? "selected" : ""}>No Folder (Root)</option>
                    ${availableFolders.map(f => `<option value="${f.name}" ${gameFolder === f.name ? "selected" : ""}>${f.name}</option>`).join("")}
                  </select>
                </div>"""

new_select = """                <div>
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
                </div>"""

content = content.replace(old_select, new_select)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
