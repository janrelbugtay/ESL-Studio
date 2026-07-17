import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# 1. Add gameDifficulty variable
content = content.replace('let gameTheme = "royal";', 'let gameTheme = "royal";\n      let gameDifficulty = "normal";')

# 2. Define outcomes
outcomes_code = """
      const OUTCOMES_NORMAL = [
        { id: "add100", text: "+100 points", icon: `<i data-lucide="star" class="w-10 h-10 text-yellow-100"></i>`, color: "bg-teal-500 shadow-teal-500/40", action: (teams, tIdx) => { teams[tIdx].score += 100; return teams; } },
        { id: "add200", text: "+200 points", icon: `<i data-lucide="star" class="w-10 h-10 text-yellow-100"></i>`, color: "bg-green-500 shadow-green-500/40", action: (teams, tIdx) => { teams[tIdx].score += 200; return teams; } },
        { id: "add300", text: "+300 points", icon: `<i data-lucide="star" class="w-10 h-10 text-yellow-100"></i>`, color: "bg-emerald-500 shadow-emerald-500/40", action: (teams, tIdx) => { teams[tIdx].score += 300; return teams; } },
        { id: "sub50", text: "-50 points", icon: `<i data-lucide="cloud-rain" class="w-10 h-10 text-white"></i>`, color: "bg-red-400 shadow-red-400/40", action: (teams, tIdx) => { teams[tIdx].score -= 50; return teams; } },
        { id: "sub100", text: "-100 points", icon: `<i data-lucide="alert-triangle" class="w-10 h-10 text-white"></i>`, color: "bg-red-500 shadow-red-500/40", action: (teams, tIdx) => { teams[tIdx].score -= 100; return teams; } },
        { id: "add50", text: "+50 points", icon: `<i data-lucide="star" class="w-10 h-10 text-yellow-100"></i>`, color: "bg-cyan-500 shadow-cyan-500/40", action: (teams, tIdx) => { teams[tIdx].score += 50; return teams; } },
      ];

      const OUTCOMES_MEDIUM = [
        ...OUTCOMES_NORMAL,
        { id: "add500", text: "+500 points", icon: `<i data-lucide="award" class="w-10 h-10 text-yellow-100"></i>`, color: "bg-green-600 shadow-green-600/40", action: (teams, tIdx) => { teams[tIdx].score += 500; return teams; } },
        { id: "sub200", text: "-200 points", icon: `<i data-lucide="alert-triangle" class="w-10 h-10 text-white"></i>`, color: "bg-rose-600 shadow-rose-600/40", action: (teams, tIdx) => { teams[tIdx].score -= 200; return teams; } },
        { 
          id: "swap_lowest", 
          text: "Swap with Lowest", 
          icon: `<i data-lucide="arrow-right-left" class="w-10 h-10 text-white"></i>`, 
          color: "bg-purple-500 shadow-purple-500/40", 
          action: (teams, tIdx) => { 
            let lowestIdx = 0;
            for (let i = 1; i < teams.length; i++) {
              if (teams[i].score < teams[lowestIdx].score) lowestIdx = i;
            }
            if (lowestIdx !== tIdx) {
              let temp = teams[tIdx].score;
              teams[tIdx].score = teams[lowestIdx].score;
              teams[lowestIdx].score = temp;
            }
            return teams; 
          } 
        },
        { 
          id: "steal_100", 
          text: "Steal 100", 
          icon: `<i data-lucide="grab" class="w-10 h-10 text-white"></i>`, 
          color: "bg-indigo-500 shadow-indigo-500/40", 
          action: (teams, tIdx) => { 
            let highestIdx = 0;
            for (let i = 1; i < teams.length; i++) {
              if (teams[i].score > teams[highestIdx].score) highestIdx = i;
            }
            if (highestIdx !== tIdx && teams[highestIdx].score >= 100) {
              teams[highestIdx].score -= 100;
              teams[tIdx].score += 100;
            }
            return teams; 
          } 
        },
      ];

      const OUTCOMES_DIFFICULT = [
        ...OUTCOMES_MEDIUM,
        { id: "sub500", text: "-500 points", icon: `<i data-lucide="skull" class="w-10 h-10 text-white"></i>`, color: "bg-red-700 shadow-red-700/40", action: (teams, tIdx) => { teams[tIdx].score -= 500; return teams; } },
        { 
          id: "swap_highest", 
          text: "Swap with Highest", 
          icon: `<i data-lucide="arrow-right-left" class="w-10 h-10 text-white"></i>`, 
          color: "bg-fuchsia-600 shadow-fuchsia-600/40", 
          action: (teams, tIdx) => { 
            let highestIdx = 0;
            for (let i = 1; i < teams.length; i++) {
              if (teams[i].score > teams[highestIdx].score) highestIdx = i;
            }
            if (highestIdx !== tIdx) {
              let temp = teams[tIdx].score;
              teams[tIdx].score = teams[highestIdx].score;
              teams[highestIdx].score = temp;
            }
            return teams; 
          } 
        },
        { 
          id: "minus_10_percent", 
          text: "-10% Points", 
          icon: `<i data-lucide="percent" class="w-10 h-10 text-white"></i>`, 
          color: "bg-orange-500 shadow-orange-500/40", 
          action: (teams, tIdx) => { 
            teams[tIdx].score -= Math.floor(Math.max(0, teams[tIdx].score) * 0.10);
            return teams; 
          } 
        },
        { 
          id: "minus_all_team", 
          text: "Bomb All Teams -100", 
          icon: `<i data-lucide="bomb" class="w-10 h-10 text-white"></i>`, 
          color: "bg-slate-800 shadow-slate-800/40", 
          action: (teams, tIdx) => { 
            teams.forEach(t => t.score -= 100);
            return teams; 
          } 
        },
        { 
          id: "give_10_percent", 
          text: "Give 10% to others", 
          icon: `<i data-lucide="gift" class="w-10 h-10 text-white"></i>`, 
          color: "bg-pink-500 shadow-pink-500/40", 
          action: (teams, tIdx) => { 
            if (teams.length > 1 && teams[tIdx].score > 0) {
              const amount = Math.floor(teams[tIdx].score * 0.10);
              teams[tIdx].score -= amount;
              const perTeam = Math.floor(amount / (teams.length - 1));
              teams.forEach((t, i) => {
                if (i !== tIdx) t.score += perTeam;
              });
            }
            return teams; 
          } 
        },
      ];
      
      const getOutcomes = () => {
        if (gameDifficulty === "normal") return OUTCOMES_NORMAL;
        if (gameDifficulty === "medium") return OUTCOMES_MEDIUM;
        return OUTCOMES_DIFFICULT;
      };
"""

# We need to replace the old OUTCOMES array
start_idx = content.find('const OUTCOMES = [')
end_idx = content.find('];', start_idx) + 2

content = content[:start_idx] + outcomes_code + content[end_idx:]

with open('public/mystery-box.html', 'w') as f:
    f.write(content)

