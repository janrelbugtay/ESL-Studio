with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'case "bubble-sentence-pro":\n        return <BubbleSentencePro onViewChange={handleViewChange} />;',
    'case "bubble-sentence-pro":\n        return <BubbleSentencePro onViewChange={handleViewChange} initialGame={selectedGame} />;'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
