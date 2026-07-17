import re

with open('src/views/MysteryBox.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
content = re.sub(r'import \{ addDoc, collection, doc, updateDoc \} from "firebase/firestore";', 
                 'import { addDoc, collection, doc, updateDoc, getDocs, query, where } from "firebase/firestore";', content)

# 2. Update handleMessage to handle folder creation
new_logic = """    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "SAVE_MYSTERY_BOX") {
        if (!user) {
          alert("You must be logged in to save games.");
          return;
        }
        const gameData = event.data.data;
        if (!gameData.topic || !gameData.className || !gameData.folder) {
          alert("Please fill out Topic, Class, and Folder in the Game Details before saving.");
          return;
        }
        setIsSaving(true);
        try {
          // Resolve folderId
          const folderName = gameData.folder.trim();
          const qFolders = query(
            collection(db, "gameFolders"),
            where("userId", "==", user.uid)
          );
          const foldersSnap = await getDocs(qFolders);
          let folderId = null;
          let folderFound = false;
          foldersSnap.forEach(d => {
            if (d.data().name.toLowerCase() === folderName.toLowerCase()) {
              folderId = d.id;
              folderFound = true;
            }
          });
          
          if (!folderFound) {
            const newFolderRef = await addDoc(collection(db, "gameFolders"), {
              userId: user.uid,
              name: folderName,
              createdAt: new Date().toISOString(),
            });
            folderId = newFolderRef.id;
          }

          const gameToSave = {
            name: gameData.topic, // use topic as name
            className: gameData.className,
            topic: gameData.topic,
            folder: folderName,
            folderId: folderId,
            gameType: "mystery-box",
            setupTeamCount: gameData.setupTeamCount,
            customQuestions: gameData.customQuestions,
            userId: user.uid,
            updatedAt: new Date().toISOString(),
          };

          if (initialGame?.id) {
            await updateDoc(doc(db, "mysteryBoxGames", initialGame.id), gameToSave);
            alert("Game updated successfully!");
          } else {
            await addDoc(collection(db, "mysteryBoxGames"), {
              ...gameToSave,
              createdAt: new Date().toISOString(),
            });
            alert("Game saved successfully!");
          }
          onViewChange("games");
        } catch (error) {
          console.error("Error saving game:", error);
          alert("Error saving game.");
        } finally {
          setIsSaving(false);
        }
      }
    };"""

content = re.sub(r'    const handleMessage = async \(event: MessageEvent\) => \{.*?setIsSaving\(false\);\n        \}\n      \}\n    \};', new_logic, content, flags=re.DOTALL)

with open('src/views/MysteryBox.tsx', 'w') as f:
    f.write(content)
