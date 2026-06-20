'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Check, Trash2, Calendar, Clock, Square, Search, ChevronLeft, ChevronRight, AlertCircle 
} from 'lucide-react';

interface Todo {
  id: string;
  name: string;
  due_time: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  created_at: string;
  completed_at?: string;
}

const INITIAL_TODOS: Todo[] = [
  { id: '1', name: 'Draft the monthly site safety briefing outline', due_time: '10:00 AM', completed: true, priority: 'Medium', created_at: '2026-06-20T08:00:00Z', completed_at: new Date().toISOString() }, // completed today
  { id: '2', name: 'Call mechanical supervisor regarding material test reports', due_time: '12:00 PM', completed: false, priority: 'High', created_at: '2026-06-20T09:00:00Z' },
  { id: '3', name: 'Approve pending leave requests in HR panel', due_time: '02:30 PM', completed: false, priority: 'Medium', created_at: '2026-06-20T09:30:00Z' },
  { id: '4', name: 'Submit site photographs to the structural advisor', due_time: '04:00 PM', completed: false, priority: 'Low', created_at: '2026-06-20T10:00:00Z' },
  { id: '5', name: 'Coordinate crane maintenance schedule', due_time: '09:00 AM', completed: true, priority: 'High', created_at: '2026-06-19T08:00:00Z', completed_at: '2026-06-19T09:00:00Z' }, // previous day completed
  { id: '6', name: 'Verify structural design blueprint amendments', due_time: '11:00 AM', completed: true, priority: 'High', created_at: '2026-06-18T08:00:00Z', completed_at: '2026-06-18T11:15:00Z' } // previous day completed
];

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState('');
  const [newTodoTime, setNewTodoTime] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  
  // Records table search & page state
  const [recordsSearch, setRecordsSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem('crm_todos');
    if (stored) {
      setTodos(JSON.parse(stored));
    } else {
      setTodos(INITIAL_TODOS);
      localStorage.setItem('crm_todos', JSON.stringify(INITIAL_TODOS));
    }
  }, []);

  const saveTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
    localStorage.setItem('crm_todos', JSON.stringify(newTodos));
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

  // Active checklist: not completed OR completed today
  const activeTodos = todos.filter(todo => !todo.completed || isToday(todo.completed_at));

  // Archived completed records: completed on previous days
  const completedRecords = todos.filter(todo => {
    if (!todo.completed) return false;
    if (isToday(todo.completed_at)) return false;
    
    return todo.name.toLowerCase().includes(recordsSearch.toLowerCase());
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoName.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      name: newTodoName,
      due_time: newTodoTime || 'No specific time',
      completed: false,
      priority: newTodoPriority,
      created_at: new Date().toISOString()
    };

    saveTodos([newTodo, ...todos]);
    setNewTodoName('');
    setNewTodoTime('');
    setNewTodoPriority('Medium');
  };

  const handleToggle = (id: string) => {
    const updated = todos.map(todo => {
      if (todo.id === id) {
        const completed = !todo.completed;
        return {
          ...todo,
          completed,
          completed_at: completed ? new Date().toISOString() : undefined
        };
      }
      return todo;
    });
    saveTodos(updated);
  };

  const handleDelete = (id: string, isRecord = false) => {
    const msg = isRecord 
      ? 'Are you sure you want to permanently delete this To-Do record?'
      : 'Are you sure you want to delete this checklist item?';
    if (confirm(msg)) {
      saveTodos(todos.filter(t => t.id !== id));
    }
  };

  // Pagination for Records
  const totalRecords = completedRecords.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage) || 1;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = completedRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  // Active Progress
  const totalActive = activeTodos.length;
  const completedActive = activeTodos.filter(t => t.completed).length;
  const activeCompletionPercentage = totalActive > 0 ? Math.round((completedActive / totalActive) * 100) : 0;

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'border-red-500/30 text-red-400 bg-red-950/20';
      case 'Medium':
        return 'border-amber-500/30 text-amber-400 bg-amber-950/20';
      default:
        return 'border-blue-500/30 text-blue-400 bg-blue-950/20';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      
      {/* TITLE HEADERS */}
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase font-heading">Operations Checklist</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">Checklist items for active daily routines & historical records archive.</p>
      </div>

      {/* SECTION 1: ACTIVE CHECKLIST */}
      <div className="space-y-6">
        
        {/* Progress bar card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center mb-3 font-mono text-xs text-slate-350">
            <span className="font-semibold uppercase tracking-wider">Today's Progress</span>
            <span className="text-emerald-400 font-bold">{completedActive} / {totalActive} Cleared ({activeCompletionPercentage}%)</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500" 
              initial={{ width: 0 }}
              animate={{ width: `${activeCompletionPercentage}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Add form panel */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800/80 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-heading mb-4">Add Routine Item</h3>
            
            <form onSubmit={handleAddTodo} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Item Name</label>
                <input 
                  type="text" 
                  value={newTodoName}
                  onChange={(e) => setNewTodoName(e.target.value)}
                  placeholder="e.g. Schedule cement delivery"
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Target Time</label>
                  <input 
                    type="text" 
                    value={newTodoTime}
                    onChange={(e) => setNewTodoTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Priority</label>
                  <select
                    value={newTodoPriority}
                    onChange={(e: any) => setNewTodoPriority(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-350 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-mono font-medium rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Checklist Item</span>
              </button>
            </form>
          </div>

          {/* Checklist display panel */}
          <div className="md:col-span-2 space-y-3">
            <AnimatePresence mode="popLayout">
              {activeTodos.map(todo => (
                <motion.div 
                  layout
                  key={todo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`glass-card p-4 rounded-xl border flex items-center justify-between transition-all font-mono text-xs group
                    ${todo.completed 
                      ? 'bg-slate-900/20 border-slate-800/40 text-slate-500' 
                      : 'bg-slate-900/40 border-slate-800 text-slate-350 hover:border-slate-700'
                    }
                  `}
                >
                  <div 
                    onClick={() => handleToggle(todo.id)}
                    className="flex items-center gap-4 flex-1 cursor-pointer min-w-0"
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0
                      ${todo.completed ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'border-slate-700'}
                    `}>
                      {todo.completed ? <Check className="w-3.5 h-3.5" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`block truncate ${todo.completed ? 'line-through text-slate-550' : 'text-slate-200'}`}>{todo.name}</span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{todo.due_time}</span>
                        </div>
                        <span className={`px-2 py-0.5 border rounded font-mono text-[8px] uppercase font-bold tracking-wider ${getPriorityStyle(todo.priority)}`}>
                          {todo.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDelete(todo.id, false)}
                    className="p-1.5 hover:bg-red-950/20 rounded-lg text-slate-500 hover:text-red-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {activeTodos.length === 0 && (
              <div className="glass-card p-10 rounded-2xl text-center text-slate-550 border border-dashed border-slate-800/40 font-mono text-xs flex flex-col items-center gap-2">
                <AlertCircle className="w-6 h-6 text-slate-650" />
                <span>No active routines listed for today. Add items to get started!</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SECTION 2: TO-DO RECORDS */}
      <div className="premium-card space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-wider text-slate-200 uppercase font-heading">Checklist Records</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Historical log of all cleared routine checklist items.</p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              value={recordsSearch}
              onChange={(e) => { setRecordsSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search records..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-805 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition-all font-mono"
            />
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800/80 text-slate-400 font-mono uppercase tracking-wider">
                <th className="py-3.5 px-5">Checklist Item</th>
                <th className="py-3.5 px-5">Target Time</th>
                <th className="py-3.5 px-5">Priority</th>
                <th className="py-3.5 px-5">Completed On</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {currentRecords.map(doc => {
                const compDate = doc.completed_at ? new Date(doc.completed_at) : null;
                const formattedCompletedDate = compDate 
                  ? compDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + compDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '--';

                return (
                  <tr key={doc.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-semibold text-slate-350 block line-through">{doc.name}</span>
                    </td>
                    <td className="py-4 px-5 text-slate-400 font-mono">
                      {doc.due_time}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2 py-0.5 border rounded font-mono text-[9px] uppercase font-bold tracking-wider ${getPriorityStyle(doc.priority)}`}>
                        {doc.priority}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-400">
                      {formattedCompletedDate}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button 
                        onClick={() => handleDelete(doc.id, true)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-red-400 transition-colors cursor-pointer inline-flex"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {currentRecords.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 px-5 text-center text-slate-500 font-mono text-[11px]">
                    No historical routine records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center text-xs font-mono text-slate-450 pt-2">
            <span>Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, totalRecords)} of {totalRecords} records</span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1.5 rounded transition-all cursor-pointer font-bold
                    ${currentPage === p 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-450'}
                  `}
                >
                  {p}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
