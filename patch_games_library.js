const fs = require('fs');
const file = 'src/views/GamesLibrary.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `    { id: "sumo", title: "Sumo Tags", icon: "https://drive.google.com/thumbnail?id=19zB6Kpor6pry7TV3XvX3eIZdxpd3ys40&sz=w1000", color: "bg-red-100 text-red-600" },
  ];`;

const replacement = `    { id: "sumo", title: "Sumo Tags", icon: "https://drive.google.com/thumbnail?id=19zB6Kpor6pry7TV3XvX3eIZdxpd3ys40&sz=w1000", color: "bg-red-100 text-red-600" },
    { id: "hamster-pop-quiz", title: "Hamster Pop Quiz", icon: "🐹", color: "bg-yellow-100 text-yellow-600" },
  ];`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
console.log("Patched GamesLibrary");
