with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

replacements = [
    # Main game container
    ("bg-[#0f172a] text-white flex",
     "bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white flex"),
     
    ("bg-[#0f172a] flex flex-col",
     "bg-slate-50 dark:bg-[#0f172a] flex flex-col"),
     
    # Radial background - only dark mode
    ("bg-[radial-gradient(circle_at_50%_100%,#1e3a8a,#0f172a)]",
     "bg-[radial-gradient(circle_at_50%_100%,#dbeafe,#f8fafc)] dark:bg-[radial-gradient(circle_at_50%_100%,#1e3a8a,#0f172a)]"),
     
    # Result overlay
    ("bg-[#0f121b] flex flex-col",
     "bg-slate-100 dark:bg-[#0f121b] flex flex-col"),
     
    # Result panel
    ("bg-[#252836] shadow-2xl border border-slate-700/50",
     "bg-white dark:bg-[#252836] shadow-2xl border border-slate-200 dark:border-slate-700/50"),
     
    # Player score boxes
    ("bg-[#303343] p-5 rounded-xl border border-white/5",
     "bg-slate-50 dark:bg-[#303343] p-5 rounded-xl border border-slate-200 dark:border-white/5"),
     
    # Buttons
    ("bg-[#393c4b] hover:bg-[#444857]",
     "bg-slate-200 hover:bg-slate-300 dark:bg-[#393c4b] dark:hover:bg-[#444857]"),
     
    ("text-white shadow-lg",
     "text-slate-700 dark:text-white shadow-lg"),
     
    # Text colors
    ("text-white leading-relaxed",
     "text-slate-800 dark:text-white leading-relaxed"),
     
    ("text-white text-3xl font-black",
     "text-slate-800 dark:text-white text-3xl font-black"),

    ("text-white/80 hover:text-white bg-black/20 hover:bg-black/50 border-white/20",
     "text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 dark:bg-black/20 hover:bg-slate-300/50 dark:hover:bg-black/50 border-slate-300/50 dark:border-white/20"),
     
    ("text-white font-bold pointer-events-auto border border-white/20",
     "text-slate-800 dark:text-white font-bold pointer-events-auto border border-slate-300 dark:border-white/20"),
     
    ("text-white'>Select Game Mode",
     "text-slate-900 dark:text-white'>Select Game Mode"),

    ("text-white cursor-pointer",
     "text-slate-800 dark:text-white cursor-pointer"),
     
    ("z-10 text-white",
     "z-10 text-slate-800 dark:text-white")
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
