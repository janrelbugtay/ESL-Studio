with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

replacements = [
    # Remove question button
    ('className="absolute -right-3 -top-3 w-8 h-8 bg-slate-700 text-slate-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white border-2 border-slate-900 cursor-pointer"',
     'className="absolute -right-3 -top-3 w-8 h-8 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white border-2 border-white dark:border-slate-800 cursor-pointer"')
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
