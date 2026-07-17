import re

with open('src/views/MysteryBox.tsx', 'r') as f:
    content = f.read()

# 1. Remove handleSave function completely
content = re.sub(r'  const handleSave = async \(\) => \{.*?\n  \};\n', '', content, flags=re.DOTALL)

# 2. Remove showSaveModal JSX
content = re.sub(r'      \{showSaveModal && \(\n        <div class.*?</div>\n        </div>\n      \)\}\n', '', content, flags=re.DOTALL)

with open('src/views/MysteryBox.tsx', 'w') as f:
    f.write(content)
