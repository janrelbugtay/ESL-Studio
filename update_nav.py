import re

with open('src/components/Navigation.tsx', 'r') as f:
    content = f.read()

# 1. Import Sun
content = content.replace('Moon,', 'Moon,\n  Sun,')

# 2. Add dark mode state to Header
old_header_state = """  const { user, signInWithGoogle, logout, loading } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);"""
  
new_header_state = """  const { user, signInWithGoogle, logout, loading } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(() => document.documentElement.classList.contains('dark'));
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };"""
content = content.replace(old_header_state, new_header_state)

# 3. Replace the streak, moon and bell with just the dark mode toggle
old_icons = """      <div className="flex items-center gap-6">
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
        </button>"""

new_icons = """      <div className="flex items-center gap-6">
        <button 
          onClick={toggleDarkMode}
          className="text-slate-400 hover:text-brand-purple transition-colors bg-slate-100 hover:bg-slate-200 p-2 rounded-full dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>"""
content = content.replace(old_icons, new_icons)

with open('src/components/Navigation.tsx', 'w') as f:
    f.write(content)
