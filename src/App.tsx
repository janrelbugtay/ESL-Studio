/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ViewState } from "./types";
import { Navigation, Header } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { Home } from "./views/Home";
import { AIGenerator } from "./views/AIGenerator";
import { AdminDashboard } from "./views/AdminDashboard";
import { UserDashboard } from "./views/UserDashboard";
import { GamesLibrary } from "./views/GamesLibrary";
import { MysteryBox } from "./views/MysteryBox";
import { MediaStudio } from "./views/MediaStudio";
import { NeonChain } from "./views/NeonChain";
import { BubblePop } from "./views/BubblePop";
import { FlashcardsMatch } from "./views/FlashcardsMatch";
import { YogaQuiz } from "./views/YogaQuiz";
import { BubbleSentencePro } from "./views/BubbleSentencePro";
import { FamilyFeud } from "./views/FamilyFeud";
import { Sumo } from "./views/Sumo";
import { useAuth } from "./contexts/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./lib/firebase";
import { AlertTriangle } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signInWithGoogle } = useAuth();
  
  const isAdmin = user?.email === "janrelbugtay03@gmail.com";

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        setIsMaintenanceMode(doc.data().maintenanceMode === true);
      }
    });
    return () => unsub();
  }, []);

  const handleViewChange = (view: ViewState, data?: any) => {
    setCurrentView(view);
    if (data) {
      setSelectedGame(data);
    } else {
      setSelectedGame(null);
    }
  };

  const renderView = () => {
    if (!user && currentView !== "home") {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] p-4">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-brand-yellow/20 text-brand-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              Login Required
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Please sign in with Google to access games and other features.
            </p>
            
            {/* @ts-ignore */}
            {useAuth().authError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-left">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium whitespace-pre-line">
                  {/* @ts-ignore */}
                  {useAuth().authError}
                </p>
              </div>
            )}
            
            <button
              onClick={signInWithGoogle}
              className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm"
            >
              Sign In with Google
            </button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case "home":
        return <Home onViewChange={handleViewChange} />;
      case "generator":
        return <AIGenerator />;
      case "admin-dashboard":
        return <AdminDashboard onViewChange={handleViewChange} />;
      case "user-dashboard":
        return <UserDashboard />;
      case "media-studio":
        return <MediaStudio />;
      case "mystery-box":
        return <MysteryBox onViewChange={handleViewChange} initialGame={selectedGame} />;
      case "neon-chain":
        return <NeonChain onViewChange={handleViewChange} />;
      case "bubble-pop":
        return <BubblePop onViewChange={handleViewChange} initialGame={selectedGame} />;
      case "flashcards-match":
        return <FlashcardsMatch onViewChange={handleViewChange} />;
      case "yoga-quiz":
        return <YogaQuiz onViewChange={handleViewChange} />;
      case "bubble-sentence-pro":
        return <BubbleSentencePro onViewChange={handleViewChange} initialGame={selectedGame} />;
      case "family-feud":
        return <FamilyFeud onViewChange={handleViewChange} initialGame={selectedGame} />;
      case "sumo":
        return <Sumo onViewChange={handleViewChange} />;
      case "dashboard":
        return <UserDashboard />;
      case "games":
        return <GamesLibrary onViewChange={handleViewChange} />;
      case "leaderboard":
        // Fallback for demo purposes
        return (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                Coming Soon
              </h2>
              <p className="text-slate-500">This view is under construction.</p>
              <button
                onClick={() => setCurrentView("home")}
                className="mt-6 px-6 py-2 bg-brand-purple text-white rounded-full font-medium"
              >
                Go Home
              </button>
            </div>
          </div>
        );
      default:
        return <Home />;
    }
  };

  if (isMaintenanceMode && loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isMaintenanceMode && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 p-6 text-center">
        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full border border-slate-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-500">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4 tracking-tight">We’re Sorry!</h1>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Our app is currently undergoing maintenance to improve your experience. We apologize for the inconvenience and appreciate your patience.
          </p>
          <p className="text-slate-600 font-semibold mb-8">
            We’ll be back soon!
          </p>
          
          <button 
            onClick={signInWithGoogle}
            className="mt-8 text-xs text-slate-400 hover:text-indigo-500 transition-colors bg-transparent border-none outline-none cursor-pointer"
          >
            Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 overflow-hidden">
      <Navigation 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onViewChange={handleViewChange} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {renderView()}
          <Footer />
        </main>
      </div>
    </div>
  );
}
