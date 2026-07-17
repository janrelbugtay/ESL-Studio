import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

old_grid_render = """            ${!isOpened ? `<img src="https://drive.google.com/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn&sz=w2048" alt="box" referrerpolicy="no-referrer" class="absolute inset-0 w-full h-full object-cover scale-[1.65] origin-[50%_15%] group-hover:scale-[1.75] transition-transform duration-700" />` : ""}
            ${!isOpened ? `<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500"></div>` : ""}
            <span class="z-10 font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] text-5xl md:text-6xl ${!isOpened ? 'absolute text-yellow-400 left-[28%] top-[50%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] group-hover:scale-110 transition-transform duration-500' : 'relative text-slate-500/50'}">${box.letter}</span>"""

new_grid_render = """            ${!isOpened ? theme.boxContent : ""}
            <span class="z-10 font-black text-5xl md:text-6xl ${!isOpened ? theme.letterStyle : 'relative text-slate-500/50 drop-shadow-none'}">${box.letter}</span>"""

content = content.replace(old_grid_render, new_grid_render)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
