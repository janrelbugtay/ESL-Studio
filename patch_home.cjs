const fs = require('fs');
const file = 'src/views/Home.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `    {
      id: "sumo",
      title: "Sumo Tags",
      description: "Battle it out in a tug-of-war style question tags showdown!",
      difficulty: "Medium",
      players: "2 Teams",
      time: "10m",
      subject: "Grammar",
      grade: "All",
      imageUrl: "https://drive.google.com/thumbnail?id=19zB6Kpor6pry7TV3XvX3eIZdxpd3ys40&sz=w1000",
      isAI: false,
      color: "from-indigo-600 to-red-600",
      icon: "🤼",
    },
  ];`;

const replacement = `    {
      id: "sumo",
      title: "Sumo Tags",
      description: "Battle it out in a tug-of-war style question tags showdown!",
      difficulty: "Medium",
      players: "2 Teams",
      time: "10m",
      subject: "Grammar",
      grade: "All",
      imageUrl: "https://drive.google.com/thumbnail?id=19zB6Kpor6pry7TV3XvX3eIZdxpd3ys40&sz=w1000",
      isAI: false,
      color: "from-indigo-600 to-red-600",
      icon: "🤼",
    },
    {
      id: "hamster-pop-quiz",
      title: "Hamster Pop Quiz",
      description: "Turn any video into a sunny ESL adventure with interactive pop quizzes!",
      difficulty: "Medium",
      players: "1 Player",
      time: "10-15 mins",
      subject: "Video Comprehension",
      grade: "All",
      imageUrl: "https://images.unsplash.com/photo-1425082661705-1834bfd08711?q=80&w=1000&auto=format&fit=crop",
      isAI: true,
      color: "from-sky-400 to-yellow-400",
      icon: "🐹",
    }
  ];`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
console.log("Patched Home.tsx");
