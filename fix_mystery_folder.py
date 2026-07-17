import re

with open('src/views/MysteryBox.tsx', 'r') as f:
    content = f.read()

# Fix validation
content = content.replace(
    'if (!gameData.topic || !gameData.className || !gameData.folder) {',
    'if (!gameData.topic || !gameData.className || gameData.folder === undefined) {'
)

# Fix folderId resolution
folder_logic = """          const folderName = (gameData.folder || "").trim();
          let folderId = null;

          if (folderName) {
            const qFolders = query(
              collection(db, "gameFolders"),
              where("userId", "==", user.uid)
            );
            const foldersSnap = await getDocs(qFolders);
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
          }"""

old_folder_logic = """          const folderName = gameData.folder.trim();
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
          }"""

content = content.replace(old_folder_logic, folder_logic)

with open('src/views/MysteryBox.tsx', 'w') as f:
    f.write(content)
