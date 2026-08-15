import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play, Users, Clock } from "lucide-react";
import { Game, ViewState } from "../types";
import { cn } from "../lib/utils";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

export function Home({
  onViewChange,
}: {
  onViewChange?: (view: ViewState) => void;
}) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <FeaturedGamesSection onViewChange={onViewChange} />
    </div>
  );
}

function FeaturedGamesSection({
  onViewChange,
}: {
  onViewChange?: (view: ViewState) => void;
}) {
  const { user } = useAuth();
  const isAdmin = Boolean(user && !user.isAnonymous && user.email?.toLowerCase().trim() === "janrelbugtay03@gmail.com");
  const [publishedGames, setPublishedGames] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        setPublishedGames(doc.data().publishedGames || {});
      }
    });
    return () => unsub();
  }, []);

  const allGames: Game[] = [
    {
      id: "mystery-box",
      title: "Mystery Box",
      description:
        "Answer questions to open mystery boxes containing points or penalties!",
      difficulty: "Medium",
      players: "2-4 Teams",
      time: "15m",
      subject: "Trivia",
      grade: "A2-B1",
      imageUrl: "https://drive.google.com/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn&sz=w1000",
      isAI: false,
      color: "from-orange-400 to-yellow-500",
      icon: "🎁",
    },
    {
      id: "neon-chain",
      title: "Neon Chain",
      description:
        "Link words together in this futuristic vocabulary challenge!",
      difficulty: "Medium",
      players: "2-4 Teams",
      time: "10m",
      subject: "Vocabulary",
      grade: "A2-C1",
      imageUrl: "https://drive.google.com/thumbnail?id=1kovfYZSlp6X8HTqQ9OF_gSpf3wgJgNYG&sz=w1000",
      isAI: false,
      color: "from-cyan-400 to-purple-500",
      icon: "⚡",
    },
    {
      id: "bubble-pop",
      title: "Bubble Pop",
      description:
        "Use your finger on camera to pop the correct bubble!",
      difficulty: "Easy",
      players: "1-2 Players",
      time: "5m",
      subject: "Grammar",
      grade: "A1-B1",
      imageUrl: "https://drive.google.com/thumbnail?id=1AHwLQ7lCIsKt9fzMlWAJWMnRCfFE4mE-&sz=w1000",
      isAI: false,
      color: "from-blue-400 to-cyan-400",
      icon: "🫧",
    },
    {
      id: "flashcards-match",
      title: "Flashcards Match",
      description:
        "Create study sets and play memory matching games!",
      difficulty: "Easy",
      players: "1 Player",
      time: "5-10m",
      subject: "Vocabulary",
      grade: "All",
      imageUrl: "https://drive.google.com/thumbnail?id=1UtaZtVX0onrqj3VorxedOxy1iVXdFAHk&sz=w1000",
      isAI: false,
      color: "from-indigo-400 to-purple-500",
      icon: "🎴",
    },
    {
      id: "bubble-sentence-pro",
      title: "Bubble Island",
      description:
        "Pop bubbles in the correct order to form sentences. Includes a Teacher Studio!",
      difficulty: "Medium",
      players: "1 Player / Class",
      time: "10m",
      subject: "Grammar",
      grade: "A1-B1",
      imageUrl: "https://drive.google.com/thumbnail?id=136UAXGhVDr4ZhJd3bRABHDKp40RJIQSJ&sz=w1000",
      isAI: false,
      color: "from-blue-500 to-sky-300",
      icon: "🎈",
    },
    {
      id: "yoga-quiz",
      title: "Yoga Quiz",
      description:
        "Test your grammar with this relaxing yet challenging vocabulary quiz!",
      difficulty: "Medium",
      players: "1 Player",
      time: "10m",
      subject: "Grammar",
      grade: "All",
      imageUrl: "https://drive.google.com/thumbnail?id=16viKskpD4hXygTg-0UaGSjfrWibNoqeQ&sz=w1000",
      isAI: false,
      color: "from-teal-400 to-emerald-500",
      icon: "🧘‍♀️",
    },
    {
      id: "family-feud",
      title: "Family Feud",
      description: "Survey says! Compete to find the most popular answers to fun questions.",
      difficulty: "Medium",
      players: "2 Teams",
      time: "15m",
      subject: "Vocabulary",
      grade: "All",
      imageUrl: "https://drive.google.com/thumbnail?id=1DDWdERo9zS6SEbpXA7J8FSh__1CNqxZN&sz=w1000",
      isAI: false,
      color: "from-yellow-400 to-orange-500",
      icon: "👨‍👩‍👧‍👦",
    },
    {
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
    },
    {
      id: "letter-lock",
      title: "Letter Lock",
      description: "Spin the wheel, guess the word, and beat the timer in this fast-paced letter game!",
      difficulty: "Medium",
      players: "2 Teams",
      time: "15m",
      subject: "Vocabulary",
      grade: "All",
      imageUrl: "https://ui-avatars.com/api/?name=Letter+Lock&background=38bdf8&color=fff&size=512",
      isAI: false,
      color: "from-sky-400 to-blue-600",
      icon: "🎯",
    },
    {
      id: "student-race",
      title: "Name Picker",
      description: "Pick a student. Start a race. Make every classroom activity exciting.",
      difficulty: "Easy",
      players: "Classroom",
      time: "5m",
      subject: "Classroom Management",
      grade: "All",
      imageUrl: "https://images.unsplash.com/photo-1541604193435-22287d32c2c2?q=80&w=1000&auto=format&fit=crop",
      isAI: false,
      color: "from-indigo-600 to-yellow-400",
      icon: "🏎️",
    }
  ];

  const games = allGames.filter(g => isAdmin || publishedGames[g.id] !== false);

  return (
    <section className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, idx) => (
          <GameCard
            key={game.id}
            game={game}
            delay={idx * 0.1}
            onViewChange={onViewChange}
          />
        ))}
      </div>
    </section>
  );
}

function GameCard({
  game,
  delay,
  onViewChange,
}: {
  key?: string;
  game: Game & { icon?: string };
  delay: number;
  onViewChange?: (view: ViewState) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      onClick={() => onViewChange && onViewChange(game.id as ViewState)}
      className="w-full relative aspect-[1000/791] bg-white dark:bg-slate-800 border-[6px] border-white rounded-[40px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] group hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] ring-1 ring-slate-100 transition-all duration-300 cursor-pointer"
    >
      {game.imageUrl ? (
        <>
          <img
            src={game.imageUrl}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-[1.12] group-hover:scale-[1.20] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-brand-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-purple shadow-lg transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-75">
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        </>
      ) : (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center bg-gradient-to-br",
            game.color,
          )}
        >
          {game.icon?.startsWith("http") ? (
             <img src={game.icon} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover group-hover:scale-[1.03] group-hover:scale-[1.20] transition-transform duration-500" />
          ) : (
            <span className="text-7xl drop-shadow-md group-hover:scale-[1.20] transition-transform duration-500">
              {game.icon}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
