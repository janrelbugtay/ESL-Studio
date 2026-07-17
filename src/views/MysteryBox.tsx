import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { ViewState } from "../types";
import { FullscreenButton } from "../components/FullscreenButton";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { addDoc, collection, doc, updateDoc, getDocs, query, where } from "firebase/firestore";

export function MysteryBox({
  onViewChange,
  initialGame,
}: {
  onViewChange: (view: ViewState) => void;
  initialGame?: any;
}) {
  const { user } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchFolders = async () => {
        const qFolders = query(collection(db, "gameFolders"), where("userId", "==", user.uid));
        const foldersSnap = await getDocs(qFolders);
        const f: any[] = [];
        foldersSnap.forEach(doc => f.push({ id: doc.id, ...doc.data() }));
        setFolders(f);
      };
      fetchFolders();
    }
  }, [user]);

  useEffect(() => {
    if (iframeLoaded && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "SET_FOLDERS", data: folders },
        "*"
      );
    }
  }, [folders, iframeLoaded]);


  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "SAVE_MYSTERY_BOX") {
        if (!user) {
          alert("You must be logged in to save games.");
          return;
        }
        const gameData = event.data.data;
        if (!gameData.topic || !gameData.className || gameData.folder === undefined) {
          alert("Please fill out Topic, Class, and Folder in the Game Details before saving.");
          return;
        }
        setIsSaving(true);
        try {
          // Resolve folderId
          const folderName = (gameData.folder || "").trim();
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
          }

          const gameToSave = {
            name: gameData.topic, // use topic as name
            className: gameData.className,
            topic: gameData.topic,
            folder: folderName,
            folderId: folderId,
            gameType: "mystery-box",
            theme: gameData.theme,
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
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [user, initialGame, onViewChange]);


  useEffect(() => {
    // If we have an initial game, send it to the iframe once it's loaded
    const handleIframeLoad = () => {
      setIframeLoaded(true);
      if (initialGame && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: "LOAD_MYSTERY_BOX", data: initialGame },
          "*",
        );
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);
    }
    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad);
      }
    };
  }, [initialGame]);

  return (
    <div className="w-full h-full flex flex-col -mx-4 md:-mx-8 -my-4 md:-my-8 relative">
      <div className="p-4 bg-white border-b flex items-center shadow-sm z-10">
        <button
          onClick={() => onViewChange("home")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
        <h1 className="ml-4 font-black text-xl text-slate-800">
          Mystery Box Game
        </h1>
        <div className="ml-auto flex items-center"><FullscreenButton targetId="game-container" /></div>
      </div>
      <iframe
        ref={iframeRef}
        src="/mystery-box.html"
        className="w-full flex-1 border-none bg-slate-50"
        title="Mystery Box Game"
      />

    </div>
  );
}
