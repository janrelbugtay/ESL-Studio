import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Gamepad2, Plus, Play, Trash2 } from "lucide-react";
import { ViewState } from "../types";

export function GamesLibrary({
  onViewChange,
}: {
  onViewChange: (view: ViewState, data?: any) => void;
}) {
  const { user } = useAuth();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadGames();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadGames = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "sharkGames"),
        where("userId", "==", user!.uid),
      );
      const snapshot = await getDocs(q);
      const userGames: any[] = [];
      snapshot.forEach((doc) => {
        userGames.push({ id: doc.id, ...doc.data() });
      });
      setGames(userGames);
    } catch (error) {
      console.error("Error loading games", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        await deleteDoc(doc(db, "sharkGames", id));
        setGames(games.filter((game) => game.id !== id));
      } catch (error) {
        console.error("Error deleting game:", error);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-slate-500 font-bold text-lg bg-white p-8 rounded-2xl shadow-sm border-2 border-slate-100">
          Please sign in to view your saved games.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-[24px] shadow-sm border-2 border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">
              My Games Folder
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Manage your custom vocabulary games
            </p>
          </div>
        </div>
        <button
          onClick={() => onViewChange("shark-ladder")}
          className="flex items-center gap-2 px-5 py-3 bg-brand-purple text-white font-bold rounded-xl shadow-[0_4px_0_#4c1d95] active:translate-y-[4px] active:shadow-none hover:bg-purple-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Game
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
          <span className="font-bold text-slate-500">
            Loading your games...
          </span>
        </div>
      ) : games.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-[32px] p-16 text-center shadow-sm max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gamepad2 className="w-12 h-12 text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-700 mb-3">
            No games yet
          </h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
            You haven't created any custom games. Click the button below to
            build your first vocabulary game.
          </p>
          <button
            onClick={() => onViewChange("shark-ladder")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-purple text-white font-bold text-lg rounded-2xl shadow-[0_6px_0_#4c1d95] active:translate-y-[6px] active:shadow-none hover:bg-purple-700 transition"
          >
            Create Your First Game
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white border-2 border-slate-200 rounded-[24px] p-6 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10"></div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-xl text-slate-800 line-clamp-2 pr-2">
                    {game.name}
                  </h3>
                  <div className="w-12 h-12 bg-white shadow-sm border-2 border-slate-100 rounded-2xl flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-transform shrink-0">
                    {game.gameType === 'mystery-box' ? '🎁' : '🦈'}
                  </div>
                </div>

                <div className="space-y-3 mb-6 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="font-black text-slate-400 uppercase text-xs w-16">
                      Class
                    </span>
                    <span className="font-bold text-slate-800 truncate">
                      {game.className}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="font-black text-slate-400 uppercase text-xs w-16">
                      Topic
                    </span>
                    <span className="font-bold text-slate-800 truncate">
                      {game.topic}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="font-black text-slate-400 uppercase text-xs w-16">
                      Items
                    </span>
                    <span className="font-bold text-slate-800 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                      {game.gameType === 'mystery-box' ? game.customQuestions?.length || 0 : game.sentences?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-auto pt-2">
                <button
                  onClick={() => onViewChange((game.gameType as any) || "shark-ladder", game)}
                  className="flex-1 bg-green-500 text-white hover:bg-green-600 font-black py-3 px-4 rounded-xl shadow-[0_4px_0_#166534] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" /> Play
                </button>
                <button
                  onClick={() => handleDelete(game.id)}
                  className="w-12 h-12 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center shadow-sm"
                  title="Delete Game"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
