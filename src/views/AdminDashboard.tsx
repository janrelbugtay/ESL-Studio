import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  Gamepad2,
  TrendingUp,
  Clock,
  Award,
  MoreVertical,
  Plus,
  Sparkles,
  Trash2,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

export function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, "users"), orderBy("lastLoginAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user profile?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEditUser = (userId: string, currentName: string) => {
    setEditingUserId(userId);
    setEditName(currentName || "");
  };

  const handleSaveEdit = async (userId: string) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        displayName: editName,
      });
      setEditingUserId(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            Welcome back, {user?.displayName?.split(" ")[0] || "Admin"}! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Here's what's happening in your application today.
          </p>
        </div>
        <button className="px-6 py-2.5 bg-brand-purple text-white rounded-xl font-medium text-sm hover:bg-brand-purple/90 transition-all shadow-sm flex items-center gap-2">
          <Plus size={18} /> New Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={users.length.toString()}
          change="+2 this week"
          icon={Users}
          color="brand-blue"
        />
        <StatCard
          title="Games Played"
          value="84"
          change="+24 this week"
          icon={Gamepad2}
          color="brand-purple"
        />
        <StatCard
          title="Avg. Score"
          value="86%"
          change="+2.5% this week"
          icon={TrendingUp}
          color="brand-green"
        />
        <StatCard
          title="Learning Hours"
          value="34.5"
          change="+5.2h this week"
          icon={Clock}
          color="brand-orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Registered Users */}
          <div className="bg-white rounded-[24px] p-6 premium-shadow border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-xl text-slate-900">
                Registered Users
              </h2>
              <button className="text-brand-purple text-sm font-medium hover:underline">
                View all
              </button>
            </div>

            <div className="space-y-4">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
                >
                  <div className="flex items-center gap-4">
                    {u.photoURL ? (
                      <img
                        src={u.photoURL}
                        alt={u.displayName || "User"}
                        className="w-10 h-10 rounded-full border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-white font-bold">
                        {u.displayName?.charAt(0) || u.email?.charAt(0) || "U"}
                      </div>
                    )}
                    <div>
                      {editingUserId === u.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-brand-purple"
                          />
                        </div>
                      ) : (
                        <h4 className="font-bold text-slate-900">
                          {u.displayName || "No Name"}
                        </h4>
                      )}
                      <p className="text-sm text-slate-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                      <div className="text-xs text-slate-500 mb-1">
                        Last Login
                      </div>
                      <div className="text-sm font-medium text-slate-700">
                        {u.lastLoginAt
                          ? new Date(
                              u.lastLoginAt.toDate(),
                            ).toLocaleDateString()
                          : "Never"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {editingUserId === u.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(u.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditUser(u.id, u.displayName)}
                          className="p-2 text-slate-400 hover:text-brand-purple transition-all rounded-lg hover:bg-slate-100"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-sm">
                  No users found. Log in with a user account to see them here.
                </div>
              )}
            </div>
          </div>

          {/* Active Classes */}
          <div className="bg-white rounded-[24px] p-6 premium-shadow border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-xl text-slate-900">
                Active Classes
              </h2>
              <button className="text-brand-purple text-sm font-medium hover:underline">
                View all
              </button>
            </div>

            <div className="space-y-4">
              <ClassRow
                name="B2 First (FCE) Prep"
                students={24}
                progress={75}
                nextLesson="Today, 2:00 PM"
                color="brand-purple"
              />
              <ClassRow
                name="A2 Flyers Young Learners"
                students={18}
                progress={45}
                nextLesson="Tomorrow, 10:00 AM"
                color="brand-blue"
              />
              <ClassRow
                name="Adult Conversation C1"
                students={12}
                progress={90}
                nextLesson="Wed, 6:00 PM"
                color="brand-green"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-[24px] p-6 premium-shadow border border-slate-100">
            <h2 className="font-display font-bold text-xl text-slate-900 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <QuickAction
                icon={Gamepad2}
                label="Assign Game"
                color="brand-purple"
              />
              <QuickAction
                icon={Award}
                label="Send Awards"
                color="brand-yellow"
              />
              <QuickAction
                icon={Users}
                label="Message Class"
                color="brand-blue"
              />
              <QuickAction
                icon={TrendingUp}
                label="Reports"
                color="brand-green"
              />
            </div>
          </div>

          {/* Top Performers Leaderboard snippet */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[24px] p-6 text-white premium-shadow">
            <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
              <Award className="text-brand-yellow" /> Top Performers
            </h2>
            <div className="space-y-4">
              <LeaderboardRow rank={1} name="Leo M." score={2450} xp="+150" />
              <LeaderboardRow rank={2} name="Sofia K." score={2320} xp="+120" />
              <LeaderboardRow rank={3} name="Marco R." score={2180} xp="+90" />
            </div>
            <button className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">
              View Full Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-[20px] p-6 premium-shadow border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-slate-500 font-medium text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-display font-bold text-slate-900 mb-2">
          {value}
        </h3>
        <p className="text-xs font-medium text-brand-green">{change}</p>
      </div>
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center bg-opacity-10",
          `bg-${color}/10 text-${color}`,
        )}
      >
        <Icon size={24} />
      </div>
    </div>
  );
}

function ClassRow({ name, students, progress, nextLesson, color }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
      <div className="flex items-center gap-4">
        <div className={cn("w-2 h-12 rounded-full", `bg-${color}`)} />
        <div>
          <h4 className="font-bold text-slate-900">{name}</h4>
          <p className="text-sm text-slate-500">
            {students} Students • Next: {nextLesson}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden sm:block w-32">
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-slate-500">Progress</span>
            <span className="text-slate-900">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full", `bg-${color}`)}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, color }: any) {
  return (
    <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all group">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm group-hover:scale-110 transition-transform",
          `text-${color}`,
        )}
      >
        <Icon size={20} />
      </div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </button>
  );
}

function LeaderboardRow({ rank, name, score, xp }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
            rank === 1
              ? "bg-brand-yellow text-slate-900"
              : rank === 2
                ? "bg-slate-300 text-slate-900"
                : "bg-brand-orange text-white",
          )}
        >
          {rank}
        </div>
        <div className="font-medium">{name}</div>
      </div>
      <div className="text-right">
        <div className="font-bold text-brand-yellow">{score}</div>
        <div className="text-xs text-slate-400">{xp} XP</div>
      </div>
    </div>
  );
}
