import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

# Add theme declaration inside renderGameScreen
render_game_start = """      const renderGameScreen = () => {
        const theme = getThemeStyles();"""
content = content.replace('      const renderGameScreen = () => {', render_game_start)

# Replace box gradient
old_box = 'bg-gradient-to-br from-yellow-300 to-orange-500 animate-box-glow text-white hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-400/50 border-4 border-white active:scale-95'
new_box = '${theme.box} animate-box-glow text-white hover:-translate-y-2 hover:shadow-2xl ${theme.boxHover} border-4 active:scale-95'
content = content.replace(old_box, new_box)

# Replace modal border
old_modal_border = 'border-[6px] border-yellow-300'
new_modal_border = 'border-[6px] ${theme.modalBorder}'
content = content.replace(old_modal_border, new_modal_border)

# Replace main bg
old_bg = 'bg-[conic-gradient(at_bottom_center,_var(--tw-gradient-stops))] from-indigo-900 via-purple-700 to-indigo-900'
new_bg = '${theme.bg}'
content = content.replace(old_bg, new_bg)

# Replace particles
old_particles = '<div class="absolute w-2 h-2 bg-yellow-200/40 rounded-full animate-float-up"'
new_particles = '<div class="absolute w-2 h-2 ${theme.particles} animate-float-up"'
content = content.replace(old_particles, new_particles)

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
