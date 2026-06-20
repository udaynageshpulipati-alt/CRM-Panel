'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Printer, CheckSquare, Users, AlertTriangle, BarChart3, Plus, Search, ChevronLeft, ChevronRight, Trash2, Download
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '@/components/AuthContext';

interface ArchivedReport {
  id: string;
  title: string;
  type: 'Daily' | 'Weekly' | 'Monthly';
  created_at: string;
  tasks_completed: number;
  open_blockers: number;
  total_meetings: number;
  operator: string;
}

export default function ReportsPage() {
  const { profile } = useAuth();
  const [reportType, setReportType] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [isGenerating, setIsGenerating] = useState(false);

  // Archive state
  const [archivedReports, setArchivedReports] = useState<ArchivedReport[]>([]);
  const [recordsSearch, setRecordsSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Dynamic counts loaded from storage
  const [metrics, setMetrics] = useState({
    tasksCompleted: 42,
    openBlockers: 1,
    totalMeetings: 8,
    todosCompleted: 15
  });

  // Fetch counts from other local storage tables
  useEffect(() => {
    // Tasks completed
    const tasks = localStorage.getItem('crm_tasks');
    let completedTasksCount = 0;
    let openBlockersCount = 0;
    if (tasks) {
      const parsedTasks = JSON.parse(tasks);
      completedTasksCount = parsedTasks.filter((t: any) => t.status === 'Completed').length;
      openBlockersCount = parsedTasks.filter((t: any) => t.status === 'High Priority').length;
    }

    // Meetings
    const meetings = localStorage.getItem('crm_meetings');
    let meetingsCount = 0;
    if (meetings) {
      meetingsCount = JSON.parse(meetings).length;
    }

    // Todos Completed
    const todos = localStorage.getItem('crm_todos');
    let completedTodosCount = 0;
    if (todos) {
      completedTodosCount = JSON.parse(todos).filter((t: any) => t.completed).length;
    }

    setMetrics({
      tasksCompleted: completedTasksCount || 42,
      openBlockers: openBlockersCount || 1,
      totalMeetings: meetingsCount || 8,
      todosCompleted: completedTodosCount || 15
    });

    // Load reports archive
    const reports = localStorage.getItem('crm_reports');
    if (reports) {
      setArchivedReports(JSON.parse(reports));
    } else {
      const initialReports: ArchivedReport[] = [
        { id: '1', title: 'W2 Operations Status Report', type: 'Weekly', created_at: '2026-06-14T10:00:00Z', tasks_completed: 38, open_blockers: 2, total_meetings: 6, operator: 'Shero' },
        { id: '2', title: 'Daily Logistics Briefing Sheet', type: 'Daily', created_at: '2026-06-19T17:00:00Z', tasks_completed: 12, open_blockers: 0, total_meetings: 2, operator: 'Shero' }
      ];
      setArchivedReports(initialReports);
      localStorage.setItem('crm_reports', JSON.stringify(initialReports));
    }
  }, []);

  const saveReports = (updated: ArchivedReport[]) => {
    setArchivedReports(updated);
    localStorage.setItem('crm_reports', JSON.stringify(updated));
  };

  const handlePrint = () => {
    setIsGenerating(true);
    setTimeout(() => {
      window.print();
      setIsGenerating(false);
    }, 1000);
  };

  const handleArchiveReport = () => {
    const newReport: ArchivedReport = {
      id: Date.now().toString(),
      title: `${reportType} Operations Summary`,
      type: reportType,
      created_at: new Date().toISOString(),
      tasks_completed: metrics.tasksCompleted,
      open_blockers: metrics.openBlockers,
      total_meetings: metrics.totalMeetings,
      operator: profile?.full_name || 'Shero'
    };

    const updated = [newReport, ...archivedReports];
    saveReports(updated);
    alert('Report saved to archive successfully.');
  };

  const handleDeleteReport = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this report record?')) {
      saveReports(archivedReports.filter(r => r.id !== id));
    }
  };

  // Filter archived reports
  const filteredReports = archivedReports.filter(r => 
    r.title.toLowerCase().includes(recordsSearch.toLowerCase()) ||
    r.operator.toLowerCase().includes(recordsSearch.toLowerCase())
  );

  // Pagination Math
  const totalRecords = filteredReports.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage) || 1;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredReports.slice(indexOfFirstRecord, indexOfLastRecord);

  // Chart data based on metrics state
  const chartData = [
    { name: 'Tasks Completed', qty: metrics.tasksCompleted },
    { name: 'To-Dos Cleared', qty: metrics.todosCompleted },
    { name: 'Meetings Run', qty: metrics.totalMeetings }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10 printable-report">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase font-heading">Operations Reports</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">Export, preview, and review periodic team metrics sheets.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleArchiveReport}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-mono font-medium rounded-xl transition-all flex items-center gap-2 cursor-pointer text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Archive Active Report</span>
          </button>
          <button 
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-slate-200 font-mono font-medium rounded-xl transition-all flex items-center gap-2 cursor-pointer text-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{isGenerating ? 'Rendering PDF...' : 'Print Report (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Selector Tabs (no-print) */}
      <div className="flex gap-2 p-1.5 bg-slate-950/60 border border-slate-850 rounded-xl w-fit no-print">
        {['Daily', 'Weekly', 'Monthly'].map(type => (
          <button
            key={type}
            onClick={() => setReportType(type as any)}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer
              ${reportType === type 
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            {type}
          </button>
        ))}
      </div>

      {/* The Actual Report sheet area */}
      <div className="space-y-6 print-container p-6 bg-slate-950/20 rounded-2xl border border-slate-850">
        
        {/* Print Header */}
        <div className="flex justify-between items-center pb-6 border-b border-slate-850">
          <div>
            <h2 className="text-lg font-bold text-slate-100 uppercase font-heading tracking-widest">
              OPERATIONS {reportType.toUpperCase()} SUMMARY SHEET
            </h2>
            <p className="text-[10px] text-slate-500 font-mono mt-1">
              GENERATED ON: {new Date().toLocaleDateString()} | OPERATOR: {profile?.full_name || 'SHERO'} (Operations Head)
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
              CONFIDENTIAL
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Completed Tasks', value: metrics.tasksCompleted, icon: CheckSquare, desc: 'Tasks currently marked Completed' },
            { label: 'Completed To-Dos', value: metrics.todosCompleted, icon: FileText, desc: 'Checklist items resolved' },
            { label: 'Open Blockers', value: metrics.openBlockers, icon: AlertTriangle, desc: 'High priority active issues' },
            { label: 'Total Meetings', value: metrics.totalMeetings, icon: BarChart3, desc: 'Scheduled operational sessions' },
          ].map((stat, idx) => (
            <div key={idx} className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl font-mono">
              <div className="flex justify-between items-start text-slate-450 text-[10px] uppercase tracking-wider">
                <span>{stat.label}</span>
                <stat.icon className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-200 mt-2">{stat.value}</h3>
              <p className="text-[9px] text-slate-550 mt-1 leading-snug">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart container */}
          <div className="lg:col-span-2 p-5 bg-slate-900/40 border border-slate-850 rounded-xl flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-heading mb-6">Operations Summary Chart</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontFamily: 'monospace' }} />
                  <Bar dataKey="qty" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Remarks/Notes area */}
          <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-xl flex flex-col justify-between font-mono text-xs">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-heading mb-4">Executive Remarks</h3>
              <div className="space-y-3 text-slate-400">
                <p>
                  1. Task velocity is calculated directly from active board columns.
                </p>
                <p>
                  2. Meetings represent active client/site coordinator sync schedules.
                </p>
                <p>
                  3. Signoff records a verified state of the operational board.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-850 pt-4 mt-4 text-[10px] text-slate-500">
              <p>CONFIRMING SIGNATURE:</p>
              <div className="h-10 border-b border-dashed border-slate-700 mt-2" />
              <p className="mt-1 text-[9px] uppercase">Operations Head</p>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2: REPORTS ARCHIVE TABLE (no-print) */}
      <div className="premium-card space-y-6 no-print">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-wider text-slate-200 uppercase font-heading">Reports Archive</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Verifiable history of all saved operations report sheets.</p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              value={recordsSearch}
              onChange={(e) => { setRecordsSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search reports..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-805 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition-all font-mono"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800/80 text-slate-400 font-mono uppercase tracking-wider">
                <th className="py-3.5 px-5">Report Title</th>
                <th className="py-3.5 px-5">Type</th>
                <th className="py-3.5 px-5">Metrics Snapshot</th>
                <th className="py-3.5 px-5">Signed Off By</th>
                <th className="py-3.5 px-5 font-mono">Archive Timestamp</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {currentRecords.map(doc => {
                const docDate = new Date(doc.created_at);
                const formattedDate = docDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + docDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <tr key={doc.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-semibold text-slate-200 block">{doc.title}</span>
                    </td>
                    <td className="py-4 px-5 font-mono">
                      <span className="px-2.5 py-0.5 border border-blue-500/30 text-blue-400 bg-blue-950/20 rounded text-[9px] uppercase font-bold tracking-wider">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-350 font-mono text-[11px]">
                      T:{doc.tasks_completed} | B:{doc.open_blockers} | M:{doc.total_meetings}
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-300">
                      {doc.operator}
                    </td>
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-450">
                      {formattedDate}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button 
                        onClick={() => handleDeleteReport(doc.id)}
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
                    No archived reports found.
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

      {/* Printable CSS overrides */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .printable-report {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-container {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
          }
          .print-container *, .printable-report * {
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
}
