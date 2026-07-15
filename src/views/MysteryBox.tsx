import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { ViewState } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

export function MysteryBox({
  onViewChange,
  initialGame,
}: {
  onViewChange: (view: ViewState) => void;
  initialGame?: any;
}) {
  const { user } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingGameData, setPendingGameData] = useState<any>(null);
  const [saveForm, setSaveForm] = useState({
    name: initialGame?.name || "",
    className: initialGame?.className || "",
    topic: initialGame?.topic || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SAVE_MYSTERY_BOX") {
        if (!user) {
          alert("You must be logged in to save games.");
          return;
        }
        setPendingGameData(event.data.data);
        setShowSaveModal(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    if (!saveForm.name || !saveForm.className || !saveForm.topic) {
      alert("Please fill out Name, Class, and Topic.");
      return;
    }

    setIsSaving(true);
    try {
      const gameToSave = {
        ...saveForm,
        gameType: "mystery-box",
        setupTeamCount: pendingGameData.setupTeamCount,
        customQuestions: pendingGameData.customQuestions,
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

      setShowSaveModal(false);
      onViewChange("games");
    } catch (error) {
      console.error("Error saving game:", error);
      alert("Error saving game.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // If we have an initial game, send it to the iframe once it's loaded
    const handleIframeLoad = () => {
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
      </div>
      <iframe
        ref={iframeRef}
        src="/mystery-box.html"
        className="w-full flex-1 border-none bg-slate-50"
        title="Mystery Box Game"
      />

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowSaveModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Save className="w-6 h-6 text-blue-500" /> Save Mystery Box
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Game Name
                </label>
                <input
                  type="text"
                  value={saveForm.name}
                  onChange={(e) =>
                    setSaveForm({ ...saveForm, name: e.target.value })
                  }
                  className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none bg-slate-50"
                  placeholder="e.g., Unit 1 Review"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  value={saveForm.className}
                  onChange={(e) =>
                    setSaveForm({ ...saveForm, className: e.target.value })
                  }
                  className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none bg-slate-50"
                  placeholder="e.g., Grade 3 English"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={saveForm.topic}
                  onChange={(e) =>
                    setSaveForm({ ...saveForm, topic: e.target.value })
                  }
                  className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none bg-slate-50"
                  placeholder="e.g., Present Continuous"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-xl mt-4 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Game"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
