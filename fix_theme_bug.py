import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

old_royal = """          case 'royal':
          default:
            return {
              bg: '${theme.bg}',
              particles: 'bg-yellow-200/40 rounded-full',
              box: 'bg-gradient-to-br from-yellow-300 to-orange-500 border-white',
              boxHover: 'hover:shadow-orange-400/50',
              modalBorder: 'border-yellow-300'
            };"""

new_royal = """          case 'royal':
          default:
            return {
              bg: 'bg-[conic-gradient(at_bottom_center,_var(--tw-gradient-stops))] from-indigo-900 via-purple-700 to-indigo-900',
              particles: 'bg-yellow-200/40 rounded-full',
              box: 'bg-gradient-to-br from-yellow-300 to-orange-500 border-white',
              boxHover: 'hover:shadow-orange-400/50',
              modalBorder: 'border-yellow-300'
            };"""

content = content.replace(old_royal, new_royal)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
