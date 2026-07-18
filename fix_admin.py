import re
with open('src/views/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('bg-white', 'bg-white dark:bg-slate-800')
content = content.replace('text-slate-800', 'text-slate-800 dark:text-slate-200')
content = content.replace('text-slate-600', 'text-slate-600 dark:text-slate-400')
content = content.replace('text-slate-500', 'text-slate-500 dark:text-slate-400')
content = content.replace('text-slate-900', 'text-slate-900 dark:text-slate-100')
content = content.replace('border-slate-100', 'border-slate-100 dark:border-slate-700')
content = content.replace('border-slate-200', 'border-slate-200 dark:border-slate-700')
content = content.replace('bg-slate-50', 'bg-slate-50 dark:bg-slate-900/50')
content = content.replace('hover:bg-slate-50', 'hover:bg-slate-50 dark:hover:bg-slate-700')

with open('src/views/AdminDashboard.tsx', 'w') as f:
    f.write(content)
