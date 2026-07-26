const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    'return <HamsterPopQuiz onViewChange={handleViewChange} />;',
    'return <HamsterPopQuiz onViewChange={handleViewChange} initialGame={selectedGame} />;'
);

fs.writeFileSync(file, code);
console.log("Patched App.tsx for Hamster");
