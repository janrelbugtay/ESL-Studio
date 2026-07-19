import fs from 'fs';
let code = fs.readFileSync('src/views/BubbleSentencePro.tsx', 'utf8');

const activeGameRegex = /const \[activeGame, setActiveGame\] = useState<GameData>\(\(\) => \{[\s\S]*?\}\);\n/;
const match = code.match(activeGameRegex);
if (match) {
    code = code.replace(match[0], '');
    code = code.replace('const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);', 'const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);\n  ' + match[0]);
    fs.writeFileSync('src/views/BubbleSentencePro.tsx', code);
    console.log("Fixed activeGame ordering");
}
