import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# teamsHeaderHtml
content = content.replace('"border-transparent bg-white/60"', '"border-transparent bg-white/10"')
content = content.replace('text-slate-400"}">${team.name}', 'text-white/60"}">${team.name}')
content = content.replace('text-slate-600"}">\n              ${team.score', 'text-white/80"}">\n              ${team.score')
content = content.replace('text-sky-300 font-black text-xl md:text-3xl opacity-50">VS', 'text-white/30 font-black text-xl md:text-3xl">VS')

# Header
content = content.replace('bg-white/80 backdrop-blur-md shadow-lg shadow-sky-200/50 mb-8 border-b border-white', 'bg-white/10 backdrop-blur-md shadow-lg shadow-black/20 mb-8 border-b border-white/10')
content = content.replace('bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent', 'text-white')
content = content.replace('bg-white/60 p-2 md:p-3 rounded-2xl shadow-inner border border-white', 'bg-white/5 p-2 md:p-3 rounded-2xl shadow-inner border border-white/10')
content = content.replace('p-3 bg-white text-slate-500 hover:text-sky-500', 'p-3 bg-white/10 text-white hover:bg-white hover:text-slate-800')
content = content.replace('p-3 bg-white text-slate-500 hover:text-red-500', 'p-3 bg-white/10 text-white hover:bg-red-500 hover:text-white')
content = content.replace('bg-slate-800 text-white hover:bg-slate-700', 'bg-white text-slate-900 hover:bg-slate-200')

# Turn Indicator
content = content.replace('inline-block bg-white border-2 border-white rounded-full p-2 pr-6 shadow-xl shadow-sky-200/50', 'inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 pr-6 shadow-xl shadow-black/20')
content = content.replace('text-xl md:text-2xl font-bold text-slate-600', 'text-xl md:text-2xl font-bold text-white')

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
