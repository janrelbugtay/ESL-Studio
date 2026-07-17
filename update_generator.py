import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# Add state variables
content = content.replace('let gameFolder = "";\n      let availableFolders = [];', 
"""let gameFolder = "";
      let availableFolders = [];
      let genLevel = "A1";
      let genType = "mixed";
      let isGenerating = false;""")

# Add generate function
generate_fn = """
      const generateQuestions = async () => {
        if (!gameTopic) {
          alert("Please enter a Topic in Game Details first.");
          return;
        }
        isGenerating = true;
        renderApp();
        
        try {
          const res = await fetch("/api/generate-mystery-box-questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic: gameTopic,
              level: genLevel,
              type: genType
            })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          
          if (data.questions && data.questions.length === 26) {
            customQuestions = data.questions.map((q, i) => ({
              ...q,
              letter: String.fromCharCode(65 + i)
            }));
          } else {
            alert("Failed to generate exactly 26 questions.");
          }
        } catch (e) {
          alert("Error generating questions: " + e.message);
        } finally {
          isGenerating = false;
          renderApp();
        }
      };

      const updateQuestionType = (idx, type) => {
"""
content = content.replace('const updateQuestionType = (idx, type) => {', generate_fn)

# Add UI section
ui_old = """            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <h2 class="text-2xl font-bold mb-6 text-slate-700">2. Questions List (A-Z)</h2>"""

ui_new = """            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <h2 class="text-2xl font-bold mb-6 text-slate-700">2. Auto-Generate Questions</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-2">Cambridge Level</label>
                  <div class="relative">
                    <select onchange="genLevel = this.value" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none font-medium text-slate-700 appearance-none cursor-pointer">
                      ${["A1", "A2", "B1", "B2", "C1", "C2"].map(l => `<option value="${l}" ${genLevel === l ? "selected" : ""}>${l}</option>`).join("")}
                    </select>
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <i data-lucide="chevron-down" class="w-5 h-5"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-500 mb-2">Question Type</label>
                  <div class="relative">
                    <select onchange="genType = this.value" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none font-medium text-slate-700 appearance-none cursor-pointer">
                      <option value="mixed" ${genType === "mixed" ? "selected" : ""}>Mixed (MCQ & Fill in Blanks)</option>
                      <option value="mcq" ${genType === "mcq" ? "selected" : ""}>Multiple Choice Only</option>
                      <option value="fib" ${genType === "fib" ? "selected" : ""}>Fill in Blanks Only</option>
                    </select>
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <i data-lucide="chevron-down" class="w-5 h-5"></i>
                    </div>
                  </div>
                </div>
              </div>
              <button onclick="generateQuestions()" ${isGenerating ? "disabled" : ""} class="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                ${isGenerating ? '<div class="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> Generating...' : '<i data-lucide="sparkles" class="w-5 h-5"></i> Auto-Generate with AI'}
              </button>
            </div>

            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <h2 class="text-2xl font-bold mb-6 text-slate-700">3. Questions List (A-Z)</h2>"""

content = content.replace(ui_old, ui_new)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
