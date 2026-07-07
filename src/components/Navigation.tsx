import React from "react";
import { cn } from "../lib/utils";
import { ViewState } from "../types";
import {
  Gamepad2,
  Home,
  Bot,
  LayoutDashboard,
  Trophy,
  Bell,
  Search,
  Moon,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface NavigationProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { user } = useAuth();
  const isAdmin = user?.email === "janrelbugtay03@gmail.com";

  const navItems = [
    { id: "home", label: "Home", icon: Home, view: "home" as ViewState },
    { id: "games", label: "Games", icon: Gamepad2, view: "games" as ViewState },
    {
      id: "generator",
      label: "AI Tools",
      icon: Bot,
      view: "generator" as ViewState,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      view: (isAdmin ? "admin-dashboard" : "dashboard") as ViewState,
    },
    {
      id: "leaderboard",
      label: "Leaderboards",
      icon: Trophy,
      view: "leaderboard" as ViewState,
    },
    {
      id: "media-studio",
      label: "Media Studio",
      icon: Bot,
      view: "media-studio" as ViewState,
    },
  ];

  return (
    <aside className="w-[220px] bg-white border-r border-[#e2e8f0] flex flex-col p-5 shadow-sm shrink-0 h-full">
      <div
        className="flex items-center gap-2 mb-8 cursor-pointer"
        onClick={() => onViewChange("home")}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-brand-purple to-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/50 shrink-0">
          <Bot size={24} className="text-white" />
        </div>
        <span className="font-bold text-lg leading-tight tracking-tight">
          Teacher Jan
          <br />
          <span className="text-brand-purple">ESL Studio</span>
        </span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive =
            currentView === item.view ||
            (item.id === "dashboard" &&
              (currentView === "admin-dashboard" ||
                currentView === "user-dashboard")) ||
            (item.id === "games" && currentView === "shark-ladder");
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.view)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all",
                isActive
                  ? "bg-[#f1f5f9] text-brand-purple"
                  : "text-[#64748b] hover:bg-[#f8fafc]",
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="bg-gradient-to-br from-brand-purple to-brand-blue rounded-[20px] p-4 text-white shadow-xl shadow-purple-200/40">
          <p className="text-xs opacity-80 mb-1">Available Credits</p>
          <p className="text-xl font-bold mb-3">1,250 AI Gems</p>
          <button className="w-full py-2 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold hover:bg-white/30 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>
    </aside>
  );
}

export function Header({
  onViewChange,
}: {
  onViewChange?: (view: ViewState) => void;
}) {
  const { user, signInWithGoogle, logout, loading } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Mock admin list, normally from database
  const isAdmin = user?.email === "janrelbugtay03@gmail.com";

  const handleDropdownItemClick = (view: ViewState) => {
    if (onViewChange) {
      onViewChange(view);
    }
    setShowDropdown(false);
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md border-b border-[#e2e8f0] shrink-0">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 opacity-60"
            size={18}
          />
          <input
            type="text"
            placeholder="Search games or topics..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#e2e8f0] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-[#f1f5f9] px-3 py-1.5 rounded-full">
          <span className="text-brand-orange">🔥</span>
          <span className="font-bold text-sm text-slate-700">
            12 Day Streak
          </span>
        </div>
        <button className="text-slate-400 hover:text-brand-purple transition-colors">
          <Moon size={20} />
        </button>
        <button className="text-slate-400 hover:text-brand-purple transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-brand-orange rounded-full border border-white"></span>
        </button>

        {!loading &&
          (user ? (
            <div className="relative">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-yellow flex items-center justify-center border-2 border-white shadow-sm font-bold text-white">
                    {user.displayName?.charAt(0) ||
                      user.email?.charAt(0) ||
                      "U"}
                  </div>
                )}
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => handleDropdownItemClick("user-dashboard")}
                      className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-purple transition-colors"
                    >
                      User Dashboard
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() =>
                          handleDropdownItemClick("admin-dashboard")
                        }
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-purple transition-colors"
                      >
                        Admin Dashboard
                      </button>
                    )}
                  </div>
                  <div className="py-2 border-t border-slate-50">
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-orange transition-colors flex items-center justify-between"
                    >
                      Sign Out
                      <LogOut size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold py-1.5 px-4 rounded-full text-sm transition-colors shadow-sm"
            >
              Sign In
            </button>
          ))}
      </div>
    </header>
  );
}
