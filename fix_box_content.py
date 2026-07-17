import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

old_theme = """      const getThemeStyles = () => {
        switch(gameTheme) {
          case 'space':
            return {
              bg: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black',
              particles: 'bg-white/40',
              box: 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-300',
              boxHover: 'hover:shadow-indigo-500/50',
              modalBorder: 'border-indigo-400'
            };
          case 'jungle':
            return {
              bg: 'bg-gradient-to-br from-green-900 via-emerald-800 to-green-950',
              particles: 'bg-green-300/40',
              box: 'bg-gradient-to-br from-emerald-500 to-green-600 border-green-300',
              boxHover: 'hover:shadow-green-500/50',
              modalBorder: 'border-green-400'
            };
          case 'ocean':
            return {
              bg: 'bg-gradient-to-b from-cyan-900 via-blue-900 to-blue-950',
              particles: 'bg-cyan-200/40 rounded-full',
              box: 'bg-gradient-to-br from-cyan-400 to-blue-600 border-cyan-200',
              boxHover: 'hover:shadow-cyan-400/50',
              modalBorder: 'border-cyan-300'
            };
          case 'royal':
          default:
            return {
              bg: 'bg-[conic-gradient(at_bottom_center,_var(--tw-gradient-stops))] from-indigo-900 via-purple-700 to-indigo-900',
              particles: 'bg-yellow-200/40 rounded-full',
              box: 'bg-gradient-to-br from-yellow-300 to-orange-500 border-white',
              boxHover: 'hover:shadow-orange-400/50',
              modalBorder: 'border-yellow-300'
            };
        }
      };"""

new_theme = """      const getThemeStyles = () => {
        switch(gameTheme) {
          case 'space':
            return {
              bg: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black',
              particles: 'bg-white/40',
              box: 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-300',
              boxHover: 'hover:shadow-indigo-500/50',
              modalBorder: 'border-indigo-400',
              boxContent: `<div class="absolute inset-0 flex items-center justify-center text-7xl opacity-50 group-hover:scale-125 transition-transform duration-500 rotate-12 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">⭐</div>`,
              letterStyle: 'absolute text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]'
            };
          case 'jungle':
            return {
              bg: 'bg-gradient-to-br from-green-900 via-emerald-800 to-green-950',
              particles: 'bg-green-300/40',
              box: 'bg-gradient-to-br from-emerald-500 to-green-600 border-green-300',
              boxHover: 'hover:shadow-green-500/50',
              modalBorder: 'border-green-400',
              boxContent: `<div class="absolute inset-0 flex items-center justify-center text-[7rem] opacity-60 group-hover:scale-125 transition-transform duration-500 -rotate-12">🌿</div>`,
              letterStyle: 'absolute text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]'
            };
          case 'ocean':
            return {
              bg: 'bg-gradient-to-b from-cyan-900 via-blue-900 to-blue-950',
              particles: 'bg-cyan-200/40 rounded-full',
              box: 'bg-gradient-to-br from-cyan-400 to-blue-600 border-cyan-200',
              boxHover: 'hover:shadow-cyan-400/50',
              modalBorder: 'border-cyan-300',
              boxContent: `<div class="absolute inset-0 flex items-center justify-center text-[6rem] opacity-60 group-hover:scale-125 transition-transform duration-500 -rotate-45 ml-2 mt-4">🏄‍♂️</div>`,
              letterStyle: 'absolute text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]'
            };
          case 'royal':
          default:
            return {
              bg: 'bg-[conic-gradient(at_bottom_center,_var(--tw-gradient-stops))] from-indigo-900 via-purple-700 to-indigo-900',
              particles: 'bg-yellow-200/40 rounded-full',
              box: 'bg-gradient-to-br from-yellow-300 to-orange-500 border-white',
              boxHover: 'hover:shadow-orange-400/50',
              modalBorder: 'border-yellow-300',
              boxContent: `<img src="https://drive.google.com/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn&sz=w2048" alt="box" referrerpolicy="no-referrer" class="absolute inset-0 w-full h-full object-cover scale-[1.65] origin-[50%_15%] group-hover:scale-[1.75] transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500"></div>`,
              letterStyle: 'absolute text-yellow-400 left-[28%] top-[50%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]'
            };
        }
      };"""

content = content.replace(old_theme, new_theme)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
