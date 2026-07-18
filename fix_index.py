import re

with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace('@import "tailwindcss";', '''@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));''')

content = content.replace('''body {
  background-color: var(--color-brand-bg);
  color: #1e293b;
  font-family: var(--font-sans);
}''', '''body {
  @apply bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100;
  font-family: var(--font-sans);
}''')

with open('src/index.css', 'w') as f:
    f.write(content)
