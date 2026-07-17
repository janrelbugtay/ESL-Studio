import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

content = content.replace('oninput="teams[${idx}].name = this.value; renderApp();"', 'oninput="teams[${idx}].name = this.value"')

with open('public/mystery-box.html', 'w') as f:
    f.write(content)
