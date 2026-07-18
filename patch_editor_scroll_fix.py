with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="absolute inset-0 z-40 bg-slate-50 dark:bg-slate-900 overflow-y-auto custom-scrollbar">\\n      <div className="w-full min-h-full flex flex-col items-center py-8 px-4">',
    '<div className="absolute inset-0 z-40 bg-slate-50 dark:bg-slate-900 overflow-y-auto custom-scrollbar">\n      <div className="w-full min-h-full flex flex-col items-center py-8 px-4">'
)

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
