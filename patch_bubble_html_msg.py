with open('public/bubble-sentence.html', 'r') as f:
    content = f.read()

content = content.replace(
    'window.onload = () => { Game.init(); Editor.init(); Game.showScreen(\'screen-editor\'); };',
    '''window.addEventListener('message', e => {
            if (e.data.type === 'LOAD_GAME') {
                Storage.data.categories = [{ id: 'cat_1', name: e.data.data.topic || 'Custom Lesson', icon: '⭐', timer: 60, color: '#4285F4', x: 50, y: 50 }];
                Storage.data.sentences = e.data.data.sentences.map(s => ({ ...s, id: 's_'+Math.random(), catId: 'cat_1' }));
                Storage.save();
                Game.buildWorldMap();
                Game.showScreen('screen-menu');
            }
        });
        window.onload = () => { Game.init(); Editor.init(); Game.showScreen('screen-menu'); };'''
)

# Hide Teacher Studio button in html if we are using React editor
content = content.replace(
    '<button onclick="Game.showScreen(\'screen-editor\')" class="btn-premium px-6 py-3 text-sm">👨‍🏫 Game Setup</button>',
    '<button onclick="Game.showScreen(\'screen-editor\')" class="btn-premium px-6 py-3 text-sm hidden">👨‍🏫 Game Setup</button>'
)

with open('public/bubble-sentence.html', 'w') as f:
    f.write(content)
