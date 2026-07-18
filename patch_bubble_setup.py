with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

replacements = [
    ('className="text-5xl font-black mb-12 drop-shadow-lg text-white"',
     'className="text-5xl font-black mb-12 drop-shadow-lg text-slate-800 dark:text-white"'),
     
    ('className="flex-1 glass-panel hover:bg-white/10 rounded-3xl p-10 flex flex-col items-center border-t-4 border-blue-400 transition-transform hover:scale-105 cursor-pointer text-white"',
     'className="flex-1 glass-panel hover:bg-black/5 dark:hover:bg-white/10 rounded-3xl p-10 flex flex-col items-center border-t-4 border-blue-400 transition-transform hover:scale-105 cursor-pointer text-slate-800 dark:text-white"'),

    ('className="flex-1 glass-panel hover:bg-white/10 rounded-3xl p-10 flex flex-col items-center border-t-4 border-red-400 transition-transform hover:scale-105 cursor-pointer text-white"',
     'className="flex-1 glass-panel hover:bg-black/5 dark:hover:bg-white/10 rounded-3xl p-10 flex flex-col items-center border-t-4 border-red-400 transition-transform hover:scale-105 cursor-pointer text-slate-800 dark:text-white"')
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
