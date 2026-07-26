const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('HamsterPopQuiz')) {
  code = code.replace(
    `import { Sumo } from "./views/Sumo";`,
    `import { Sumo } from "./views/Sumo";\nimport { HamsterPopQuiz } from "./views/HamsterPopQuiz";`
  );

  code = code.replace(
    `      case "sumo":
        return <Sumo onViewChange={handleViewChange} />;`,
    `      case "sumo":
        return <Sumo onViewChange={handleViewChange} />;
      case "hamster-pop-quiz":
        return <HamsterPopQuiz onViewChange={handleViewChange} />;`
  );
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched App.tsx");
} else {
  console.log("Already patched");
}
