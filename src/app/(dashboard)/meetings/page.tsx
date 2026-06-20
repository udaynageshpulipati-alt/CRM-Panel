'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Calendar, Clock, Users, X, Info, 
  CheckCircle2, AlertCircle, Edit2, Trash2, ArrowRight, Search, ChevronLeft, ChevronRight, Check
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date_time: string;
  participants: string[];
  notes: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  completed_at?: string;
}

const INITIAL_MEETINGS: Meeting[] = [
  { id: '1', title: 'Phase 1 Site Alignment', date_time: '2026-06-20T10:00', participants: ['shero@peramgroup.com', 'vendor@cement.com'], notes: 'Confirming logistics layout and material entry points.', status: 'Confirmed' },
  { id: '2', title: 'Municipal Inspector Review', date_time: '2026-06-22T14:30', participants: ['shero@peramgroup.com', 'inspector@city.gov'], notes: 'Discuss final approval stamps.', status: 'Pending' },
  { id: '3', title: 'Chairman Briefing Call', date_time: '2026-06-20T09:30', participants: ['shero@peramgroup.com', 'chairman@peramgroup.com'], notes: 'Deliver overall status dashboard.', status: 'Completed', completed_at: new Date().toISOString() }, // completed today
  { id: '4', title: 'Weekly Procurement Sync', date_time: '2026-06-19T11:00', participants: ['shero@peramgroup.com', 'finance@peramgroup.com'], notes: 'Raw material procurement billing sync.', status: 'Completed', completed_at: '2026-06-19T12:00:00Z' }, // previous day completed
  { id: '5', title: 'Structural Safety Assessment', date_time: '2026-06-18T15:00', participants: ['shero@peramgroup.com', 'safety@city.gov'], notes: 'Assessment on block 4 safety margins.', status: 'Completed', completed_at: '2026-06-18T16:00:00Z' }  // previous day completed
];

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  // Search & Filter state
  const [activeSearch, setActiveSearch] = useState('');
  const [recordsSearch, setRecordsSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination for records
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Form input states
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [participantsText, setParticipantsText] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Meeting['status']>('Confirmed');

  // Load from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem('crm_meetings');
    if (stored) {
      setMeetings(JSON.parse(stored));
    } else {
      setMeetings(INITIAL_MEETINGS);
      localStorage.setItem('crm_meetings', JSON.stringify(INITIAL_MEETINGS));
    }
  }, []);

  const saveMeetings = (updated: Meeting[]) => {
    setMeetings(updated);
    localStorage.setItem('crm_meetings', JSON.stringify(updated));
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

  // Active Timeline: NOT completed, OR completed TODAY
  const activeMeetings = meetings.filter(meet => {
    const matchesSearch = meet.title.toLowerCase().includes(activeSearch.toLowerCase()) || 
                          meet.notes.toLowerCase().includes(activeSearch.toLowerCase());
    if (!matchesSearch) return false;

    const isCompleted = meet.status === 'Completed';
    const isCompletedToday = isCompleted && isToday(meet.completed_at);
    return !isCompleted || isCompletedToday;
  });

  // Historical Records Table: Completed (including today, for permanent record search)
  const completedMeetings = meetings.filter(meet => {
    if (meet.status !== 'Completed') return false;
    const matchesSearch = meet.title.toLowerCase().includes(recordsSearch.toLowerCase()) || 
                          meet.notes.toLowerCase().includes(recordsSearch.toLowerCase());
    return matchesSearch;
  });

  // Pagination Math
  const totalRecords = completedMeetings.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage) || 1;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = completedMeetings.slice(indexOfFirstRecord, indexOfLastRecord);

  const openCreateModal = () => {
    setEditingMeeting(null);
    setTitle('');
    setDateTime(new Date().toISOString().substring(0, 16));
    setParticipantsText('');
    setNotes('');
    setStatus('Confirmed');
    setIsModalOpen(true);
  };

  const openEditModal = (meet: Meeting) => {
    setEditingMeeting(meet);
    setTitle(meet.title);
    setDateTime(meet.date_time);
    setParticipantsText(meet.participants.join(', '));
    setNotes(meet.notes);
    setStatus(meet.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const partsList = participantsText.split(',').map(p => p.trim()).filter(Boolean);

    let updated: Meeting[] = [];
    if (editingMeeting) {
      updated = meetings.map(m => {
        if (m.id === editingMeeting.id) {
          const statusChangedToCompleted = status === 'Completed' && m.status !== 'Completed';
          return {
            ...m,
            title,
            date_time: dateTime,
            participants: partsList,
            notes,
            status,
            completed_at: statusChangedToCompleted ? new Date().toISOString() : m.completed_at
          };
        }
        return m;
      });
    } else {
      const newMeet: Meeting = {
        id: Date.now().toString(),
        title,
        date_time: dateTime,
        participants: partsList,
        notes,
        status,
        completed_at: status === 'Completed' ? new Date().toISOString() : undefined
      };
      updated = [newMeet, ...meetings];
    }

    saveMeetings(updated);
    setIsModalOpen(false);
  };

  const handleQuickComplete = (id: string) => {
    const updated = meetings.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: 'Completed' as const,
          completed_at: new Date().toISOString()
        };
      }
      return m;
    });
    saveMeetings(updated);
  };

  const handleDelete = (id: string, isRecord = false) => {
    const msg = isRecord 
      ? 'Are you sure you want to permanently delete this completed meeting record?'
      : 'Are you sure you want to delete this scheduled meeting?';
    if (confirm(msg)) {
      saveMeetings(meetings.filter(m => m.id !== id));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-450" />;
      case 'Confirmed':
        return <Calendar className="w-5 h-5 text-blue-400" />;
      case 'Cancelled':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-amber-400" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20';
      case 'Confirmed':
        return 'border-blue-500/30 text-blue-400 bg-blue-950/20';
      case 'Cancelled':
        return 'border-red-500/30 text-red-400 bg-red-950/20';
      default:
        return 'border-amber-500/30 text-amber-400 bg-amber-950/20';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* SECTION 1: TIMELINE */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase font-heading">Scheduled Meetings</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Timeline and participants of active operation meets.</p>
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
                placeholder="Search meetings..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-805 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition-all font-mono"
              />
            </div>
            <button 
              onClick={openCreateModal}
              className="btn-primary-custom text-xs font-semibold shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Sync</span>
            </button>
          </div>
        </div>

        {/* Timeline list */}
        <div className="space-y-4 max-w-4xl">
          <AnimatePresence mode="popLayout">
            {activeMeetings.map((meet, idx) => {
              const dateObj = new Date(meet.date_time);
              return (
                <motion.div 
                  layout
                  key={meet.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="glass-card p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden group"
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    meet.status === 'Completed' ? 'bg-emerald-450' :
                    meet.status === 'Confirmed' ? 'bg-blue-450' :
                    meet.status === 'Cancelled' ? 'bg-rose-450' : 'bg-amber-450'
                  }`} />

                  <div className="flex items-start gap-4 pl-2 flex-1 min-w-0">
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
                      {getStatusIcon(meet.status)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-200 uppercase font-heading truncate">{meet.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 font-mono text-[10px] text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {dateObj.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {meet.notes && (
                        <p className="mt-2 text-xs text-slate-450 font-mono italic max-w-lg truncate">{meet.notes}</p>
                      )}
                      {meet.participants.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-3">
                          {meet.participants.map((email, pidx) => (
                            <span key={pidx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-slate-400">{email}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto pl-8 md:pl-0">
                    <span className={`px-2.5 py-0.5 border rounded font-mono text-[9px] uppercase tracking-wider font-bold ${getStatusBadgeClass(meet.status)}`}>
                      {meet.status}
                    </span>

                    {/* Quick check complete button if not complete */}
                    {meet.status !== 'Completed' && (
                      <button 
                        onClick={() => handleQuickComplete(meet.id)}
                        title="Mark Completed"
                        className="p-1.5 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg text-emerald-450 transition-all cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}

                    <button 
                      onClick={() => openEditModal(meet)}
                      className="p-1.5 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg text-blue-450 transition-all cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(meet.id, false)}
                      className="p-1.5 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg text-rose-450 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {activeMeetings.length === 0 && (
            <div className="glass-card p-10 rounded-2xl text-center text-slate-550 border border-dashed border-slate-800/40 font-mono text-xs">
              No meetings scheduled.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: RECORDS */}
      <div className="premium-card space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-wider text-slate-200 uppercase font-heading">Meetings Records</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Permanent historical archive of all completed operational sessions.</p>
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

        {/* Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800/80 text-slate-400 font-mono uppercase tracking-wider">
                <th className="py-3.5 px-5">Session / Details</th>
                <th className="py-3.5 px-5">Meeting Date</th>
                <th className="py-3.5 px-5">Participants</th>
                <th className="py-3.5 px-5">Completed On</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {currentRecords.map(doc => {
                const meetDate = new Date(doc.date_time);
                const compDate = doc.completed_at ? new Date(doc.completed_at) : null;
                const formattedCompletedDate = compDate 
                  ? compDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + compDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '--';

                return (
                  <tr key={doc.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-semibold text-slate-200 block">{doc.title}</span>
                      <span className="text-[11px] text-slate-450 mt-1 block truncate max-w-md">{doc.notes}</span>
                    </td>
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-350">
                      {meetDate.toLocaleDateString()} {meetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {doc.participants.map((p, pi) => (
                          <span key={pi} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800/60 rounded text-[9px] font-mono text-slate-400">{p}</span>
                        ))}
                        {doc.participants.length === 0 && <span className="text-slate-500 font-mono">--</span>}
                      </div>
                    </td>
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-400">
                      {formattedCompletedDate}
                    </td>
                    <td className="py-4 px-5 text-right space-x-1">
                      <button 
                        onClick={() => openEditModal(doc)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-emerald-405 transition-colors cursor-pointer inline-flex"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id, true)}
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
                    No historical completed sessions found.
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
                {editingMeeting ? 'Update Meeting Spec' : 'Schedule New Meet'}
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
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Meeting Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Concrete Site Alignment"
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-350 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Participants (comma separated)</label>
                <input 
                  type="text" 
                  value={participantsText}
                  onChange={(e) => setParticipantsText(e.target.value)}
                  placeholder="e.g. shero@peramgroup.com, vendor@test.com"
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Description & Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter details..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Status</label>
                <select 
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
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
                  Save Meeting
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
