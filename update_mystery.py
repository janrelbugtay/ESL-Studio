import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# Pattern for 2. Teams block
pattern = r'<div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">\s*<div class="flex justify-between items-center mb-6">\s*<h2 class="text-2xl font-bold text-slate-700">2\. Teams</h2>.*?(?=<div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">\s*<h2 class="text-2xl font-bold mb-6 text-slate-700">3\. Auto-Generate Questions)'

new_content = re.sub(pattern, '', content, flags=re.DOTALL)

# Update numbering
new_content = new_content.replace('3. Auto-Generate Questions', '2. Auto-Generate Questions')
new_content = new_content.replace('4. Questions List (A-Z)', '3. Questions List (A-Z)')

with open('public/mystery-box.html', 'w') as f:
    f.write(new_content)
