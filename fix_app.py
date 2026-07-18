import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('bg-[#F8FAFC]', 'bg-slate-50 dark:bg-slate-900')
content = content.replace('text-slate-800', 'text-slate-800 dark:text-slate-200')
content = content.replace('bg-white', 'bg-white dark:bg-slate-800')

with open('src/App.tsx', 'w') as f:
    f.write(content)
