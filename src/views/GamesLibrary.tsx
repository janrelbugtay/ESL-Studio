import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Gamepad2, Plus, Play, Trash2, X, Folder, FolderPlus, FolderOpen, Tag, MoreHorizontal, Edit2, Copy } from "lucide-react";
import { ViewState } from "../types";

export function GamesLibrary({
  onViewChange,
}: {
  onViewChange: (view: ViewState, data?: any) => void;
}) {
  const { user } = useAuth();
  const [games, setGames] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [gameToMove, setGameToMove] = useState<string | null>(null);

  const [publishedGames, setPublishedGames] = useState<Record<string, boolean>>({});
  const isAdmin = Boolean(user && !user.isAnonymous && user.email?.toLowerCase().trim() === "janrelbugtay03@gmail.com");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        setPublishedGames(doc.data().publishedGames || {});
      }
    });
    return () => unsub();
  }, []);

  const allGameTemplates = [
    { id: "mystery-box", title: "Mystery Box", icon: "https://drive.google.com/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn&sz=w1000", color: "bg-orange-100 text-orange-600" },
    { id: "neon-chain", title: "Neon Chain", icon: "https://drive.google.com/thumbnail?id=1kovfYZSlp6X8HTqQ9OF_gSpf3wgJgNYG&sz=w1000", color: "bg-cyan-100 text-cyan-600" },
    { id: "bubble-pop", title: "Bubble Pop", icon: "https://drive.google.com/thumbnail?id=1AHwLQ7lCIsKt9fzMlWAJWMnRCfFE4mE-&sz=w1000", color: "bg-blue-100 text-blue-600" },
    { id: "flashcards-match", title: "Flashcards Match", icon: "https://drive.google.com/thumbnail?id=1UtaZtVX0onrqj3VorxedOxy1iVXdFAHk&sz=w1000", color: "bg-indigo-100 text-indigo-600" },
    { id: "bubble-sentence-pro", title: "Bubble Island", icon: "https://drive.google.com/thumbnail?id=136UAXGhVDr4ZhJd3bRABHDKp40RJIQSJ&sz=w1000", color: "bg-sky-100 text-sky-600" },
    { id: "yoga-quiz", title: "Yoga Quiz", icon: "https://drive.google.com/thumbnail?id=16viKskpD4hXygTg-0UaGSjfrWibNoqeQ&sz=w1000", color: "bg-emerald-100 text-emerald-600" },
    { id: "family-feud", title: "Family Feud", icon: "https://drive.google.com/thumbnail?id=1DDWdERo9zS6SEbpXA7J8FSh__1CNqxZN&sz=w1000", color: "bg-yellow-100 text-yellow-600" },
    { id: "sumo", title: "Sumo Tags", icon: "https://drive.google.com/thumbnail?id=19zB6Kpor6pry7TV3XvX3eIZdxpd3ys40&sz=w1000", color: "bg-red-100 text-red-600" },
    { id: "letter-lock", title: "Letter Lock", icon: "https://ui-avatars.com/api/?name=Letter+Lock&background=38bdf8&color=fff&size=512", color: "bg-sky-100 text-sky-600" },
    { id: "hamster-pop-quiz", title: "Hamster Pop Quiz", icon: "https://images.unsplash.com/photo-1425082661705-1834bfd08711?q=80&w=1000&auto=format&fit=crop", color: "bg-yellow-100 text-yellow-600" },
    { id: "student-race", title: "Name Picker", icon: "https://images.unsplash.com/photo-1541604193435-22287d32c2c2?q=80&w=1000&auto=format&fit=crop", color: "bg-indigo-100 text-indigo-600" },
  ];

  const gameTemplates = allGameTemplates.filter(g => isAdmin || publishedGames[g.id] !== false);

  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const qGames = query(
        collection(db, "mysteryBoxGames"),
        where("userId", "==", user!.uid),
      );
      const qFolders = query(
        collection(db, "gameFolders"),
        where("userId", "==", user!.uid),
      );
      
      const [gamesSnap, foldersSnap] = await Promise.all([
        getDocs(qGames),
        getDocs(qFolders)
      ]);

      const userGames: any[] = [];
      gamesSnap.forEach((doc) => {
        userGames.push({ id: doc.id, ...doc.data() });
      });
      
      const userFolders: any[] = [];
      foldersSnap.forEach((doc) => {
        userFolders.push({ id: doc.id, ...doc.data() });
      });

      setGames(userGames);
      setFolders(userFolders.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Error loading library data", error);
    }
    setLoading(false);
  };


  const handleDuplicateGame = async (game: any) => {
    try {
      const { id, ...gameData } = game;
      const newGame = {
        ...gameData,
        topic: `${gameData.topic || gameData.name || 'Game'} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "mysteryBoxGames"), newGame);
      setGames([{ id: docRef.id, ...newGame }, ...games]);
    } catch (error) {
      console.error("Error duplicating game", error);
    }
  };

  const handleCreateFolder = async () => {

    if (!newFolderName.trim()) return;
    try {
      const newFolder = {
        name: newFolderName.trim(),
        userId: user!.uid,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "gameFolders"), newFolder);
      setFolders([...folders, { id: docRef.id, ...newFolder }].sort((a, b) => a.name.localeCompare(b.name)));
      setShowNewFolderModal(false);
      setNewFolderName("");
    } catch (err) {
      console.error("Error creating folder", err);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolderToDelete(folderId);
  };

  const confirmDeleteFolder = async (folderId: string) => {
    try {
      await deleteDoc(doc(db, "gameFolders", folderId));
      setFolders(folders.filter(f => f.id !== folderId));
      if (selectedFolderId === folderId) setSelectedFolderId(null);
      
      // Remove folderId from games that had it
      const updatedGames = games.map(g => g.folderId === folderId ? { ...g, folderId: null } : g);
      setGames(updatedGames);
      
      // Also update backend
      const gamesInFolder = games.filter(g => g.folderId === folderId);
      for (const g of gamesInFolder) {
         await updateDoc(doc(db, "mysteryBoxGames", g.id), { folderId: null });
      }
    } catch (err) {
      console.error("Error deleting folder", err);
    }
    setFolderToDelete(null);
  };

  const handleMoveGame = async (folderId: string | null) => {
    if (!gameToMove) return;
    try {
      await updateDoc(doc(db, "mysteryBoxGames", gameToMove), { folderId });
      setGames(games.map(g => g.id === gameToMove ? { ...g, folderId } : g));
      setGameToMove(null);
    } catch (err) {
      console.error("Error moving game", err);
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "mysteryBoxGames", id));
      setGames(games.filter((game) => game.id !== id));
    } catch (error) {
      console.error("Error deleting game:", error);
    }
    setGameToDelete(null);
  };

  const handleDelete = (id: string) => {
    setGameToDelete(id);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-slate-700">
          Please sign in to view your saved games.
        </p>
      </div>
    );
  }

  const filteredGames = selectedFolderId 
    ? games.filter(g => g.folderId === selectedFolderId)
    : games.filter(g => !g.folderId);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col gap-8">
      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8 bg-white dark:bg-slate-800 p-6 rounded-[24px] shadow-sm border-2 border-slate-100 dark:border-slate-700 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {selectedFolderId && (
              <button 
                onClick={() => setSelectedFolderId(null)}
                className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0"
              >
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            )}
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-slate-200">
                {selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name || 'Folder' : 'My Games Folder'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                {selectedFolderId ? `${filteredGames.length} ${filteredGames.length === 1 ? 'game' : 'games'}` : 'Manage your custom vocabulary games'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!selectedFolderId && (
              <button
                onClick={() => setShowNewFolderModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
              >
                <FolderPlus className="w-5 h-5" />
                <span className="hidden sm:inline">New Folder</span>
              </button>
            )}
            {selectedFolderId && (
              <button
                onClick={() => handleDeleteFolder(selectedFolderId)}
                className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition"
              >
                <Trash2 className="w-5 h-5" />
                <span className="hidden sm:inline">Delete Folder</span>
              </button>
            )}
            <button
              onClick={() => setShowNewGameModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-brand-purple text-white font-bold rounded-xl shadow-[0_4px_0_#4c1d95] active:translate-y-[4px] active:shadow-none hover:bg-purple-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Game</span>
            </button>
          </div>
        </div>

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
          <span className="font-bold text-slate-500 dark:text-slate-400">
            Loading your games...
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {!selectedFolderId && folders.length > 0 && (
            <div>
              <h2 className="text-lg font-black text-slate-400 uppercase tracking-wider mb-4 px-2">Folders</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolderId(folder.id)}
                    className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-[20px] p-5 hover:border-brand-purple hover:shadow-lg transition-all duration-300 flex items-center gap-4 group text-left"
                  >
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center group-hover:scale-[1.20] transition-transform shrink-0">
                      <Folder className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 truncate">{folder.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                        {games.filter(g => g.folderId === folder.id).length} games
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            {!selectedFolderId && folders.length > 0 && filteredGames.length > 0 && (
              <h2 className="text-lg font-black text-slate-400 uppercase tracking-wider mb-4 px-2">Games</h2>
            )}
            
            {filteredGames.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-[32px] p-16 text-center shadow-sm max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gamepad2 className="w-12 h-12 text-slate-300" />
                </div>
                <h2 className="text-2xl font-black text-slate-700 mb-3">
                  No games yet
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">
                  {selectedFolderId 
                     ? "This folder is empty. Create a new game or move an existing one here."
                     : "You haven't created any custom games here. Click the button below to build your first vocabulary game."}
                </p>
                <button
                  onClick={() => setShowNewGameModal(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-purple text-white font-bold text-lg rounded-2xl shadow-[0_6px_0_#4c1d95] active:translate-y-[6px] active:shadow-none hover:bg-purple-700 transition"
                >
                  Create Your First Game
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <div
                    key={game.id}
                    className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-[24px] p-6 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative z-10"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 rounded-tr-[22px] overflow-hidden"></div>
      
                    <div className="flex-1 flex flex-col">
                      <div className="mb-2 flex items-center gap-2 flex-wrap text-xs font-bold z-20 relative">
                        <span className="px-2 py-1 bg-brand-purple/10 text-brand-purple rounded-md uppercase tracking-wide">
                          {game.name || 'Untitled Game'}
                        </span>
                        {game.folderId && folders.find(f => f.id === game.folderId) ? (
                           <button 
                             onClick={(e) => { e.stopPropagation(); setSelectedFolderId(game.folderId); }}
                             className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md flex items-center gap-1 hover:bg-blue-100 transition-colors"
                           >
                             <Folder className="w-3 h-3" />
                             <span className="truncate max-w-[100px]">{folders.find(f => f.id === game.folderId)?.name}</span>
                           </button>
                        ) : (
                           <span className="px-2 py-1 bg-slate-100 text-slate-500 dark:text-slate-400 rounded-md">
                             Uncategorized
                           </span>
                        )}
                      </div>

                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-black text-xl text-slate-800 dark:text-slate-200 line-clamp-2 pr-2">
                          {game.topic || 'No Topic'}
                        </h3>
                        <div className="w-20 h-20 bg-white dark:bg-slate-800 shadow-sm border-2 border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center font-bold text-5xl group-hover:scale-[1.10] transition-transform shrink-0 z-20 relative overflow-hidden">
                          {(() => { const icon = gameTemplates.find(t => t.id === game.gameType)?.icon || '🎮'; return icon.startsWith("http") || icon.startsWith("/") ? <img src={icon} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover" /> : icon; })()}
                        </div>
                      </div>
      
                      <div className="space-y-3 mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-slate-100 dark:border-slate-700 mt-auto">
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-black text-slate-400 uppercase text-xs w-16">
                            Class
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {game.className}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-black text-slate-400 uppercase text-xs w-16">
                            Items
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                            {game.gameType === 'mystery-box' ? game.customQuestions?.length || 0 : game.sentences?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
      
                    <div className="flex gap-2 mt-auto pt-2 relative z-20">
                      <button
                        onClick={() => onViewChange((game.gameType as any) || "mystery-box", game)}
                        className="flex-1 bg-green-500 text-white hover:bg-green-600 font-black py-3 px-4 rounded-xl shadow-[0_4px_0_#166534] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5 fill-current" /> Play
                      </button>
      
                      {/* Move Folder Menu Toggle */}
                      <button
                        onClick={() => setGameToMove(gameToMove === game.id ? null : game.id)}
                        className={`w-12 h-12 font-bold rounded-xl transition-colors flex items-center justify-center shadow-sm relative shrink-0 ${gameToMove === game.id ? 'bg-brand-purple text-white' : 'bg-slate-100 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
                        title="Move to Folder"
                      >
                        <FolderOpen className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => onViewChange((game.gameType as any) || "mystery-box", { ...game, editMode: true })}
                        className="w-12 h-12 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center shadow-sm shrink-0"
                        title="Edit Game"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDuplicateGame(game)}
                        className="w-12 h-12 bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center shadow-sm shrink-0"
                        title="Duplicate Game"
                      >
                        <Copy className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(game.id)}
                        className="w-12 h-12 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center shadow-sm shrink-0"
                        title="Delete Game"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      
                      {/* Folder Selection Popup */}
                      {gameToMove === game.id && (
                         <div className="absolute bottom-16 right-0 w-48 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden z-30 flex flex-col">
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Move to...
                            </div>
                            <div className="max-h-48 overflow-y-auto custom-scrollbar">
                               <button 
                                  onClick={() => handleMoveGame(null)}
                                  className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 text-sm font-medium text-slate-700 flex items-center gap-2"
                               >
                                  <Gamepad2 className="w-4 h-4 text-slate-400" />
                                  All Games
                               </button>
                               {folders.map(f => (
                                  <button
                                     key={f.id}
                                     onClick={() => handleMoveGame(f.id)}
                                     className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 text-sm font-medium text-slate-700 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700"
                                  >
                                     <Folder className="w-4 h-4 text-slate-400" />
                                     <span className="truncate">{f.name}</span>
                                  </button>
                               ))}
                            </div>
                         </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </div>

      {/* New Game Template Modal */}
      {showNewGameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative border-4 border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setShowNewGameModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-2">
              Select Game Template
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
              Choose a game type to start building your custom lesson.
            </p>
            <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {gameTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setShowNewGameModal(false);
                    onViewChange(template.id as ViewState);
                  }}
                  className="flex flex-col items-center p-0 rounded-[40px] border-[6px] border-white bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2 ring-1 ring-slate-100 transition-all duration-300 text-center group overflow-hidden aspect-[1000/791] relative cursor-pointer"
                >
                  {template.icon.startsWith("http") || template.icon.startsWith("/") ? (
                    <>
                      <img src={template.icon} referrerPolicy="no-referrer" alt={template.title} className="w-full h-full object-cover scale-[1.12] group-hover:scale-[1.20] transition-transform duration-700" />
                      <div className="absolute inset-0 bg-brand-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-purple shadow-lg transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-75">
                          <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-5xl shadow-sm ${template.color}`}>
                      <span className="group-hover:scale-[1.20] transition-transform">{template.icon}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {gameToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative border-4 border-slate-100 dark:border-slate-700 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-2">Delete Game?</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
              Are you sure you want to delete this game? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setGameToDelete(null)}
                className="px-6 py-3 bg-slate-100 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(gameToDelete)}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-[0_4px_0_#991b1b] active:translate-y-[4px] active:shadow-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Folder Modal */}
      {folderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative border-4 border-slate-100 dark:border-slate-700 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-2">Delete Folder?</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
              Are you sure you want to delete this folder? Your games inside will be moved to 'All Games'.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setFolderToDelete(null)}
                className="px-6 py-3 bg-slate-100 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteFolder(folderToDelete)}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-[0_4px_0_#991b1b] active:translate-y-[4px] active:shadow-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative border-4 border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setShowNewFolderModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-2">New Folder</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">Create a folder to organize your games.</p>
            
            <input 
              type="text" 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Unit 5 Review"
              className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl mb-6 font-bold text-slate-700 focus:outline-none focus:border-brand-purple"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            
            <button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="w-full py-4 bg-brand-purple text-white font-bold text-lg rounded-xl shadow-[0_4px_0_#4c1d95] active:translate-y-[4px] active:shadow-none hover:bg-purple-700 transition disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_#4c1d95]"
            >
              Create Folder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
