import re
with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

new_style = """
        .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
        }
        .dark .glass-panel {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
"""

content = re.sub(
    r'\.glass-panel\s*\{\s*background: rgba\(255, 255, 255, 0\.1\);\s*backdrop-filter: blur\(12px\);\s*-webkit-backdrop-filter: blur\(12px\);\s*border: 1px solid rgba\(255, 255, 255, 0\.2\);\s*box-shadow: 0 8px 32px 0 rgba\(0, 0, 0, 0\.3\);\s*\}',
    new_style.strip(),
    content
)

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
