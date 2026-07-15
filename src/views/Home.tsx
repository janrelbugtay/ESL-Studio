import React from "react";
import { motion } from "motion/react";
import { Play, Users, Clock } from "lucide-react";
import { Game, ViewState } from "../types";
import { cn } from "../lib/utils";

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
  const games: Game[] = [
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
      imageUrl:
        "https://drive.google.com/thumbnail?id=1ow-oY-KHIgUk5ptEfIf62havduvAnPrZ&sz=w1000",
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
      imageUrl: "https://drive.google.com/thumbnail?id=1SwpHu56pONLE8PoHtKa2ksedp8jx3sTp&sz=w1000",
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
      imageUrl: "",
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
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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
      imageUrl: "",
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
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isAI: false,
      color: "from-teal-400 to-emerald-500",
      icon: "🧘‍♀️",
    },
  ];

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
      className="w-full bg-white border border-[#e2e8f0] rounded-[32px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.06)] group hover:-translate-y-1 transition-transform flex flex-col cursor-pointer"
    >
      {game.imageUrl ? (
        <img
          src={game.imageUrl}
          alt={game.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          <div
            className={cn(
              "h-36 relative flex items-center justify-center bg-gradient-to-br",
              game.color,
            )}
          >
            <span className="text-6xl drop-shadow-md group-hover:scale-110 transition-transform duration-500">
              {game.icon}
            </span>
          </div>

          <div className="p-6 flex-1 flex items-center justify-center">
            <h3 className="font-bold text-xl text-slate-800 text-center">
              {game.title}
            </h3>
          </div>
        </>
      )}
    </motion.div>
  );
}
