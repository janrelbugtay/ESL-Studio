import re
with open('src/components/Navigation.tsx', 'r') as f:
    content = f.read()

content = content.replace('bg-white', 'bg-white dark:bg-slate-800')
content = content.replace('text-slate-800', 'text-slate-800 dark:text-slate-200')
content = content.replace('text-slate-700', 'text-slate-700 dark:text-slate-300')
content = content.replace('text-slate-500', 'text-slate-500 dark:text-slate-400')
content = content.replace('border-[#e2e8f0]', 'border-slate-200 dark:border-slate-700')
content = content.replace('bg-[#f1f5f9]', 'bg-slate-100 dark:bg-slate-700')
content = content.replace('hover:bg-slate-50', 'hover:bg-slate-50 dark:hover:bg-slate-700')
content = content.replace('bg-brand-purple/10 text-brand-purple', 'bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20 dark:text-brand-purple-300')

with open('src/components/Navigation.tsx', 'w') as f:
    f.write(content)
