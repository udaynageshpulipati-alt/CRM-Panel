'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Plus, Clock, Users, Calendar, Sparkles, ClipboardList, Trash2, Pause, RotateCw
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

  // To-Do List state backed by localStorage
  interface TodoItem {
    id: string;
    name: string;
    due_time: string;
    completed: boolean;
    priority: 'High' | 'Medium' | 'Low';
    created_at: string;
    completed_at?: string;
  }

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  useEffect(() => {
    const stored = localStorage.getItem('crm_todos');
    if (stored) {
      setTodos(JSON.parse(stored));
    } else {
      const INITIAL_TODOS_MOCK: TodoItem[] = [
        { id: '1', name: 'Draft the monthly site safety briefing outline', due_time: '10:00 AM', completed: true, priority: 'Medium', created_at: new Date().toISOString(), completed_at: new Date().toISOString() },
        { id: '2', name: 'Call mechanical supervisor regarding material test reports', due_time: '12:00 PM', completed: false, priority: 'High', created_at: new Date().toISOString() },
        { id: '3', name: 'Approve pending leave requests in HR panel', due_time: '02:30 PM', completed: false, priority: 'Medium', created_at: new Date().toISOString() },
        { id: '4', name: 'Submit site photographs to the structural advisor', due_time: '04:00 PM', completed: false, priority: 'Low', created_at: new Date().toISOString() }
      ];
      setTodos(INITIAL_TODOS_MOCK);
      localStorage.setItem('crm_todos', JSON.stringify(INITIAL_TODOS_MOCK));
    }
  }, []);

  const saveTodos = (updated: TodoItem[]) => {
    setTodos(updated);
    localStorage.setItem('crm_todos', JSON.stringify(updated));
  };

  const isToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Only display active: not completed OR completed today
  const activeTodos = todos.filter(todo => !todo.completed || isToday(todo.completed_at));

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      name: newTodoText,
      due_time: 'ASAP',
      completed: false,
      priority: newTodoPriority,
      created_at: new Date().toISOString()
    };
    saveTodos([newTodo, ...todos]);
    setNewTodoText('');
  };

  const handleToggleTodo = (id: string) => {
    const updated = todos.map(t => {
      if (t.id === id) {
        const completed = !t.completed;
        return {
          ...t,
          completed,
          completed_at: completed ? new Date().toISOString() : undefined
        };
      }
      return t;
    });
    saveTodos(updated);
  };

  const handleDeleteTodo = (id: string) => {
    saveTodos(todos.filter(t => t.id !== id));
  };

  const totalTasks = activeTodos.length;
  const completedTasks = activeTodos.filter(t => t.completed).length;
  const pendingTasks = activeTodos.filter(t => !t.completed && t.priority === 'High').length;
  const inProgressTasks = activeTodos.filter(t => !t.completed && t.priority === 'Medium').length;
  const onHoldTasks = activeTodos.filter(t => !t.completed && t.priority === 'Low').length;

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
                  {activeTodos.filter(t => !t.completed).length} pending · {activeTodos.filter(t => t.completed).length} completed
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
                className="px-3 bg-slate-900 border border-slate-805 rounded-xl text-xs text-slate-300 focus:outline-none"
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
                {activeTodos.filter(t => !t.completed).map(todo => (
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
                        <span className="text-xs font-semibold text-slate-200 block truncate">{todo.name}</span>
                        {/* Progress bar */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-1.5 bg-slate-950 border border-slate-800/60 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${todo.completed ? 100 : 0}%` }} />
                          </div>
                          <span className="text-[9px] font-mono text-slate-500">{todo.completed ? 100 : 0}%</span>
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
                      <span className="px-2 py-0.5 border border-slate-805 rounded text-[9px] text-slate-400 bg-slate-900/60 font-mono">
                        {todo.completed ? 'Completed' : 'Pending'}
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
              {activeTodos.some(t => t.completed) && (
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-3 font-semibold">Completed</span>
                  <div className="space-y-2">
                    {activeTodos.filter(t => t.completed).map(todo => (
                      <div 
                        key={todo.id}
                        className="p-3 bg-slate-900/10 border border-slate-850 rounded-xl flex items-center justify-between gap-4 opacity-60"
                      >
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleToggleTodo(todo.id)}
                            className="w-5 h-5 rounded-full border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center text-emerald-400 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <span className="text-xs text-slate-400 line-through truncate max-w-xs">{todo.name}</span>
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
                  <circle cx="40" cy="40" r="34" className="stroke-slate-800" strokeWidth="6" fill="transparent" />
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
              <div className="flex justify-between text-slate-400 font-medium">
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
                        : 'border-slate-850 bg-slate-900/60 text-slate-400 hover:border-slate-705'}
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
              <div className="space-y-1 border-l border-slate-800/80 pl-3">
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
