with open('src/views/NeonChain.tsx', 'r') as f:
    content = f.read()

import re
content = re.sub(r'\s*\.custom-scrollbar::-webkit-scrollbar \{.*?\}\n', '\n', content)
content = re.sub(r'\s*\.custom-scrollbar::-webkit-scrollbar-track \{.*?\}\n', '\n', content)
content = re.sub(r'\s*\.custom-scrollbar::-webkit-scrollbar-thumb \{.*?\}\n', '\n', content)

with open('src/views/NeonChain.tsx', 'w') as f:
    f.write(content)
