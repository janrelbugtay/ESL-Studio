/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ViewState } from "./types";
import { Navigation, Header } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { Home } from "./views/Home";
import { AIGenerator } from "./views/AIGenerator";
import { AdminDashboard } from "./views/AdminDashboard";
import { UserDashboard } from "./views/UserDashboard";
import { SharkLadder } from "./views/SharkLadder";
import { GamesLibrary } from "./views/GamesLibrary";
import { MysteryBox } from "./views/MysteryBox";

import { MediaStudio } from "./views/MediaStudio";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [selectedGame, setSelectedGame] = useState<any>(null);

  const handleViewChange = (view: ViewState, data?: any) => {
    setCurrentView(view);
    if ((view === "shark-ladder" || view === "mystery-box") && data) {
      setSelectedGame(data);
    }
    if (view !== "shark-ladder" && view !== "mystery-box") {
      setSelectedGame(null);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <Home onViewChange={handleViewChange} />;
      case "generator":
        return <AIGenerator />;
      case "admin-dashboard":
        return <AdminDashboard />;
      case "user-dashboard":
        return <UserDashboard />;
      case "media-studio":
        return <MediaStudio />;
      case "shark-ladder":
        return (
          <SharkLadder
            onViewChange={handleViewChange}
            initialGame={selectedGame}
          />
        );
      case "mystery-box":
        return <MysteryBox onViewChange={handleViewChange} initialGame={selectedGame} />;
      case "dashboard":
        return <UserDashboard />;
      case "games":
        return <GamesLibrary onViewChange={handleViewChange} />;
      case "leaderboard":
        // Fallback for demo purposes
        return (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
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
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
      <Navigation currentView={currentView} onViewChange={handleViewChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onViewChange={handleViewChange} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {renderView()}
          <Footer />
        </main>
      </div>
    </div>
  );
}
