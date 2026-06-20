'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, X, MessageSquare, Calendar, Check, Send, Sparkles, Trash2, Search, ChevronLeft, ChevronRight
} from 'lucide-react';

interface FollowUp {
  id: string;
  title: string;
  instruction: string;
  due_date: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  remarks: string[];
  completed_at?: string;
}

const INITIAL_FOLLOWUPS: FollowUp[] = [
  { id: '1', title: 'Site A Foundation Finishing', instruction: 'Make sure foundation concrete slab curing is completed before Friday inspection.', due_date: '2026-06-20', status: 'In Progress', remarks: ['Watering cycles started.', 'Contractor confirmed timeline.'] },
  { id: '2', title: 'Approve Material Testing Invoices', instruction: 'Verify testing invoices of sector 2 steel batches.', due_date: '2026-06-25', status: 'Pending', remarks: [] },
  { id: '3', title: 'Municipal Layout Verification', instruction: 'Submit structural layout drawings for municipal verification.', due_date: '2026-06-19', status: 'Completed', remarks: ['Submitted to desk 4.'], completed_at: new Date().toISOString() }, // completed today
  { id: '4', title: 'Steel raw procurement check', instruction: 'Cross-check pricing templates with cement invoice.', due_date: '2026-06-18', status: 'Completed', remarks: ['Matches pricing contract.'], completed_at: '2026-06-18T10:15:00Z' }, // previous day
  { id: '5', title: 'Labor accommodation signoff', instruction: 'Inspect block B accommodation quarters.', due_date: '2026-06-17', status: 'Completed', remarks: ['Inspected and signed.'], completed_at: '2026-06-17T11:22:00Z' }  // previous day
];

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRemarkText, setNewRemarkText] = useState<{ [key: string]: string }>({});

  // Search/Filter state
  const [activeSearch, setActiveSearch] = useState('');
  const [recordsSearch, setRecordsSearch] = useState('');

  // Pagination for archive
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Form input states
  const [title, setTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem('crm_followups');
    if (stored) {
      setFollowups(JSON.parse(stored));
    } else {
      setFollowups(INITIAL_FOLLOWUPS);
      localStorage.setItem('crm_followups', JSON.stringify(INITIAL_FOLLOWUPS));
    }
  }, []);

  const saveFollowups = (updated: FollowUp[]) => {
    setFollowups(updated);
    localStorage.setItem('crm_followups', JSON.stringify(updated));
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

  // Active followups: NOT completed OR completed TODAY
  const activeFollowups = followups.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(activeSearch.toLowerCase()) || 
                          item.instruction.toLowerCase().includes(activeSearch.toLowerCase());
    if (!matchesSearch) return false;

    const isCompleted = item.status === 'Completed';
    const isCompletedToday = isCompleted && isToday(item.completed_at);
    return !isCompleted || isCompletedToday;
  });

  // Archive Table: All Completed (both today and historical, for audit completeness)
  const completedArchive = followups.filter(item => {
    if (item.status !== 'Completed') return false;
    const matchesSearch = item.title.toLowerCase().includes(recordsSearch.toLowerCase()) || 
                          item.instruction.toLowerCase().includes(recordsSearch.toLowerCase());
    return matchesSearch;
  });

  // Pagination Math
  const totalRecords = completedArchive.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage) || 1;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = completedArchive.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleSaveFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instruction.trim()) return;

    const newFollowup: FollowUp = {
      id: Date.now().toString(),
      title,
      instruction,
      due_date: dueDate || new Date().toISOString().split('T')[0],
      status: 'Pending',
      remarks: []
    };

    saveFollowups([newFollowup, ...followups]);
    setIsModalOpen(false);
    setTitle('');
    setInstruction('');
    setDueDate('');
  };

  const handleAddRemark = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = newRemarkText[id];
    if (!text || !text.trim()) return;

    const updated = followups.map(f => {
      if (f.id === id) {
        return {
          ...f,
          remarks: [...f.remarks, text.trim()]
        };
      }
      return f;
    });
    saveFollowups(updated);
    setNewRemarkText({ ...newRemarkText, [id]: '' });
  };

  const handleStatusChange = (id: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    const updated = followups.map(f => {
      if (f.id === id) {
        const statusChangedToCompleted = newStatus === 'Completed' && f.status !== 'Completed';
        return {
          ...f,
          status: newStatus,
          completed_at: statusChangedToCompleted ? new Date().toISOString() : f.completed_at
        };
      }
      return f;
    });
    saveFollowups(updated);
  };

  const handleDeleteFollowup = (id: string, isRecord = false) => {
    const msg = isRecord 
      ? 'Are you sure you want to permanently delete this completed board instruction record?'
      : 'Are you sure you want to delete this board instruction?';
    if (confirm(msg)) {
      saveFollowups(followups.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* SECTION 1: TIMELINE */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase font-heading">Chairman Follow-Ups</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Direct board orders and instruction timeline tracker.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                value={activeSearch}
                onChange={(e) => setActiveSearch(e.target.value)}
                placeholder="Search instructions..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-805 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition-all font-mono"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary-custom text-xs font-semibold shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Instruction</span>
            </button>
          </div>
        </div>

        {/* Timeline listing */}
        <div className="space-y-6 relative before:absolute before:top-4 before:bottom-4 before:left-6 before:w-0.5 before:bg-slate-800 max-w-4xl">
          <AnimatePresence mode="popLayout">
            {activeFollowups.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: idx * 0.05 }}
                key={item.id} 
                className="flex gap-6 relative"
              >
                {/* Timeline node */}
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 z-10 bg-slate-950
                  ${item.status === 'Completed' ? 'border-emerald-500/40 text-emerald-400' : 
                    item.status === 'In Progress' ? 'border-blue-500/40 text-blue-400' : 'border-purple-500/40 text-purple-400'}
                `}>
                  <Sparkles className="w-5 h-5" />
                </div>

                {/* Content card */}
                <div className="flex-1 glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-all duration-150">
                  <div>
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
                          onClick={() => handleDeleteFollowup(item.id, false)}
                          className="p-1 hover:bg-slate-800 rounded text-rose-455 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-350 font-mono mt-3 leading-relaxed">{item.instruction}</p>

                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-505 mt-4">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>DUE DATE: {item.due_date}</span>
                    </div>
                  </div>

                  {/* Status Update Quick Triggers */}
                  <div className="flex gap-2 mt-4 border-t border-slate-850 pt-4">
                    {item.status !== 'Completed' && (
                      <button 
                        onClick={() => handleStatusChange(item.id, 'Completed')}
                        className="px-3 py-1.5 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1 font-mono"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark Completed
                      </button>
                    )}
                    {item.status === 'Pending' && (
                      <button 
                        onClick={() => handleStatusChange(item.id, 'In Progress')}
                        className="px-3 py-1.5 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1 font-mono"
                      >
                        In Progress
                      </button>
                    )}
                  </div>

                  {/* Remarks/Remarks Timeline panel */}
                  <div className="mt-4 pt-4 border-t border-slate-850 space-y-3">
                    <h4 className="text-[10px] uppercase tracking-wider text-slate-450 font-mono font-bold flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Updates & Remarks
                    </h4>

                    {item.remarks.length > 0 && (
                      <div className="space-y-2 max-h-36 overflow-y-auto pl-1">
                        {item.remarks.map((rem, ridx) => (
                          <div key={ridx} className="p-2 bg-slate-900/30 border border-slate-850 rounded-xl font-mono text-[11px] text-slate-400">
                            {rem}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add remark form input */}
                    <form onSubmit={(e) => handleAddRemark(item.id, e)} className="flex gap-2">
                      <input 
                        type="text" 
                        value={newRemarkText[item.id] || ''}
                        onChange={(e) => setNewRemarkText({ ...newRemarkText, [item.id]: e.target.value })}
                        placeholder="Add operational remark..."
                        className="flex-1 px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                      />
                      <button 
                        type="submit"
                        className="p-1.5 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-400 rounded-xl transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {activeFollowups.length === 0 && (
            <div className="glass-card p-10 rounded-2xl text-center text-slate-550 border border-dashed border-slate-800/40 font-mono text-xs">
              No active Board followups listed.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: FOLLOW-UPS ARCHIVE */}
      <div className="premium-card space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-wider text-slate-200 uppercase font-heading">Follow-Ups Archive</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Permanent historical log of completed direct instructions.</p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              value={recordsSearch}
              onChange={(e) => { setRecordsSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search archive..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-805 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition-all font-mono"
            />
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800/80 text-slate-400 font-mono uppercase tracking-wider">
                <th className="py-3.5 px-5">Subject / Order</th>
                <th className="py-3.5 px-5">Due Date</th>
                <th className="py-3.5 px-5">Remarks</th>
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
                      <span className="font-semibold text-slate-200 block">{doc.title}</span>
                      <span className="text-[11px] text-slate-450 mt-1 block truncate max-w-md">{doc.instruction}</span>
                    </td>
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-350">
                      {doc.due_date}
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-slate-400 font-mono italic truncate block max-w-[200px]">
                        {doc.remarks[doc.remarks.length - 1] || 'No remarks'}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-400">
                      {formattedCompletedDate}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button 
                        onClick={() => handleDeleteFollowup(doc.id, true)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-red-405 transition-colors cursor-pointer inline-flex"
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
                    No historical instructions found.
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

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass-card rounded-2xl border border-slate-800 shadow-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-heading">
                New Board Instruction
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-800 rounded text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFollowup} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Subject / Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Site A safety audits"
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Chairman Instruction Spec</label>
                <textarea 
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Paste direct instruction text..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
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
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-mono rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Save Order
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
