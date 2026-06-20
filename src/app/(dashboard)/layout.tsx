'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, CheckSquare, CalendarDays, Users, 
  AlertCircle, ArrowRightLeft, FileText, Settings, 
  LogOut, Search, Bell, Menu, X, ChevronRight,
  Clock, ShieldAlert, CheckSquare as CheckIcon
} from 'lucide-react';
import Link from 'next/link';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Daily Tasks', path: '/tasks', icon: Clock },
  { name: 'To-Do List', path: '/todo', icon: CheckIcon },
  { name: 'Attendance', path: '/attendance', icon: Users },
  { name: 'Meetings', path: '/meetings', icon: CalendarDays },
  { name: 'Issues & Blockers', path: '/issues', icon: ShieldAlert },
  { name: 'Follow-Ups', path: '/followups', icon: ArrowRightLeft },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Documents', path: '/documents', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Notifications state mock
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New meeting scheduled with Chairman', time: '10m ago', read: false },
    { id: 2, text: 'Issue #104 status updated to Completed', time: '1h ago', read: false },
    { id: 3, text: 'Pending Follow-up reminder: Project Alpha report', time: '3h ago', read: true }
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // CMD+K event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050b1e] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const filteredNavItems = NAV_ITEMS.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050b1e] text-slate-100 flex relative overflow-hidden">

      {/* Sidebar background gradient */}
      <div 
        className={`absolute top-0 left-0 h-full bg-slate-950/40 border-r border-slate-800/80 z-20 hidden md:block pointer-events-none transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-20'}
        `}
      />

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen z-30 transition-all duration-300 glass-card border-r border-slate-800/60 flex flex-col
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/60">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white text-xs font-extrabold font-heading">✦</span>
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-bold tracking-tight text-xs text-slate-100 block font-heading">
                  Operations CRM
                </span>
                <span className="text-[8px] text-slate-500 tracking-widest block font-mono uppercase">
                  Realty Ops
                </span>
              </div>
            )}
          </Link>
          {sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 hover:bg-slate-800/60 rounded-lg text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>


        {/* Profile Card Summary */}
        {sidebarOpen && profile && (
          <div className="p-4 mx-3 my-4 bg-slate-900/40 border border-slate-800/80 rounded-xl flex items-center gap-3">
            <img 
              src={profile.avatar_url} 
              alt={profile.full_name} 
              className="w-10 h-10 rounded-lg border border-slate-700 object-cover" 
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-slate-200 truncate">{profile.full_name}</h4>
              <p className="text-[10px] text-slate-500 truncate font-mono uppercase">{profile.role}</p>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all relative text-sm font-medium
                  ${isActive 
                    ? 'text-white bg-blue-600/10 border border-blue-500/20' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent'}
                `}
              >
                {isActive && (
                  <span className="absolute left-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                {sidebarOpen && <span className={isActive ? 'pl-2' : ''}>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout bottom area */}
        <div className="p-3 border-t border-slate-800/60">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent transition-all font-mono text-xs cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/60 glass-card flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-slate-800/60 rounded-lg text-slate-400 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Styled Search Button Trigger */}
            <div 
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 hover:border-slate-700 transition-all cursor-pointer font-mono text-xs"
            >
              <Search className="w-4 h-4" />
              <span>Search anything...</span>
              <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-[10px]">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-slate-800/60 rounded-xl text-slate-400 hover:text-slate-200 transition-colors relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 glass-card rounded-2xl p-4 shadow-2xl border border-slate-800 z-50 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                      <span className="font-bold text-slate-200 uppercase tracking-wider">Notifications</span>
                      <button 
                        onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                        className="text-[10px] text-emerald-400 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-2 rounded-lg transition-colors ${n.read ? 'bg-transparent' : 'bg-slate-900/40 border border-slate-800'}`}>
                          <p className="text-slate-300">{n.text}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Profile Icon link */}
            <Link href="/settings" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <img 
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                alt="Profile" 
                className="w-8 h-8 rounded-lg object-cover border border-slate-700" 
              />
            </Link>
          </div>
        </header>

        {/* Dynamic page contents */}
        <main className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette Modal Popup */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-card rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
            >
              <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type a page name or action..."
                  className="w-full bg-transparent border-0 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 font-mono text-sm"
                  autoFocus
                />
                <button 
                  onClick={() => setCommandPaletteOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2 max-h-72 overflow-y-auto space-y-1">
                {filteredNavItems.map(item => (
                  <button 
                    key={item.path}
                    onClick={() => {
                      router.push(item.path);
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/40 text-left text-slate-300 hover:text-slate-100 transition-colors font-mono text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-emerald-400" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                ))}
                {filteredNavItems.length === 0 && (
                  <div className="p-6 text-center text-slate-500 font-mono text-xs">
                    No matching items found.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
