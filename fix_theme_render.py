import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# Add getThemeStyles function
theme_fn = """      const getThemeStyles = () => {
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
      };

      const renderGameScreen = () => {"""

content = content.replace('      const renderGameScreen = () => {', theme_fn)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
