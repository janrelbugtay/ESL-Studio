const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  `  | "sumo";`,
  `  | "sumo"\n  | "hamster-pop-quiz";`
);

fs.writeFileSync('src/types.ts', code);
console.log("Patched types");
