'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, X, Clock, Calendar, Check, ChevronLeft, ChevronRight, User, MoreVertical
} from 'lucide-react';
import { useAuth } from '@/components/AuthContext';

interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed' | 'High Priority';
  due_date: string;
  assigned_by?: string;
  created_at?: string;
  completed_at?: string;
}

const INITIAL_TASKS: Task[] = [
  { id: '1', name: 'Submit Phase 1 Site Report', description: 'Compile all engineer comments and submit to municipal board.', priority: 'High', status: 'In Progress', due_date: '2026-06-20', assigned_by: 'Shero', created_at: '2026-06-19T10:00:00Z' },
  { id: '2', name: 'Review Steel Raw Procurement Invoice', description: 'Match pricing items with contract rates before approval.', priority: 'Medium', status: 'Pending', due_date: '2026-06-22', assigned_by: 'Shero', created_at: '2026-06-18T14:30:00Z' },
  { id: '3', name: 'Conduct Site Walkthrough - Sector 4', description: 'Safety inspection checklist completion with supervisors.', priority: 'Low', status: 'Completed', due_date: '2026-06-18', assigned_by: 'Shero', created_at: '2026-06-17T09:00:00Z', completed_at: new Date().toISOString() }, // completed today
  { id: '4', name: 'Finalize Concrete Vendor Agreement', description: 'Review SLA and sign with legal advisors.', priority: 'High', status: 'High Priority', due_date: '2026-06-25', assigned_by: 'Shero', created_at: '2026-06-19T11:00:00Z' },
  { id: '5', name: 'Conduct Site Walkthrough - Sector 3', description: 'Weekly safety inspection completed.', priority: 'Low', status: 'Completed', due_date: '2026-06-18', assigned_by: 'Shero', created_at: '2026-06-15T09:00:00Z', completed_at: '2026-06-18T10:24:00Z' }, // previous day
  { id: '6', name: 'Verify Material Delivery Notes', description: 'Cross-check and confirm all deliveries.', priority: 'Medium', status: 'Completed', due_date: '2026-06-17', assigned_by: 'Shero', created_at: '2026-06-14T16:45:00Z', completed_at: '2026-06-17T16:45:00Z' }, // previous day
  { id: '7', name: 'Update Project Cost Sheet', description: 'Reflect latest vendor quotations.', priority: 'Medium', status: 'Completed', due_date: '2026-06-16', assigned_by: 'Shero', created_at: '2026-06-13T11:30:00Z', completed_at: '2026-06-16T11:30:00Z' }, // previous day
  { id: '8', name: 'Review Safety Compliance Docs', description: 'Ensure all documents are up to date.', priority: 'Low', status: 'Completed', due_date: '2026-06-15', assigned_by: 'Shero', created_at: '2026-06-12T15:20:00Z', completed_at: '2026-06-15T15:20:00Z' }, // previous day
  { id: '9', name: 'Site Progress Photo Upload', description: 'Upload and tag photos in system.', priority: 'Low', status: 'Completed', due_date: '2026-06-14', assigned_by: 'Shero', created_at: '2026-06-11T09:10:00Z', completed_at: '2026-06-14T09:10:00Z' }  // previous day
];

const COLUMNS: { label: string; status: Task['status']; color: string }[] = [
  { label: 'Not Started', status: 'Pending', color: 'border-slate-800/80 bg-slate-900/10' },
  { label: 'In Progress', status: 'In Progress', color: 'border-blue-500/20 bg-blue-950/5' },
  { label: 'Completed', status: 'Completed', color: 'border-emerald-500/20 bg-emerald-950/5' },
  { label: 'High Priority', status: 'High Priority', color: 'border-rose-500/20 bg-rose-950/5' }
];

export default function TasksPage() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeSearch, setActiveSearch] = useState('');
  const [recordsSearch, setRecordsSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [taskStatus, setTaskStatus] = useState<Task['status']>('Pending');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem('crm_tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      setTasks(INITIAL_TASKS);
      localStorage.setItem('crm_tasks', JSON.stringify(INITIAL_TASKS));
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('crm_tasks', JSON.stringify(newTasks));
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

  // Filter Tasks for Active Kanban Board
  // Shows non-completed tasks OR completed TODAY.
  const activeTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(activeSearch.toLowerCase()) || 
                          task.description.toLowerCase().includes(activeSearch.toLowerCase());
    const isCompleted = task.status === 'Completed';
    const isCompletedToday = isCompleted && isToday(task.completed_at);
    
    return matchesSearch && (!isCompleted || isCompletedToday);
  });

  // Filter Tasks for Task Records
  // Shows all completed tasks (historical + today).
  const completedTasks = tasks.filter(task => {
    if (task.status !== 'Completed') return false;
    const matchesSearch = task.name.toLowerCase().includes(recordsSearch.toLowerCase()) || 
                          task.description.toLowerCase().includes(recordsSearch.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  // Pagination Math
  const totalRecords = completedTasks.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage) || 1;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = completedTasks.slice(indexOfFirstRecord, indexOfLastRecord);

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

    let updatedTasks: Task[] = [];
    if (editingTask) {
      updatedTasks = tasks.map(t => {
        if (t.id === editingTask.id) {
          const statusChangedToCompleted = taskStatus === 'Completed' && t.status !== 'Completed';
          return {
            ...t,
            name: taskName,
            description: taskDesc,
            priority: taskPriority,
            status: taskStatus,
            due_date: taskDueDate,
            completed_at: statusChangedToCompleted ? new Date().toISOString() : t.completed_at
          };
        }
        return t;
      });
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        name: taskName,
        description: taskDesc,
        priority: taskPriority,
        status: taskStatus,
        due_date: taskDueDate,
        assigned_by: profile?.full_name || 'Shero',
        created_at: new Date().toISOString(),
        completed_at: taskStatus === 'Completed' ? new Date().toISOString() : undefined
      };
      updatedTasks = [newTask, ...tasks];
    }

    saveTasks(updatedTasks);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, isRecord = false) => {
    const message = isRecord 
      ? 'Are you sure you want to permanently delete this completed task record?'
      : 'Are you sure you want to delete this active task?';
      
    if (confirm(message)) {
      saveTasks(tasks.filter(t => t.id !== id));
    }
  };

  // Handle Drag and Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task['status']) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('taskId');
    if (!id) return;

    const updated = tasks.map(t => {
      if (t.id === id) {
        const isCompleted = targetStatus === 'Completed';
        return {
          ...t,
          status: targetStatus,
          completed_at: isCompleted ? new Date().toISOString() : undefined
        };
      }
      return t;
    });
    saveTasks(updated);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 rounded border border-red-500/30 bg-red-950/20 text-red-400 font-mono text-[9px] uppercase font-bold tracking-wider text-center">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded border border-amber-500/30 bg-amber-950/20 text-amber-400 font-mono text-[9px] uppercase font-bold tracking-wider text-center">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded border border-blue-500/30 bg-blue-950/20 text-blue-400 font-mono text-[9px] uppercase font-bold tracking-wider text-center">Low</span>;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* SECTION 1: ACTIVE KANBAN BOARD */}
      <div className="space-y-6">
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
                value={activeSearch}
                onChange={(e) => setActiveSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-805 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition-all font-mono"
              />
            </div>
            <button 
              onClick={openCreateModal}
              className="btn-primary-custom text-xs font-semibold shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Board grid columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {COLUMNS.map(col => {
            const colTasks = activeTasks.filter(t => t.status === col.status);
            return (
              <div 
                key={col.status}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.status)}
                className={`p-4 rounded-2xl border ${col.color} flex flex-col min-h-[420px] transition-all`}
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800/60">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{col.label}</span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-800/80 rounded-full text-[10px] text-slate-400 font-semibold">{colTasks.length}</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1 min-h-[300px]">
                  {colTasks.map(task => (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl cursor-grab active:cursor-grabbing hover:border-slate-750 hover:bg-slate-900 transition-all duration-150 relative group"
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

                      {/* Action buttons overlay */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                        <button 
                          onClick={() => openEditModal(task)}
                          className="p-1 hover:bg-slate-800 rounded text-emerald-450 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(task.id, false)}
                          className="p-1 hover:bg-slate-800 rounded text-rose-450 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="h-full flex items-center justify-center border border-dashed border-slate-800/40 rounded-xl p-6 text-center text-[10px] text-slate-600 font-mono">
                      Drag tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: TASK RECORDS */}
      <div className="premium-card space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-wider text-slate-200 uppercase font-heading">Task Records</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">All completed tasks are stored here for your reference.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-950/60 border border-slate-805 rounded-xl text-xs text-slate-300 focus:outline-none"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Search records */}
            <div className="relative flex-1 sm:max-w-xs w-full">
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
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800/80 text-slate-400 font-mono uppercase tracking-wider">
                <th className="py-3.5 px-5">Task Name</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Priority</th>
                <th className="py-3.5 px-5">Completed On</th>
                <th className="py-3.5 px-5">Completed By</th>
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
                      <span className="font-semibold text-slate-200 block">{doc.name}</span>
                      <span className="text-[11px] text-slate-450 mt-1 block truncate max-w-md">{doc.description}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-950/20 rounded font-mono text-[9px] uppercase font-bold tracking-wider">
                        COMPLETED
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {getPriorityBadge(doc.priority)}
                    </td>
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-350">
                      {formattedCompletedDate}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600/10 border border-blue-500/25 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <span className="font-medium text-slate-300">{doc.assigned_by || 'Shero'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right space-x-1">
                      <button 
                        onClick={() => openEditModal(doc)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-emerald-400 transition-colors cursor-pointer inline-flex"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
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
                  <td colSpan={6} className="py-8 px-5 text-center text-slate-500 font-mono text-[11px]">
                    No completed task records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
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

      {/* CREATE & EDIT MODAL */}
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
                className="p-1 hover:bg-slate-800 rounded text-slate-500 cursor-pointer"
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
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-400 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-mono rounded-xl shadow-lg transition-all cursor-pointer"
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
