const fs = require('fs');
let code = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

if (!code.includes('Hamster Pop Quiz')) {
  code = code.replace(
    `{ id: "sumo", title: "Sumo", icon: "https://drive.google.com/thumbnail?id=1K0x12r32Z_l130_B_7LdC0278rUaUj8U&sz=w1000", color: "bg-red-100 text-red-600" }`,
    `{ id: "sumo", title: "Sumo", icon: "https://drive.google.com/thumbnail?id=1K0x12r32Z_l130_B_7LdC0278rUaUj8U&sz=w1000", color: "bg-red-100 text-red-600" },
    { id: "hamster-pop-quiz", title: "Hamster Pop Quiz", icon: "🐹", color: "bg-yellow-100 text-yellow-600" }`
  );

  fs.writeFileSync('src/views/GamesLibrary.tsx', code);
  console.log("Patched GamesLibrary");
} else {
  console.log("Already patched");
}
