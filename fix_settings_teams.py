import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# Update removeTeam logic for currentTeamIdx safety
old_remove = """      const removeTeam = (index) => {
        if (teams.length > 2) {
          teams.splice(index, 1);
          teams.forEach((t, i) => (t.id = i));
          renderApp();
        }
      };"""
      
new_remove = """      const removeTeam = (index) => {
        if (teams.length > 2) {
          teams.splice(index, 1);
          if (currentTeamIdx >= teams.length) {
            currentTeamIdx = 0;
          }
          teams.forEach((t, i) => (t.id = i));
          renderApp();
        }
      };"""

content = content.replace(old_remove, new_remove)

# Update settingsModalHtml to include teams
old_settings = """              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-3">Theme</label>"""

new_settings = """              <div class="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <label class="block text-sm font-bold text-slate-500">Teams</label>
                    <button onclick="addTeam()" class="text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded-md transition-colors flex items-center gap-1">
                      <i data-lucide="plus" class="w-3 h-3"></i> Add
                    </button>
                  </div>
                  <div class="space-y-2">
                    ${teams.map((t, idx) => `
                      <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-lg focus-within:border-blue-400">
                        <div class="font-bold text-slate-400 w-4 text-sm">${idx + 1}</div>
                        <input 
                          type="text" 
                          value="${t.name.replace(/"/g, "&quot;")}" 
                          oninput="teams[${idx}].name = this.value; renderApp();" 
                          class="flex-1 bg-transparent outline-none font-medium text-slate-700 text-sm" 
                          placeholder="Team Name"
                        />
                        ${teams.length > 2 ? `<button onclick="removeTeam(${idx})" class="text-red-400 hover:text-red-600 p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>` : ''}
                      </div>
                    `).join("")}
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-3">Theme</label>"""

content = content.replace(old_settings, new_settings)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
