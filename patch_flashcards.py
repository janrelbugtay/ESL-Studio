with open('src/views/FlashcardsMatch.tsx', 'r') as f:
    content = f.read()

replacements = [
    # Scrollbar
    ('custom-scroll', 'custom-scrollbar'),

    # Editor Container
    ('bg-white rounded-2xl shadow-sm border border-slate-200',
     'bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700'),

    # Editor Header
    ('bg-slate-50 shrink-0',
     'bg-slate-50 dark:bg-slate-900/50 shrink-0 border-b border-slate-200 dark:border-slate-700'),

    # Activity Title Input
    ('text-2xl font-black bg-transparent border-none outline-none placeholder:text-slate-400 flex-1 min-w-[250px]',
     'text-2xl font-black text-slate-900 dark:text-white bg-transparent border-none outline-none placeholder:text-slate-400 flex-1 min-w-[250px]'),

    # Cancel Button
    ('px-4 py-2 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all cursor-pointer',
     'px-4 py-2 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer'),

    # Toolbar
    ('px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0',
     'px-6 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 shrink-0'),

    # Toolbar buttons
    ('text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer',
     'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer'),
     
    # Rows Container
    ('flex-1 overflow-y-auto custom-scroll p-6 bg-slate-50/50',
     'flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 dark:bg-slate-900/50'),

    # Card Item Container
    ('group flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all',
     'group flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all'),

    # Number badge
    ('w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full font-bold text-slate-500 shrink-0 border border-slate-200',
     'w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full font-bold text-slate-500 dark:text-slate-300 shrink-0 border border-slate-200 dark:border-slate-600'),

    # Inputs
    ('text-lg font-semibold bg-transparent border-none outline-none placeholder:text-slate-300 resize-none overflow-hidden text-slate-700',
     'text-lg font-semibold bg-transparent border-none outline-none placeholder:text-slate-400 resize-none overflow-hidden text-slate-700 dark:text-slate-200'),
    
    ('text-sm font-semibold text-slate-400 mb-1 block uppercase tracking-wider',
     'text-sm font-semibold text-slate-400 dark:text-slate-500 mb-1 block uppercase tracking-wider'),

    # Divider line
    ('w-px bg-slate-200 mt-8 relative hidden md:block self-stretch',
     'w-px bg-slate-200 dark:bg-slate-700 mt-8 relative hidden md:block self-stretch'),

    # Swap Button
    ('absolute top-1/2 -left-3.5 -translate-y-1/2 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition-colors z-10 cursor-pointer',
     'absolute top-1/2 -left-3.5 -translate-y-1/2 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 shadow-sm transition-colors z-10 cursor-pointer'),

    # Delete Button
    ('p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer',
     'p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer'),

    # Add Card Button
    ('w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 cursor-pointer',
     'w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 cursor-pointer')
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/views/FlashcardsMatch.tsx', 'w') as f:
    f.write(content)
