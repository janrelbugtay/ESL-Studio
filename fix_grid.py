import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

old_grid = """        let gridHtml = customQuestions
          .map((box) => {
            const isOpened = openedBoxes.includes(box.letter);
            return `
          <button
            onclick="handleBoxClick('${box.letter}')"
            onmouseenter="playSound('hover', isMuted)"
            ${isOpened ? "disabled" : ""}
            class="relative group aspect-square rounded-[2rem] flex flex-col items-center justify-center text-2xl sm:text-3xl md:text-4xl font-black shadow-xl transition-all duration-300
              ${
                isOpened
                  ? "bg-white/40 text-slate-400/50 cursor-not-allowed border-2 border-white/50 shadow-inner scale-95"
                  : "bg-gradient-to-br from-yellow-300 to-orange-500 animate-box-glow text-white hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-400/50 border-4 border-white active:scale-95"
              }
            "
          >
            ${!isOpened ? `<div class="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors rounded-[2rem]"></div>` : ""}
            ${box.letter}
            ${!isOpened ? `<img src="https://drive.google.com/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn&sz=w1000" alt="box" referrerpolicy="no-referrer" class="w-16 h-16 sm:w-20 sm:h-20 mt-1 sm:mt-2 drop-shadow-lg object-contain group-hover:scale-110 transition-transform" />` : ""}
          </button>
        `;
          })"""

new_grid = """        let gridHtml = customQuestions
          .map((box) => {
            const isOpened = openedBoxes.includes(box.letter);
            return `
          <button
            onclick="handleBoxClick('${box.letter}')"
            onmouseenter="playSound('hover', isMuted)"
            ${isOpened ? "disabled" : ""}
            class="relative overflow-hidden group aspect-square rounded-[2rem] flex flex-col items-center justify-center text-2xl sm:text-3xl md:text-4xl font-black shadow-xl transition-all duration-300
              ${
                isOpened
                  ? "bg-white/40 text-slate-400/50 cursor-not-allowed border-2 border-white/50 shadow-inner scale-95"
                  : "bg-gradient-to-br from-yellow-300 to-orange-500 animate-box-glow text-white hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-400/50 border-4 border-white active:scale-95"
              }
            "
          >
            ${!isOpened ? `<img src="https://drive.google.com/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn&sz=w1000" alt="box" referrerpolicy="no-referrer" class="absolute inset-0 w-full h-full object-cover scale-[1.15] group-hover:scale-[1.25] transition-transform duration-500" />` : ""}
            ${!isOpened ? `<div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>` : ""}
            <span class="relative z-10 text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)] text-4xl md:text-5xl">${box.letter}</span>
          </button>
        `;
          })"""

content = content.replace(old_grid, new_grid)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
