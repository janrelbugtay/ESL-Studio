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
import { HamsterPopQuiz } from "./views/HamsterPopQuiz";
import { StudentRace } from "./views/StudentRace";
import { LetterLock } from "./views/LetterLock";
import { useAuth } from "./contexts/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./lib/firebase";
import { AlertTriangle } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, isAuthenticating, signInWithGoogle, authError } = useAuth();
  
  const isAdmin = Boolean(user && !user.isAnonymous && user.email?.toLowerCase().trim() === "janrelbugtay03@gmail.com");

  const handleViewChange = (view: ViewState, data?: any) => {
    if (view === "admin-dashboard" && !isAdmin) {
      setCurrentView("home");
      return;
    }
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
            
            {authError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-left">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium whitespace-pre-line">
                  {authError}
                </p>
              </div>
            )}
            
            <button
              onClick={signInWithGoogle}
              disabled={isAuthenticating}
              className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? "Signing In..." : "Sign In with Google"}
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
        return isAdmin ? <AdminDashboard onViewChange={handleViewChange} /> : <Home onViewChange={handleViewChange} />;
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
      case "hamster-pop-quiz":
        return <HamsterPopQuiz onViewChange={handleViewChange} initialGame={selectedGame} />;
      case "student-race":
        return <StudentRace onViewChange={handleViewChange} />;
      case "letter-lock":
        return <LetterLock />;
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
