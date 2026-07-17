import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

old_bg = '        <div class="min-h-screen bg-gradient-to-br from-cyan-200 via-sky-100 to-yellow-100 pb-10 ${shakeClass}">'
new_bg = '        <div class="min-h-screen bg-[conic-gradient(at_bottom_center,_var(--tw-gradient-stops))] from-indigo-900 via-purple-700 to-indigo-900 pb-10 ${shakeClass}">'

content = content.replace(old_bg, new_bg)

old_text = '<h2 class="text-4xl md:text-5xl font-black text-slate-800 drop-shadow-sm mb-6 flex-1 text-center font-display tracking-tight">'
new_text = '<h2 class="text-4xl md:text-5xl font-black text-white drop-shadow-md mb-6 flex-1 text-center font-display tracking-tight">'

content = content.replace(old_text, new_text)

# Also update the Created By text so it's visible on dark bg
content = content.replace('text-slate-500/80 font-black', 'text-white/60 font-black')

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
