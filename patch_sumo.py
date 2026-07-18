with open('src/views/Sumo.tsx', 'r') as f:
    content = f.read()

replacements = [
    # Menu container
    ("bg-indigo-950",
     "bg-indigo-50 dark:bg-indigo-950"),

    # End container
    ("bg-black/95",
     "bg-slate-100 dark:bg-black/95"),

    # Text white -> text slate/white
    ("text-white/80 hover:text-white bg-black/20 hover:bg-black/50 border-white/20",
     "text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 dark:bg-black/20 hover:bg-slate-300/50 dark:hover:bg-black/50 border-slate-300/50 dark:border-white/20"),

    ("text-white italic uppercase",
     "text-slate-800 dark:text-white italic uppercase"),
     
    ("text-white font-black italic",
     "text-slate-800 dark:text-white font-black italic"),
     
    ("text-white text-lg md:text-2xl font-bold",
     "text-slate-800 dark:text-white text-lg md:text-2xl font-bold"),
     
    ("bg-black/30 px-3 md:px-4 py-1 md:py-2 rounded-xl text-xl md:text-3xl font-black text-white",
     "bg-slate-200 dark:bg-black/30 px-3 md:px-4 py-1 md:py-2 rounded-xl text-xl md:text-3xl font-black text-slate-800 dark:text-white"),
     
    ("text-white text-[10px] font-bold w-1/2",
     "text-slate-100 dark:text-white text-[10px] font-bold w-1/2")
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/views/Sumo.tsx', 'w') as f:
    f.write(content)
