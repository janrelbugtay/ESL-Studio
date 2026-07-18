import re
import os

files_to_patch = [
    'src/views/AdminDashboard.tsx',
    'src/views/FlashcardsMatch.tsx',
    'src/views/NeonChain.tsx',
    'src/views/YogaQuiz.tsx'
]

for file_path in files_to_patch:
    with open(file_path, 'r') as f:
        content = f.read()

    # Remove the block of custom-scrollbar CSS
    content = re.sub(r'\s*\.custom-scrollbar::-webkit-scrollbar \{.*?\n\s*\.custom-scrollbar::-webkit-scrollbar-thumb:hover \{.*?\}', '', content, flags=re.DOTALL)

    with open(file_path, 'w') as f:
        f.write(content)
