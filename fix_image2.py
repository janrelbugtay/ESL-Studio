import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

old_grid = """            ${!isOpened ? `<img src="https://drive.google.com/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn&sz=w2000" alt="box" referrerpolicy="no-referrer" class="absolute inset-0 w-[140%] h-[140%] max-w-none -left-[20%] -top-[15%] object-cover group-hover:scale-[1.05] transition-transform duration-500" />` : ""}
            ${!isOpened ? `<div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors rounded-[2rem]"></div>` : ""}
            <span class="absolute z-10 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] font-black text-5xl md:text-6xl left-[20%] top-[40%] -translate-y-1/2 -translate-x-1/2 rotate-[-5deg]">${box.letter}</span>"""

new_grid = """            ${!isOpened ? `<img src="https://drive.google.com/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn&sz=w2048" alt="box" referrerpolicy="no-referrer" class="absolute inset-0 w-full h-full object-cover scale-[1.4] origin-[50%_35%] group-hover:scale-[1.5] transition-transform duration-500" />` : ""}
            ${!isOpened ? `<div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>` : ""}
            <span class="absolute z-10 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] font-black text-5xl md:text-6xl ${!isOpened ? 'left-[30%] top-[45%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg]' : ''}">${box.letter}</span>"""

content = content.replace(old_grid, new_grid)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
