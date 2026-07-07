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
      id: "shark-ladder",
      title: "Shark Ladder",
      description:
        "Climb the ladder by answering vocabulary questions, but don't get eaten!",
      difficulty: "Medium",
      players: "2 Teams",
      time: "15m",
      subject: "Vocabulary",
      grade: "A2-B1",
      imageUrl:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800&h=500",
      isAI: false,
      color: "from-blue-400 to-sky-600",
      icon: "🦈",
    },
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
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800&h=500",
      isAI: false,
      color: "from-orange-400 to-yellow-500",
      icon: "🎁",
    },
  ];

  return (
    <section className="py-6">
      <div className="flex flex-col md:flex-row gap-6">
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
      className="w-full md:w-1/3 bg-white border border-[#e2e8f0] rounded-[32px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.06)] group hover:-translate-y-1 transition-transform flex flex-col cursor-pointer"
    >
      <div
        className={cn(
          "h-36 relative flex items-center justify-center bg-gradient-to-br",
          game.color,
        )}
      >
        <span className="text-6xl drop-shadow-md group-hover:scale-110 transition-transform duration-500">
          {game.icon}
        </span>

        {game.isPopular && (
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white font-bold uppercase tracking-wider">
            Popular
          </div>
        )}
        {game.isAI && (
          <div className="absolute top-4 right-4 bg-brand-purple px-2.5 py-1 rounded-lg text-[10px] text-white font-bold uppercase tracking-wider shadow-sm">
            AI Magic
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg leading-tight text-slate-800">
            {game.title}
          </h3>
          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-lg",
              game.grade.includes("A2")
                ? "text-brand-green bg-green-50"
                : "text-brand-purple bg-purple-50",
            )}
          >
            {game.grade}
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-6 flex-1">{game.description}</p>

        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mt-auto">
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {game.time}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={14} /> {game.players}
          </span>
          <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-brand-purple hover:text-white transition-colors">
            <Play size={12} className="ml-0.5" fill="currentColor" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
