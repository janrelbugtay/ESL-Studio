import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Activity, Search, Bell, 
  Menu, X, Settings, LogOut, Filter, Shield,
  Gamepad2, Monitor, Smartphone, Tablet, Trash2
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from '../lib/firebase';

// --- UI COMPONENTS ---
const Card = ({ children, className = '', title, action }: any) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
    {(title || action) && (
      <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
        {title && <h3 className="font-semibold text-slate-800">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const StatCard = ({ title, value, subtitle, trend, icon: Icon, colorClass, highlight, isLive }: any) => (
  <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-12 -translate-y-12 rounded-full opacity-10 transition-transform group-hover:scale-110 ${colorClass}`}></div>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
          {title}
          {isLive && <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>}
        </p>
        <h2 className="text-3xl font-bold text-slate-800 flex items-baseline gap-2">
          {value}
          {highlight && <span className="text-sm font-medium text-slate-400">{highlight}</span>}
        </h2>
      </div>
      <div className={`p-3 rounded-xl ${colorClass.replace('bg-', 'bg-opacity-10 text-')}`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
    </div>
    {subtitle && (
      <p className="text-sm text-slate-600 flex items-center gap-1">
        {trend && (
          <span className={`font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'} flex items-center`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
        {subtitle}
      </p>
    )}
  </Card>
);

const Avatar = ({ src, alt, size = 'md' }: any) => {
  const sizes: any = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-16 h-16', xl: 'w-24 h-24' };
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${sizes[size]} rounded-full border-2 border-white shadow-sm object-cover bg-slate-100`}
      onError={(e: any) => { e.target.src = 'https://ui-avatars.com/api/?name=' + alt; }}
    />
  );
};


// --- VIEWS ---

const DashboardOverview = ({ users }: any) => {
  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" value={users.length.toLocaleString()} 
          subtitle="Registered accounts"
          icon={Users} colorClass="bg-indigo-500" 
        />
        <StatCard 
          title="Active System" value="Online" isLive={true}
          subtitle="Platform status" 
          icon={Activity} colorClass="bg-emerald-500" 
        />
      </div>

      {/* Mini Live Users Table */}
      <Card title="Recent Users" action={<button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500 bg-slate-50">
              <tr>
                <th className="py-3 px-4 rounded-tl-lg font-medium">User</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 rounded-tr-lg font-medium text-right">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 10).map((user: any) => (
                <tr key={user.uid} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.photoURL} alt={user.displayName || user.email} size="sm" />
                      <div>
                        <p className="font-medium text-slate-800">{user.displayName || 'Unknown'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                     {user.email}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500">
                    {user.lastLoginAt ? new Date(user.lastLoginAt.toMillis()).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const UsersManagement = ({ users }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleDeleteUser = async (uid: string, email: string) => {
    if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
      try {
        await deleteDoc(doc(db, 'users', uid));
        alert('User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => 
      (u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <Card title="User Management" className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="px-4 py-2 flex items-center gap-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500 bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="py-4 px-4 font-medium rounded-tl-lg">User</th>
              <th className="py-4 px-4 font-medium">Email</th>
              <th className="py-4 px-4 font-medium text-right">Last Login</th>
              <th className="py-4 px-4 font-medium text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: any) => (
              <tr key={user.uid} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.photoURL} alt={user.displayName || user.email} />
                    <div>
                      <p className="font-semibold text-slate-800">{user.displayName || 'Unknown'}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {user.email}
                </td>
                <td className="py-3 px-4 text-right text-slate-500">
                  {user.lastLoginAt ? new Date(user.lastLoginAt.toMillis()).toLocaleString() : 'N/A'}
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => handleDeleteUser(user.uid, user.email)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete User"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-slate-500">
                  No users found matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};


// --- MAIN APP COMPONENT ---
export function AdminDashboard({ onViewChange }: { onViewChange: (view: any) => void }) {
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Fetch real users from Firestore
  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('lastLoginAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData: any[] = [];
      snapshot.forEach((doc) => {
        usersData.push(doc.data());
      });
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch maintenance mode
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
      if (doc.exists()) {
        setMaintenanceMode(doc.data().maintenanceMode === true);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleMaintenanceMode = async () => {
    try {
      await setDoc(doc(db, 'settings', 'general'), { maintenanceMode: !maintenanceMode }, { merge: true });
    } catch (error) {
      console.error('Error toggling maintenance mode', error);
      alert('Failed to update maintenance mode.');
    }
  };

  // Navigation config
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setCurrentRoute(id);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 font-sans overflow-hidden text-slate-800 -mx-4 -my-4 md:-mx-8 md:-my-8" style={{ margin: '-2rem' }}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-72 bg-indigo-900 text-indigo-50 
        transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-indigo-800/50">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onViewChange('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Gamepad2 size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">EduPlay</span>
          </div>
          <button className="lg:hidden text-indigo-300 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-indigo-400/70 uppercase tracking-wider mb-4 px-4">Menu</p>
          <nav className="space-y-1.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${currentRoute === item.id 
                    ? 'bg-indigo-600/50 text-white font-medium shadow-sm backdrop-blur-md border border-indigo-500/30' 
                    : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}
                `}
              >
                <item.icon size={20} className={currentRoute === item.id ? 'text-white' : 'text-indigo-400'} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-indigo-800/50">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-200 hover:bg-red-500/20 hover:text-red-300 transition-all" onClick={() => onViewChange('home')}>
            <LogOut size={20} />
            Back to Home
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block capitalize">
              {currentRoute.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search */}
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="pl-10 pr-4 py-2 w-64 bg-slate-100 border-transparent focus:bg-white border focus:border-indigo-300 rounded-full text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">Admin</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <Avatar src="https://ui-avatars.com/api/?name=Admin" alt="Admin" />
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative">
           
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-500">Loading user data...</div>
            </div>
          ) : (
            <>
              {currentRoute === 'dashboard' && <DashboardOverview users={users} />}
              {currentRoute === 'users' && <UsersManagement users={users} />}
              {currentRoute === 'settings' && (
                  <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                     <h2 className="text-2xl font-bold text-slate-800 mb-6">Platform Settings</h2>
                     <div className="space-y-6">
                        <div className="flex items-center justify-between py-4 border-t border-slate-100">
                           <div>
                              <h4 className="font-medium text-slate-800">Maintenance Mode</h4>
                              <p className="text-sm text-slate-500">Prevent new logins during updates</p>
                           </div>
                           <button 
                             onClick={toggleMaintenanceMode}
                             className={`w-12 h-6 ${maintenanceMode ? 'bg-indigo-500' : 'bg-slate-200'} rounded-full relative transition-colors duration-200 focus:outline-none`}
                           >
                              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-200 ${maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                           </button>
                        </div>
                     </div>
                  </div>
              )}
            </>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
}
