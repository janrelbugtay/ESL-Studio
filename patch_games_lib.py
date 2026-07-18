import re

with open('src/views/GamesLibrary.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace(
    'import { Gamepad2, Plus, Play, Trash2, X, Folder, FolderPlus, FolderOpen, Tag, MoreHorizontal } from "lucide-react";',
    'import { Gamepad2, Plus, Play, Trash2, X, Folder, FolderPlus, FolderOpen, Tag, MoreHorizontal, Edit2, Copy } from "lucide-react";'
)

# Add duplicate handler
handler_code = """
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
"""
content = content.replace('  const handleCreateFolder = async () => {', handler_code)

# Add buttons
buttons_code = """
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
"""
content = content.replace("""
                      {/* Move Folder Menu Toggle */}
                      <button
                        onClick={() => setGameToMove(gameToMove === game.id ? null : game.id)}
                        className={`w-12 h-12 font-bold rounded-xl transition-colors flex items-center justify-center shadow-sm relative shrink-0 ${gameToMove === game.id ? 'bg-brand-purple text-white' : 'bg-slate-100 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
                        title="Move to Folder"
                      >
                        <FolderOpen className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(game.id)}
""", buttons_code)

with open('src/views/GamesLibrary.tsx', 'w') as f:
    f.write(content)
