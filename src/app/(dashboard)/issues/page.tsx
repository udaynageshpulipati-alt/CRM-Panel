'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, AlertTriangle, Play, CheckCircle2, X, Info, 
  User, Check, Loader2, ArrowRight, ShieldAlert, Search, Trash2, ChevronLeft, ChevronRight
} from 'lucide-react';

interface BlockerIssue {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  assigned_to: string;
  raised_by: string;
  date_raised: string;
  resolved_at?: string;
}

const INITIAL_ISSUES: BlockerIssue[] = [
  { id: '1', title: 'Site B Design Approval Delay', description: 'Municipal regulatory team requests updated structural load tests before seal approvals.', priority: 'High', status: 'Open', assigned_to: 'Shero', raised_by: 'Supervisor Mike', date_raised: '2026-06-17' },
  { id: '2', title: 'Steel Raw Material Supply Disruption', description: 'Logistics cargo truck delayed at state border checkpoint.', priority: 'Medium', status: 'In Progress', assigned_to: 'Procurement Dept', raised_by: 'Shero', date_raised: '2026-06-18' },
  { id: '3', title: 'Power Generator Failure - Sector 3', description: 'Backup generator failed to start during local grid outage.', priority: 'High', status: 'Resolved', assigned_to: 'Electrical Team', raised_by: 'Site Supervisor', date_raised: '2026-06-15', resolved_at: new Date().toISOString() }, // resolved today
  { id: '4', title: 'Excavation Permit Hold', description: 'Environmental assessment clearance certificate pending signoff.', priority: 'High', status: 'Resolved', assigned_to: 'Legal Team', raised_by: 'Shero', date_raised: '2026-06-10', resolved_at: '2026-06-14T11:00:00Z' }, // resolved previous day
  { id: '5', title: 'Contractor Payment Dispute', description: 'Subcontractor requested invoice review on masonry concrete batching rates.', priority: 'Medium', status: 'Resolved', assigned_to: 'Finance Dept', raised_by: 'Supervisor Mike', date_raised: '2026-06-12', resolved_at: '2026-06-15T16:45:00Z' } // resolved previous day
];

export default function IssuesPage() {
  const [issues, setIssues] = useState<BlockerIssue[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search/Filter state
  const [activeSearch, setActiveSearch] = useState('');
  const [recordsSearch, setRecordsSearch] = useState('');

  // Pagination for records
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Form input states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [assignedTo, setAssignedTo] = useState('');

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem('crm_issues');
    if (stored) {
      setIssues(JSON.parse(stored));
    } else {
      setIssues(INITIAL_ISSUES);
      localStorage.setItem('crm_issues', JSON.stringify(INITIAL_ISSUES));
    }
  }, []);

  const saveIssues = (updated: BlockerIssue[]) => {
    setIssues(updated);
    localStorage.setItem('crm_issues', JSON.stringify(updated));
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

  // Active Blockers: Status is NOT Resolved OR Resolved TODAY
  const activeBlockers = issues.filter(iss => {
    const matchesSearch = iss.title.toLowerCase().includes(activeSearch.toLowerCase()) || 
                          iss.description.toLowerCase().includes(activeSearch.toLowerCase());
    if (!matchesSearch) return false;

    const isResolved = iss.status === 'Resolved';
    const isResolvedToday = isResolved && isToday(iss.resolved_at);
    return !isResolved || isResolvedToday;
  });

  // Archive Records: Resolved status
  const resolvedArchive = issues.filter(iss => {
    if (iss.status !== 'Resolved') return false;
    const matchesSearch = iss.title.toLowerCase().includes(recordsSearch.toLowerCase()) || 
                          iss.description.toLowerCase().includes(recordsSearch.toLowerCase());
    return matchesSearch;
  });

  // Pagination Math
  const totalRecords = resolvedArchive.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage) || 1;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = resolvedArchive.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleSaveIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newIssue: BlockerIssue = {
      id: Date.now().toString(),
      title,
      description: desc,
      priority,
      status: 'Open',
      assigned_to: assignedTo || 'Unassigned',
      raised_by: 'Shero',
      date_raised: new Date().toISOString().split('T')[0]
    };

    saveIssues([newIssue, ...issues]);
    setIsModalOpen(false);
    setTitle('');
    setDesc('');
    setPriority('Medium');
    setAssignedTo('');
  };

  const updateStatus = (id: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    const updated = issues.map(iss => {
      if (iss.id === id) {
        const resolvedToday = newStatus === 'Resolved';
        return { 
          ...iss, 
          status: newStatus,
          resolved_at: resolvedToday ? new Date().toISOString() : iss.resolved_at
        };
      }
      return iss;
    });
    saveIssues(updated);
  };

  const handleDeleteIssue = (id: string, isRecord = false) => {
    const msg = isRecord 
      ? 'Are you sure you want to permanently delete this resolved issue record?'
      : 'Are you sure you want to delete this active blocker issue?';
    if (confirm(msg)) {
      saveIssues(issues.filter(iss => iss.id !== id));
    }
  };

  const getPriorityColors = (prio: string) => {
    switch (prio) {
      case 'High':
        return 'border-red-500/30 text-red-400 bg-red-950/20';
      case 'Medium':
        return 'border-amber-500/30 text-amber-400 bg-amber-950/20';
      default:
        return 'border-blue-500/30 text-blue-400 bg-blue-950/20';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 font-mono text-[9px] uppercase font-bold tracking-wider">Resolved</span>;
      case 'In Progress':
        return <span className="px-2 py-0.5 rounded border border-blue-500/30 bg-blue-950/20 text-blue-400 font-mono text-[9px] uppercase font-bold tracking-wider">In Progress</span>;
      default:
        return <span className="px-2 py-0.5 rounded border border-red-500/30 bg-red-950/20 text-red-400 font-mono text-[9px] uppercase font-bold tracking-wider animate-pulse">Open Blocker</span>;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* SECTION 1: ACTIVE BLOCKERS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase font-heading">Issues & Blockers</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Log and track structural, materials, or regulatory blockers.</p>
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
                placeholder="Search issues..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-805 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition-all font-mono"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono font-medium rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer text-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Blocker Issue</span>
            </button>
          </div>
        </div>

        {/* Grid listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {activeBlockers.map(iss => (
              <motion.div 
                layout
                key={iss.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`glass-card p-5 rounded-2xl border flex flex-col justify-between min-h-[220px] transition-all relative overflow-hidden group
                  ${iss.status === 'Resolved' ? 'opacity-65 border-emerald-500/20' : 'border-slate-800'}
                `}
              >
                {/* Pulsing red dot top right for open high priority */}
                {!iss.status.includes('Resolved') && iss.priority === 'High' && (
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-2 py-0.5 rounded border font-mono text-[9px] uppercase tracking-wider font-bold ${getPriorityColors(iss.priority)}`}>
                      {iss.priority} Priority
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">{iss.date_raised}</span>
                      <button 
                        onClick={() => handleDeleteIssue(iss.id, false)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-slate-800 text-rose-400"
                        title="Delete Blocker"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-200 uppercase font-heading">{iss.title}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-2 line-clamp-3 leading-relaxed">{iss.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-850 flex flex-col gap-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-500">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <User className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">Assignee: {iss.assigned_to}</span>
                    </div>
                    {getStatusBadge(iss.status)}
                  </div>

                  {iss.status !== 'Resolved' && (
                    <div className="flex gap-2 mt-1">
                      {iss.status === 'Open' ? (
                        <button 
                          onClick={() => updateStatus(iss.id, 'In Progress')}
                          className="flex-1 py-1.5 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Play className="w-3 h-3" /> Start Resolution
                        </button>
                      ) : (
                        <button 
                          onClick={() => updateStatus(iss.id, 'Resolved')}
                          className="flex-1 py-1.5 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark Resolved
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {activeBlockers.length === 0 && (
          <div className="glass-card p-10 rounded-2xl text-center text-slate-550 border border-dashed border-slate-800/40 font-mono text-xs">
            No active issues or blockers found.
          </div>
        )}
      </div>

      {/* SECTION 2: ISSUES & BLOCKERS RECORDS */}
      <div className="premium-card space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-wider text-slate-200 uppercase font-heading">Resolved Blockers Archive</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Permanent historical archive of resolved regulatory and site blockers.</p>
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
                <th className="py-3.5 px-5">Blocker / Details</th>
                <th className="py-3.5 px-5">Priority</th>
                <th className="py-3.5 px-5">Assignee</th>
                <th className="py-3.5 px-5">Raised On</th>
                <th className="py-3.5 px-5">Resolved On</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {currentRecords.map(doc => {
                const resDate = doc.resolved_at ? new Date(doc.resolved_at) : null;
                const formattedResolvedDate = resDate 
                  ? resDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + resDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '--';

                return (
                  <tr key={doc.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-semibold text-slate-200 block">{doc.title}</span>
                      <span className="text-[11px] text-slate-450 mt-1 block truncate max-w-md">{doc.description}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2 py-0.5 border rounded font-mono text-[9px] uppercase tracking-wider font-bold ${getPriorityColors(doc.priority)}`}>
                        {doc.priority}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-300">
                      {doc.assigned_to}
                    </td>
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-400">
                      {doc.date_raised}
                    </td>
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-400">
                      {formattedResolvedDate}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button 
                        onClick={() => handleDeleteIssue(doc.id, true)}
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
                  <td colSpan={6} className="py-8 px-5 text-center text-slate-500 font-mono text-[11px]">
                    No resolved blockers found.
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
                      : 'bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-455'}
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
                Raise New Blocker Issue
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-800 rounded text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveIssue} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Issue Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Concrete mix batch test failed"
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Detailed Description</label>
                <textarea 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Provide logs, reasons, or blocker details..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Priority Level</label>
                  <select 
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-350 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Assigned Lead / Team</label>
                  <input 
                    type="text" 
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g. Electrical supervisor"
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  />
                </div>
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
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-amber-600 hover:from-red-400 hover:to-amber-500 text-white font-mono rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Raise Blocker
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
