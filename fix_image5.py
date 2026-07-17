import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

old_grid = """            ${!isOpened ? `<img src="https://drive.google.com/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn&sz=w2048" alt="box" referrerpolicy="no-referrer" class="absolute inset-0 w-full h-full object-cover scale-[1.4] origin-[50%_25%] group-hover:scale-[1.5] transition-transform duration-700" />` : ""}"""

new_grid = """            ${!isOpened ? `<img src="https://drive.google.com/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn&sz=w2048" alt="box" referrerpolicy="no-referrer" class="absolute inset-0 w-full h-full object-cover scale-[1.65] origin-[50%_15%] group-hover:scale-[1.75] transition-transform duration-700" />` : ""}"""

content = content.replace(old_grid, new_grid)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
