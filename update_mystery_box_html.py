import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# Add availableFolders
content = content.replace('let gameFolder = "";', 'let gameFolder = "";\n      let availableFolders = [];')

# Replace the folder input with a select
folder_input = r'<input type="text" oninput="gameFolder = this.value" value="\$\{gameFolder\}" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none font-medium text-slate-700" placeholder="e\.g\. Grammar" />'

folder_select = """<select onchange="gameFolder = this.value" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none font-medium text-slate-700">
                    <option value="" ${gameFolder === "" ? "selected" : ""}>No Folder (Root)</option>
                    ${availableFolders.map(f => `<option value="${f.name}" ${gameFolder === f.name ? "selected" : ""}>${f.name}</option>`).join("")}
                  </select>"""

content = re.sub(folder_input, folder_select, content)

# Add SET_FOLDERS listener
listener = """      window.addEventListener("message", (event) => {
        if (event.data?.type === "SET_FOLDERS") {
          availableFolders = event.data.data;
          if (gameState === "setup") renderApp();
        }"""
        
content = content.replace('window.addEventListener("message", (event) => {', listener)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
