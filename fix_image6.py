import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

old_grid = """            <span class="z-10 font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] text-5xl md:text-6xl ${!isOpened ? 'absolute text-yellow-400 left-[26%] top-[54%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] group-hover:scale-110 transition-transform duration-500' : 'relative text-slate-500/50'}">${box.letter}</span>"""

new_grid = """            <span class="z-10 font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] text-5xl md:text-6xl ${!isOpened ? 'absolute text-yellow-400 left-[28%] top-[50%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] group-hover:scale-110 transition-transform duration-500' : 'relative text-slate-500/50'}">${box.letter}</span>"""

content = content.replace(old_grid, new_grid)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
