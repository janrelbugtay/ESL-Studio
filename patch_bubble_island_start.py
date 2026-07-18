with open('public/bubble-sentence.html', 'r') as f:
    content = f.read()

content = content.replace(
    'window.onload = () => { Game.init(); Editor.init(); };',
    "window.onload = () => { Game.init(); Editor.init(); Game.showScreen('screen-editor'); };"
)

with open('public/bubble-sentence.html', 'w') as f:
    f.write(content)
