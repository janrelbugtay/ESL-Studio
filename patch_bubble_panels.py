with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

replacements = [
    ('className="glass-panel bg-slate-900/80',
     'className="glass-panel bg-white/90 dark:bg-slate-900/80'),
     
    ('className="glass-panel bg-slate-900/90',
     'className="glass-panel bg-white/90 dark:bg-slate-900/90'),
     
    ('className="glass-panel bg-blue-900/80',
     'className="glass-panel bg-blue-100/90 dark:bg-blue-900/80')
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
