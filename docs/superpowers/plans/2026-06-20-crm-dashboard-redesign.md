# CRM Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the Operations CRM dashboard UI and functionality, introducing a Kanban board for task management, simplifying sidebar links/icons, and implementing operational download/delete utilities across meetings, followups, and documents pages.

**Architecture:** We will refine global styles in `globals.css` to enforce a unified Linear-inspired theme. Pages will be modified task-by-task to upgrade widgets, integrate native HTML5 drag-and-drop column handling, and hook up interactive actions.

**Tech Stack:** Next.js (Webpack), React, Tailwind CSS v4, Framer Motion, Lucide Icons, Recharts.

---

### Task 1: Styling Foundation Update

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update globals.css with new Design System Tokens**
  Modify `/home/mavrik/Desktop/Projects/CRM-Panel/app-src/src/app/globals.css` to declare CSS variables and theme rules matching the exact Linear/Vercel enterprise layout.

  Replace the contents of `src/app/globals.css` with:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  @import "tailwindcss";

  :root {
    --background: #050b1e;
    --card-bg-start: #0b1226;
    --card-bg-end: #10192f;
    --primary: #3b82f6;
    --success: #10b981;
    --foreground: #f8fafc;
    --text-secondary: #94a3b8;
    --border-color: rgba(30, 41, 59, 0.8); /* border-slate-800/80 equivalent */
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
  }

  /* Redesigned Card Base Style */
  .premium-card {
    background: linear-gradient(135deg, var(--card-bg-start), var(--card-bg-end));
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
    border-radius: 16px;
    padding: 24px;
    transition: all 180ms ease-out;
  }

  .premium-card-interactive {
    cursor: pointer;
  }

  .premium-card-interactive:hover {
    transform: translateY(-2px);
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 8px 30px -4px rgba(59, 130, 246, 0.15);
  }

  /* Primary Button style */
  .btn-primary-custom {
    background-color: var(--primary);
    color: white;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: 12px;
    transition: all 150ms ease;
  }

  .btn-primary-custom:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  /* Form Input */
  .input-custom {
    background-color: rgba(11, 18, 38, 0.8);
    border: 1px solid var(--border-color);
    color: var(--foreground);
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 14px;
    transition: all 150ms ease;
  }

  .input-custom:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
  }

  /* Scrollbar Customization */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(5, 11, 30, 0.5);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.2);
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.4);
  }
  ```

- [ ] **Step 2: Commit styling foundation changes**
  Run:
  ```bash
  git add src/app/globals.css
  git commit -m "style: update global typography and theme tokens to Inter"
  ```

---

### Task 2: Layout & Sidebar Update

**Files:**
- Modify: `src/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Simplify Sidebar Navigation items, titles, and icons**
  Modify `src/app/(dashboard)/layout.tsx` to use clean, simplified navigation items, titles, and standard Lucide icons, removing the duplicate calendar/file text definitions, and styling it to match modern SaaS dashboards.

  Replace lines 15-27 in `src/app/(dashboard)/layout.tsx` with:
  ```typescript
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
  ```

  And change the styling of nav items and header:
  Replace lines 149-166 with:
  ```typescript
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
                  <Icon className={`w-4 h-4 pl-1.5 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                  {sidebarOpen && <span className={isActive ? 'pl-1' : ''}>{item.name}</span>}
                </Link>
  ```

- [ ] **Step 2: Commit layout changes**
  Run:
  ```bash
  git add src/app/(dashboard)/layout.tsx
  git commit -m "refactor: simplify sidebar items and styles for premium look"
  ```

---

### Task 3: Dashboard Redesign & Widgets

**Files:**
- Modify: `src/app/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: Update dashboard widgets and Recharts analytics**
  Rewrite `src/app/(dashboard)/dashboard/page.tsx` with:
  - Cleaned KPI cards (solid color metrics, subtle hover, professional icons).
  - Modern To-Do card layout displaying High/Medium/Low priority tags, progress bar, and list of completed tasks.
  - Simplified attendance card matching the circular monthly ring indicator, sub-card check times, and a check-in trigger button.
  - Recharts widgets displaying *Daily Performance* (grouped bar chart) and *Monthly Attendance* (smooth area line).

  Replace the contents of `src/app/(dashboard)/dashboard/page.tsx` with upgraded code (using the updated design classes and styles). (Code logic must preserve checked-in timers, mock lists, etc.).

  Code block:
  ```typescript
  'use client';

  import React, { useState, useEffect } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { 
    CheckSquare, Calendar, AlertTriangle, Check, 
    Plus, Clock, Users, ArrowUpRight, 
    ClipboardList, Trash2, Sparkles,
    TrendingUp, Pause, RotateCw
  } from 'lucide-react';
  import { 
    AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
  } from 'recharts';
  import { useAuth } from '@/components/AuthContext';

  // Weekly Performance Summary mock data
  const WEEKLY_DATA = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 9.0 },
    { day: 'Wed', hours: 8.0 },
    { day: 'Thu', hours: 9.5 },
    { day: 'Fri', hours: 7.5 },
  ];

  // Monthly Attendance mock data
  const MONTHLY_ATTENDANCE_DATA = [
    { name: 'Jan', rate: 92 },
    { name: 'Feb', rate: 95 },
    { name: 'Mar', rate: 98 },
    { name: 'Apr', rate: 94 },
    { name: 'May', rate: 96 },
    { name: 'Jun', rate: 100 },
  ];

  export default function DashboardPage() {
    const { profile } = useAuth();
    
    // Realtime clock state
    const [currentTime, setCurrentTime] = useState('');
    useEffect(() => {
      const updateTime = () => {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }, []);

    // Today's Date
    const formattedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Attendance state
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);
    const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
    const [actualHours, setActualHours] = useState(0); // in decimal hours
    const [elapsedTime, setElapsedTime] = useState('0h 0m');
    const [overtime, setOvertime] = useState('0h 0m');

    // Target Working Hours selector state
    const [targetHours, setTargetHours] = useState<number>(8); // default to 8h

    // To-Do List priority state
    const [todos, setTodos] = useState([
      { id: 1, text: 'My gate acess checking', completed: false, progress: 0, priority: 'High', status: 'Pending' },
      { id: 2, text: 'Sending dalily task update details in Group', completed: false, progress: 0, priority: 'High', status: 'Pending' },
      { id: 3, text: 'money set cheyyali', completed: false, progress: 0, priority: 'Medium', status: 'Pending' },
      { id: 4, text: 'Mobile number activation checking', completed: true, progress: 100, priority: 'Low', status: 'Completed' }
    ]);
    const [newTodoText, setNewTodoText] = useState('');
    const [newTodoPriority, setNewTodoPriority] = useState<'High' | 'Medium' | 'Low'>('High');

    // Elapsed time & overtime calculator
    useEffect(() => {
      let interval: any;
      if (isCheckedIn && checkInTime) {
        interval = setInterval(() => {
          const diffMs = Date.now() - new Date(checkInTime).getTime();
          const diffHrs = Math.max(0.5, diffMs / 3600000);
          setActualHours(diffHrs);

          const hrs = Math.floor(diffHrs);
          const mins = Math.floor((diffHrs % 1) * 60);
          setElapsedTime(`${hrs}h ${mins}m`);

          if (diffHrs > targetHours) {
            const otHrs = diffHrs - targetHours;
            const otH = Math.floor(otHrs);
            const otM = Math.floor((otHrs % 1) * 60);
            setOvertime(`${otH}h ${otM}m`);
          } else {
            setOvertime('0h 0m');
          }
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isCheckedIn, checkInTime, targetHours]);

    const handleCheckInToggle = () => {
      const now = new Date();
      if (!isCheckedIn) {
        setIsCheckedIn(true);
        setCheckInTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 47).toString());
        setCheckOutTime(null);
      } else {
        setIsCheckedIn(false);
        setCheckOutTime('10:22 AM');
      }
    };

    const handleAddTodo = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTodoText.trim()) return;

      setTodos([
        ...todos.filter(t => !t.completed),
        {
          id: Date.now(),
          text: newTodoText,
          completed: false,
          progress: 0,
          priority: newTodoPriority,
          status: 'Pending'
        },
        ...todos.filter(t => t.completed)
      ]);
      setNewTodoText('');
    };

    const handleToggleTodo = (id: number) => {
      setTodos(todos.map(t => {
        if (t.id === id) {
          const completed = !t.completed;
          return {
            ...t,
            completed,
            progress: completed ? 100 : 0,
            status: completed ? 'Completed' : 'Pending'
          };
        }
        return t;
      }));
    };

    const handleDeleteTodo = (id: number) => {
      setTodos(todos.filter(t => t.id !== id));
    };

    const totalTasks = todos.length;
    const completedTasks = todos.filter(t => t.completed).length;
    const pendingTasks = todos.filter(t => !t.completed && t.priority === 'High').length;
    const inProgressTasks = todos.filter(t => !t.completed && t.priority === 'Medium').length;
    const onHoldTasks = todos.filter(t => !t.completed && t.priority === 'Low').length;

    const targetProgressPercentage = Math.min(Math.round(((isCheckedIn ? actualHours : 0.58) / targetHours) * 100), 100);

    return (
      <div className="space-y-6">
        
        {/* Welcome Header Section */}
        <div className="premium-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-100">
                Good Afternoon, {profile?.full_name || 'Ravi'} <span className="animate-bounce">👋</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{formattedDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-xl shrink-0 text-xs self-end md:self-auto">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">System Time</span>
            <div className="h-4 w-px bg-slate-800" />
            <div className="text-sm font-bold text-slate-100 font-mono">
              {currentTime || '04:54 PM'}
            </div>
          </div>
        </div>

        {/* KPI Summary Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Tasks', value: totalTasks, colorClass: 'text-blue-500', icon: ClipboardList },
            { label: 'Completed', value: completedTasks, colorClass: 'text-emerald-500', icon: Check },
            { label: 'In Progress', value: inProgressTasks, colorClass: 'text-indigo-500', icon: RotateCw },
            { label: 'Pending', value: pendingTasks, colorClass: 'text-amber-500', icon: Clock },
            { label: 'On Hold', value: onHoldTasks, colorClass: 'text-rose-500', icon: Pause }
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="premium-card premium-card-interactive flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                  <h3 className="text-2xl font-bold mt-2 text-slate-100">{kpi.value}</h3>
                </div>
                <div className={`p-2 bg-slate-900/60 border border-slate-800/80 rounded-lg ${kpi.colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel: Today's To-Do List */}
          <div className="lg:col-span-2 premium-card flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    Today's To-Do List 
                    <span className="text-[10px] bg-blue-500/10 border border-blue-500/25 text-blue-400 px-2.5 py-0.5 rounded-full uppercase font-medium">Priority</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {todos.filter(t => !t.completed).length} pending · {todos.filter(t => t.completed).length} completed
                  </p>
                </div>
              </div>

              {/* Quick Add Task Input Panel */}
              <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 input-custom"
                />
                <select
                  value={newTodoPriority}
                  onChange={(e: any) => setNewTodoPriority(e.target.value)}
                  className="px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button 
                  type="submit"
                  className="btn-primary-custom flex items-center justify-center gap-1.5 text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </form>

              {/* Checklist stack */}
              <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1">
                <AnimatePresence mode="popLayout">
                  {todos.filter(t => !t.completed).map(todo => (
                    <motion.div 
                      layout
                      key={todo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="p-4 bg-slate-900/20 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700/80 transition-all duration-150"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <button 
                          onClick={() => handleToggleTodo(todo.id)}
                          className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center hover:border-emerald-500 shrink-0 cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 rounded-full hover:bg-emerald-500/50" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-slate-200 block truncate">{todo.text}</span>
                          {/* Progress bar */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 h-1.5 bg-slate-950 border border-slate-800/60 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${todo.progress}%` }} />
                            </div>
                            <span className="text-[9px] font-mono text-slate-500">{todo.progress}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 border rounded font-medium text-[9px] uppercase tracking-wider
                          ${todo.priority === 'High' ? 'border-red-500/30 text-red-400 bg-red-950/20' : 
                            todo.priority === 'Medium' ? 'border-amber-500/30 text-amber-400 bg-amber-950/20' : 
                            'border-blue-500/30 text-blue-400 bg-blue-950/20'}
                        `}>
                          {todo.priority}
                        </span>
                        <span className="px-2 py-0.5 border border-slate-800 rounded text-[9px] text-slate-400 bg-slate-900/60">
                          {todo.status}
                        </span>
                        <button 
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="p-1 hover:bg-red-950/20 rounded text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Completed tasks list */}
                {todos.some(t => t.completed) && (
                  <div className="mt-6 pt-4 border-t border-slate-800/80">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-3 font-semibold">Completed</span>
                    <div className="space-y-2">
                      {todos.filter(t => t.completed).map(todo => (
                        <div 
                          key={todo.id}
                          className="p-3 bg-slate-900/10 border border-slate-800/50 rounded-xl flex items-center justify-between gap-4 opacity-60"
                        >
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleToggleTodo(todo.id)}
                              className="w-5 h-5 rounded-full border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center text-emerald-400 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <span className="text-xs text-slate-400 line-through truncate max-w-xs">{todo.text}</span>
                          </div>
                          <button 
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="p-1 hover:bg-red-950/20 rounded text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Attendance Widget */}
          <div className="premium-card flex flex-col justify-between gap-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Attendance Widget</h3>
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 bg-slate-900/60 border border-slate-800/80 text-slate-400 rounded-lg font-medium">
                  {isCheckedIn ? 'ACTIVE SHIFT' : 'OUT'}
                </span>
              </div>

              {/* Performance Circular Ring */}
              <div className="flex items-center justify-around bg-slate-900/20 border border-slate-800/80 p-4 rounded-xl mb-4">
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-slate-850" strokeWidth="6" fill="transparent" />
                    <circle cx="40" cy="40" r="34" className="stroke-emerald-500 transition-all duration-500" strokeWidth="6" fill="transparent" 
                      strokeDasharray={213.6} strokeDashoffset={213.6 - (213.6 * (isCheckedIn ? 100 : 96)) / 100}
                    />
                  </svg>
                  <div className="text-center font-mono">
                    <span className="text-xs font-bold text-slate-200 block">{isCheckedIn ? 100 : 96}%</span>
                    <span className="text-[8px] text-slate-500 uppercase">Rate</span>
                  </div>
                </div>

                {/* Extra stats */}
                <div className="text-xs text-slate-400 space-y-1.5 font-medium">
                  <div className="flex justify-between gap-4">
                    <span>Month Status:</span>
                    <span className="text-emerald-500 font-bold">100% Present</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Weekly Perf:</span>
                    <span className="text-blue-500 font-semibold">92% Done</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Prod. Score:</span>
                    <span className="text-indigo-500 font-bold">A+</span>
                  </div>
                </div>
              </div>

              {/* Working Hours Progress Bar */}
              <div className="space-y-1.5 mb-4 text-xs">
                <div className="flex justify-between text-slate-400 text-[10px] font-medium">
                  <span>Working Hours Progress:</span>
                  <span>{isCheckedIn ? elapsedTime : '0.5h'} / {targetHours}h</span>
                </div>
                <div className="w-full h-2 bg-slate-950 border border-slate-800/80 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${targetProgressPercentage}%` }} />
                </div>
              </div>

              {/* Target Working Hours Selector */}
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex justify-between text-slate-450 font-medium">
                  <span>Select Target Hours:</span>
                  <span className="text-slate-200 font-bold">{targetHours} Hours</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[6, 8, 9, 10, 12].map(hrs => (
                    <button
                      key={hrs}
                      onClick={() => setTargetHours(hrs)}
                      className={`py-1 rounded-xl border text-[10px] transition-all cursor-pointer font-medium
                        ${targetHours === hrs 
                          ? 'bg-blue-600 border-blue-500 text-white font-bold' 
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'}
                      `}
                    >
                      {hrs}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Clock Stats grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl text-[10px] text-slate-400 mb-4 font-mono">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">In:</span>
                    <span className="text-slate-200 font-bold">{checkInTime ? '10:47 AM' : '--:--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Out:</span>
                    <span className="text-slate-200 font-bold">{checkOutTime || '--:--'}</span>
                  </div>
                </div>
                <div className="space-y-1 border-l border-slate-800 pl-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hrs:</span>
                    <span className="text-blue-500 font-bold">{isCheckedIn ? elapsedTime : '0h 0m'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Overtime:</span>
                    <span className="text-indigo-500 font-semibold">{overtime}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckInToggle}
              className={`w-full py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs
                ${isCheckedIn 
                  ? 'bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20' 
                  : 'btn-primary-custom shadow-lg shadow-blue-500/10'
                }
              `}
            >
              {isCheckedIn ? 'Check Out' : 'Check In'}
            </button>
          </div>

        </div>

        {/* Row 3 split: Analytics Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Daily Performance widget */}
          <div className="premium-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Daily Performance</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontFamily: 'monospace' }} />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Hours Logged" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Attendance widget */}
          <div className="premium-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Monthly Attendance</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_ATTENDANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <YAxis domain={[80, 100]} stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontFamily: 'monospace' }} />
                  <Area type="monotone" dataKey="rate" stroke="#10b981" fillOpacity={1} fill="url(#attGrad)" strokeWidth={1.5} name="Attendance Rate (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    );
  }
  ```

- [ ] **Step 2: Commit dashboard changes**
  Run:
  ```bash
  git add src/app/(dashboard)/dashboard/page.tsx
  git commit -m "feat: complete dashboard layout widgets and charts redesign"
  ```

---

### Task 4: Daily Tasks Kanban Board

**Files:**
- Modify: `src/app/(dashboard)/tasks/page.tsx`

- [ ] **Step 1: Convert Daily Tasks to Kanban Board with Native Drag-and-Drop**
  Rewrite `src/app/(dashboard)/tasks/page.tsx` to implement a column-based layout: `Not Started` (maps to status `Pending`), `In Progress`, `Completed`, and `High Priority` (as a status).

  Implement Native Drag & Drop handlers:
  ```typescript
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task['status']) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('taskId');
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: targetStatus } : t));
  };
  ```

  Replace the contents of `src/app/(dashboard)/tasks/page.tsx` with:
  ```typescript
  'use client';

  import React, { useState } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { 
    Plus, Search, Edit2, Trash2, X, AlertTriangle, Clock
  } from 'lucide-react';

  interface Task {
    id: string;
    name: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'In Progress' | 'Completed' | 'High Priority';
    due_date: string;
  }

  const INITIAL_TASKS: Task[] = [
    { id: '1', name: 'Submit Phase 1 Site Report', description: 'Compile all engineer comments and submit to municipal board.', priority: 'High', status: 'In Progress', due_date: '2026-06-20' },
    { id: '2', name: 'Review Steel Raw Procurement Invoice', description: 'Match pricing items with contract rates before approval.', priority: 'Medium', status: 'Pending', due_date: '2026-06-22' },
    { id: '3', name: 'Conduct Site Walkthrough - Sector 4', description: 'Safety inspection checklist completion with supervisors.', priority: 'Low', status: 'Completed', due_date: '2026-06-18' },
    { id: '4', name: 'Finalize Concrete Vendor Agreement', description: 'Review SLA and sign with legal advisors.', priority: 'High', status: 'High Priority', due_date: '2026-06-25' }
  ];

  const COLUMNS: { label: string; status: Task['status']; color: string }[] = [
    { label: 'Not Started', status: 'Pending', color: 'border-slate-800/80 bg-slate-900/20' },
    { label: 'In Progress', status: 'In Progress', color: 'border-blue-500/20 bg-blue-950/10' },
    { label: 'Completed', status: 'Completed', color: 'border-emerald-500/20 bg-emerald-950/10' },
    { label: 'High Priority', status: 'High Priority', color: 'border-rose-500/20 bg-rose-950/10' }
  ];

  export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [search, setSearch] = useState('');
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    
    // Form input states
    const [taskName, setTaskName] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
    const [taskStatus, setTaskStatus] = useState<Task['status']>('Pending');
    const [taskDueDate, setTaskDueDate] = useState('');

    const openCreateModal = () => {
      setEditingTask(null);
      setTaskName('');
      setTaskDesc('');
      setTaskPriority('Medium');
      setTaskStatus('Pending');
      setTaskDueDate(new Date().toISOString().split('T')[0]);
      setIsModalOpen(true);
    };

    const openEditModal = (task: Task) => {
      setEditingTask(task);
      setTaskName(task.name);
      setTaskDesc(task.description);
      setTaskPriority(task.priority);
      setTaskStatus(task.status);
      setTaskDueDate(task.due_date);
      setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (!taskName.trim()) return;

      if (editingTask) {
        setTasks(tasks.map(t => t.id === editingTask.id ? {
          ...t,
          name: taskName,
          description: taskDesc,
          priority: taskPriority,
          status: taskStatus,
          due_date: taskDueDate
        } : t));
      } else {
        const newTask: Task = {
          id: Date.now().toString(),
          name: taskName,
          description: taskDesc,
          priority: taskPriority,
          status: taskStatus,
          due_date: taskDueDate
        };
        setTasks([newTask, ...tasks]);
      }
      setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this task?')) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    };

    // Native Drag and Drop events
    const handleDragStart = (e: React.DragEvent, id: string) => {
      e.dataTransfer.setData('taskId', id);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetStatus: Task['status']) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('taskId');
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: targetStatus } : t));
    };

    const getPriorityBadge = (priority: string) => {
      switch (priority) {
        case 'High':
          return <span className="px-2 py-0.5 rounded border border-red-500/30 bg-red-950/20 text-red-400 font-mono text-[9px] uppercase font-bold tracking-wider">High</span>;
        case 'Medium':
          return <span className="px-2 py-0.5 rounded border border-amber-500/30 bg-amber-950/20 text-amber-400 font-mono text-[9px] uppercase font-bold tracking-wider">Medium</span>;
        default:
          return <span className="px-2 py-0.5 rounded border border-blue-500/30 bg-blue-950/20 text-blue-400 font-mono text-[9px] uppercase font-bold tracking-wider">Low</span>;
      }
    };

    const filteredTasks = tasks.filter(task => 
      task.name.toLowerCase().includes(search.toLowerCase()) || 
      task.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="space-y-6">
        {/* Header title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase font-heading">Daily Tasks Kanban</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Drag and drop tasks to update progress status dynamically.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-505 focus:outline-none focus:border-blue-500/80 transition-all font-mono"
              />
            </div>
            <button 
              onClick={openCreateModal}
              className="btn-primary-custom text-xs font-semibold shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Kanban Board Columns Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {COLUMNS.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.status);
            return (
              <div 
                key={col.status}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.status)}
                className={`p-4 rounded-2xl border ${col.color} flex flex-col min-h-[500px] transition-all`}
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800/60">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{col.label}</span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-800/80 rounded-full text-[10px] text-slate-400 font-semibold">{colTasks.length}</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.map(task => (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl cursor-grab active:cursor-grabbing hover:border-slate-700/80 hover:bg-slate-900 transition-all duration-150 relative group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-semibold text-slate-200 block leading-tight">{task.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{task.description}</p>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-850">
                        {getPriorityBadge(task.priority)}
                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.due_date}
                        </span>
                      </div>

                      {/* Hover action overlay buttons */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button 
                          onClick={() => openEditModal(task)}
                          className="p-1 hover:bg-slate-800 rounded text-emerald-450 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(task.id)}
                          className="p-1 hover:bg-slate-800 rounded text-rose-455 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border border-dashed border-slate-800/40 rounded-xl p-6 text-center text-[11px] text-slate-600 font-mono">
                      Drag tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Popup dialog */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg glass-card rounded-2xl border border-slate-800 shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-heading">
                  {editingTask ? 'Edit Task Spec' : 'Create Task Spec'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Task Title</label>
                  <input 
                    type="text" 
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="e.g. Review municipal site files"
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Description</label>
                  <textarea 
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    placeholder="Enter details..."
                    rows={3}
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Priority</label>
                    <select 
                      value={taskPriority}
                      onChange={(e: any) => setTaskPriority(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-350 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Status</label>
                    <select 
                      value={taskStatus}
                      onChange={(e: any) => setTaskStatus(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-350 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                    >
                      <option value="Pending">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="High Priority">High Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Due Date</label>
                  <input 
                    type="date" 
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-350 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/80">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-400 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-mono rounded-xl shadow-lg transition-all"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit Kanban changes**
  Run:
  ```bash
  git add src/app/(dashboard)/tasks/page.tsx
  git commit -m "feat: convert daily tasks list to native HTML5 drag-and-drop Kanban board"
  ```

---

### Task 5: Meetings CRUD Action Fix

**Files:**
- Modify: `src/app/(dashboard)/meetings/page.tsx`

- [ ] **Step 1: Add Delete button functionality to Meetings list**
  Modify `/home/mavrik/Desktop/Projects/CRM-Panel/app-src/src/app/(dashboard)/meetings/page.tsx` to include a fully functional delete handler and an icon action.

  Add the delete function:
  ```typescript
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this scheduled meeting?')) {
      setMeetings(meetings.filter(m => m.id !== id));
    }
  };
  ```

  And render the delete button next to the Edit button (near line 182):
  ```typescript
                  <button 
                    onClick={() => openEditModal(meet)}
                    className="p-1.5 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-emerald-400 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(meet.id)}
                    className="p-1.5 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-rose-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
  ```
  Make sure `Trash2` is imported from `lucide-react` at the top of `src/app/(dashboard)/meetings/page.tsx`.

- [ ] **Step 2: Commit meetings page changes**
  Run:
  ```bash
  git add src/app/(dashboard)/meetings/page.tsx
  git commit -m "feat: add functional delete meeting action to Scheduled Meetings page"
  ```

---

### Task 6: Chairman Follow-ups Delete Action & Completion Visibility

**Files:**
- Modify: `src/app/(dashboard)/followups/page.tsx`

- [ ] **Step 1: Implement Delete action and styling for Follow-ups**
  Modify `/home/mavrik/Desktop/Projects/CRM-Panel/app-src/src/app/(dashboard)/followups/page.tsx` to add a delete button next to/under the status, and import `Trash2`.

  Add the delete handler:
  ```typescript
  const handleDeleteFollowup = (id: string) => {
    if (confirm('Are you sure you want to delete this board instruction?')) {
      setFollowups(followups.filter(f => f.id !== id));
    }
  };
  ```

  And add the import `Trash2` and delete button in render (next to the status badge, near line 117):
  ```typescript
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase font-heading">{item.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 border rounded font-mono text-[9px] uppercase tracking-wider font-bold shrink-0
                        ${item.status === 'Completed' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20' : 
                          item.status === 'In Progress' ? 'border-blue-500/30 text-blue-400 bg-blue-950/20' : 'border-purple-500/30 text-purple-400 bg-purple-950/20'}
                      `}>
                        {item.status}
                      </span>
                      <button 
                        onClick={() => handleDeleteFollowup(item.id)}
                        className="p-1 hover:bg-slate-800 rounded text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
  ```

- [ ] **Step 2: Commit follow-ups page changes**
  Run:
  ```bash
  git add src/app/(dashboard)/followups/page.tsx
  git commit -m "feat: add delete board instruction action to Chairman Follow-ups"
  ```

---

### Task 7: Documents Vault Actions Update

**Files:**
- Modify: `src/app/(dashboard)/documents/page.tsx`

- [ ] **Step 1: Replace simulated download and verify delete action**
  Modify `/home/mavrik/Desktop/Projects/CRM-Panel/app-src/src/app/(dashboard)/documents/page.tsx` to download a mock file generated on-the-fly inside the browser instead of showing a static alert block.

  Replace simulated download link (near line 181):
  ```typescript
                        <button 
                          onClick={() => {
                            const element = document.createElement("a");
                            const file = new Blob([`Simulated document content for: ${doc.name}\nSize: ${doc.size}\nUploaded: ${doc.uploaded_at}`], {type: 'text/plain'});
                            element.href = URL.createObjectURL(file);
                            element.download = doc.name;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-blue-400 transition-colors cursor-pointer inline-flex border border-slate-850"
                        >
                          <Download className="w-4 h-4" />
                        </button>
  ```

- [ ] **Step 2: Commit document actions update**
  Run:
  ```bash
  git add src/app/(dashboard)/documents/page.tsx
  git commit -m "feat: enable browser-triggered document mock downloads in vault"
  ```

---

### Task 8: Reports Chart & Layout Redesign

**Files:**
- Modify: `src/app/(dashboard)/reports/page.tsx`

- [ ] **Step 1: Redesign Reports chart & layout colors**
  Modify `/home/mavrik/Desktop/Projects/CRM-Panel/app-src/src/app/(dashboard)/reports/page.tsx` to align charts with the updated theme colors (using primary `#3b82f6` and emerald `#10b981` instead of previous colors).

  Replace Recharts configuration near lines 128-129 with:
  ```typescript
                    <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tasks Completed" />
                    <Bar dataKey="issues" fill="#ef4444" radius={[4, 4, 0, 0]} name="Issues Logged" />
  ```

- [ ] **Step 2: Commit reports page changes**
  Run:
  ```bash
  git add src/app/(dashboard)/reports/page.tsx
  git commit -m "style: update reports analytics chart colors to match theme palette"
  ```
