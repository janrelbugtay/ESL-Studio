with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

replacements = [
    ('<div className="absolute inset-0 z-40 bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-8 px-4 overflow-y-auto custom-scrollbar">',
     '<div className="absolute inset-0 z-40 bg-slate-50 dark:bg-slate-900 overflow-y-auto custom-scrollbar">\\n      <div className="w-full min-h-full flex flex-col items-center py-8 px-4">')
]

for old, new in replacements:
    content = content.replace(old, new)
    
# also need to add closing div
content = content.replace('    </div>\\n  );\\n}\\n\\nexport default BubblePop;', '      </div>\\n    </div>\\n  );\\n}\\n\\nexport default BubblePop;')

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
