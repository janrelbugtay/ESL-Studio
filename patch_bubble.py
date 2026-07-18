with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

# Update background and text colors for light/dark mode in the Game Editor
replacements = [
    # Main container
    ('className="absolute inset-0 z-40 bg-slate-900 flex flex-col items-center py-8 px-4 overflow-y-auto"',
     'className="absolute inset-0 z-40 bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-8 px-4 overflow-y-auto custom-scrollbar"'),
    
    # Inner header background
    ('className="bg-slate-800/80 p-8 flex flex-col gap-6 border-b-2 border-blue-500/50"',
     'className="bg-white dark:bg-slate-800/80 p-8 flex flex-col gap-6 border-b-2 border-blue-500/50"'),
    
    # Title
    ('className="text-3xl font-extrabold text-white tracking-wide"',
     'className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-wide"'),

    # Cancel button
    ('className="px-5 py-2.5 rounded-xl text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"',
     'className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"'),

    # Input fields
    ('className="w-full text-sm font-medium bg-slate-900 border border-slate-700 outline-none text-white px-4 py-3 rounded-xl focus:border-blue-500 placeholder-slate-600 transition-colors"',
     'className="w-full text-sm font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-white px-4 py-3 rounded-xl focus:border-blue-500 placeholder-slate-400 dark:placeholder-slate-600 transition-colors"'),
    
    # Select field
    ('className="w-full text-sm font-medium bg-slate-900 border border-slate-700 outline-none text-white px-4 py-3 rounded-xl focus:border-blue-500 appearance-none cursor-pointer transition-colors"',
     'className="w-full text-sm font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-white px-4 py-3 rounded-xl focus:border-blue-500 appearance-none cursor-pointer transition-colors"'),

    # Questions container
    ('className="p-6 flex flex-col gap-6 bg-slate-900/50"',
     'className="p-6 flex flex-col gap-6 bg-slate-100 dark:bg-slate-900/50"'),

    # Question card
    ('className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-sm relative group"',
     'className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-300 dark:border-slate-700 shadow-sm relative group"'),
    
    # Question input
    ('className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white font-medium"',
     'className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-800 dark:text-white font-medium"'),

    # Radio button
    ('className="w-4 h-4 text-blue-500 focus:ring-blue-500 bg-slate-900 border-slate-600"',
     'className="w-4 h-4 text-blue-500 focus:ring-blue-500 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600"'),

    # Generated image container
    ('className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5 pr-3"',
     'className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 pr-3"'),

    # Option input active/inactive class
    ("border ${q.answerIndex === optIndex ? 'border-blue-500/50 bg-blue-500/10 text-blue-300' : 'border-slate-700 text-slate-300'}",
     "border ${q.answerIndex === optIndex ? 'border-blue-500/50 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'}"),
     
    # Option input general class
    ('className={`flex-1 min-w-0 bg-slate-900 border',
     'className={`flex-1 min-w-0 bg-slate-50 dark:bg-slate-900 border'),
    
    # Add option / Remove option buttons
    ('className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded hover:bg-slate-600 disabled:opacity-50 cursor-pointer"',
     'className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 cursor-pointer"'),

    # Add another question button
    ('className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl text-slate-400 font-bold hover:bg-slate-800 hover:border-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"',
     'className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"')
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
