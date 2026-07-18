with open('src/views/YogaQuiz.tsx', 'r') as f:
    content = f.read()

replacements = [
    # Scrollbar
    ('custom-scroll', 'custom-scrollbar'),

    # Editor Container
    ('bg-white rounded-[2.5rem] shadow-xl border-4 border-teal-100 overflow-hidden relative',
     'bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border-4 border-teal-100 dark:border-teal-900/50 overflow-hidden relative'),
     
    # Decorative shape
    ('bg-teal-50 rounded-bl-full pointer-events-none',
     'bg-teal-50 dark:bg-teal-900/20 rounded-bl-full pointer-events-none'),

    # Editor Header
    ('border-b-2 border-teal-50 flex flex-wrap gap-4 items-center justify-between bg-white relative z-10 shrink-0',
     'border-b-2 border-teal-50 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-slate-800 relative z-10 shrink-0'),

    # Quiz Title Input
    ('text-3xl font-black bg-transparent border-none outline-none placeholder:text-teal-200 text-teal-900 w-full mb-2',
     'text-3xl font-black bg-transparent border-none outline-none placeholder:text-teal-200 dark:placeholder:text-teal-700 text-teal-900 dark:text-white w-full mb-2'),

    # Subject/Topic/Class Inputs
    ('text-sm font-bold bg-teal-50 border-2 border-teal-100 outline-none placeholder:text-teal-300 text-teal-700 px-4 py-1.5 rounded-lg focus:border-teal-400',
     'text-sm font-bold bg-teal-50 dark:bg-slate-700 border-2 border-teal-100 dark:border-slate-600 outline-none placeholder:text-teal-300 dark:placeholder:text-teal-500 text-teal-700 dark:text-teal-200 px-4 py-1.5 rounded-lg focus:border-teal-400 dark:focus:border-teal-500'),

    # Cancel Button
    ('px-5 py-2.5 font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-all cursor-pointer',
     'px-5 py-2.5 font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-slate-700 hover:bg-teal-100 dark:hover:bg-slate-600 rounded-xl transition-all cursor-pointer'),

    # Toolbar
    ('px-8 py-4 border-b-2 border-teal-50 flex items-center justify-between bg-white/50 backdrop-blur shrink-0 relative z-10',
     'px-8 py-4 border-b-2 border-teal-50 dark:border-slate-700 flex items-center justify-between bg-white/50 dark:bg-slate-800/50 backdrop-blur shrink-0 relative z-10'),
    
    ('text-teal-600 font-bold text-sm',
     'text-teal-600 dark:text-teal-400 font-bold text-sm'),

    # Toolbar buttons
    ('text-teal-700 bg-teal-100 hover:bg-teal-200 rounded-xl transition-all cursor-pointer shadow-sm',
     'text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-slate-700 hover:bg-teal-200 dark:hover:bg-slate-600 rounded-xl transition-all cursor-pointer shadow-sm'),

    ('text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition-all cursor-pointer shadow-sm',
     'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-xl transition-all cursor-pointer shadow-sm'),

    # Rows Container
    ('flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 bg-teal-50/30 relative z-10',
     'flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 bg-teal-50/30 dark:bg-slate-900/50 relative z-10'),

    # Question Card
    ('bg-white p-6 rounded-3xl border-2 border-teal-100 shadow-sm relative group transition-all hover:border-teal-300 hover:shadow-md',
     'bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-teal-100 dark:border-slate-700 shadow-sm relative group transition-all hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-md'),

    ('bg-teal-600 text-white font-black rounded-xl flex items-center justify-center shadow-md rotate-[-5deg]',
     'bg-teal-600 dark:bg-teal-700 text-white font-black rounded-xl flex items-center justify-center shadow-md rotate-[-5deg]'),

    ('text-teal-300 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-all',
     'text-teal-300 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-all'),

    ('block text-xs font-black text-teal-600 uppercase tracking-widest mb-2',
     'block text-xs font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-2'),

    # Question Input
    ('w-full bg-teal-50/50 border-2 border-teal-100 rounded-xl p-4 outline-none focus:border-teal-500 focus:bg-white transition-all font-bold text-lg text-teal-900',
     'w-full bg-teal-50/50 dark:bg-slate-900 border-2 border-teal-100 dark:border-slate-600 rounded-xl p-4 outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold text-lg text-teal-900 dark:text-white'),

    # Option Card
    ("bg-teal-50 border-teal-500 shadow-sm' : 'bg-white border-teal-100",
     "bg-teal-50 dark:bg-teal-900/30 border-teal-500 dark:border-teal-400 shadow-sm' : 'bg-white dark:bg-slate-700 border-teal-100 dark:border-slate-600"),

    ('font-black text-teal-800 flex items-center gap-2 text-lg',
     'font-black text-teal-800 dark:text-teal-200 flex items-center gap-2 text-lg'),

    ('w-5 h-5 accent-teal-600 cursor-pointer',
     'w-5 h-5 accent-teal-600 dark:accent-teal-400 cursor-pointer'),

    ('w-full bg-transparent border-none outline-none text-teal-700 font-bold placeholder:text-teal-300',
     'w-full bg-transparent border-none outline-none text-teal-700 dark:text-teal-100 font-bold placeholder:text-teal-300 dark:placeholder:text-teal-600'),

    # Add Question Button
    ('w-full py-6 border-4 border-dashed border-teal-200 rounded-3xl text-teal-500 font-black text-xl hover:bg-teal-50 hover:border-teal-400 hover:text-teal-600 transition-all flex items-center justify-center gap-3 cursor-pointer',
     'w-full py-6 border-4 border-dashed border-teal-200 dark:border-slate-700 rounded-3xl text-teal-500 dark:text-slate-400 font-black text-xl hover:bg-teal-50 dark:hover:bg-slate-800 hover:border-teal-400 dark:hover:border-slate-500 hover:text-teal-600 dark:hover:text-slate-300 transition-all flex items-center justify-center gap-3 cursor-pointer')
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/views/YogaQuiz.tsx', 'w') as f:
    f.write(content)
