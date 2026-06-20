'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Coffee, MapPin, Calendar, Clock, 
  UserCheck, Hourglass, ShieldCheck, CheckCircle2 
} from 'lucide-react';

interface AttendanceLog {
  id: string;
  date: string;
  check_in: string;
  check_out: string | null;
  work_hours: string;
  status: 'Present' | 'Absent' | 'Half-Day';
}

const INITIAL_LOGS: AttendanceLog[] = [
  { id: '1', date: '2026-06-18', check_in: '09:02 AM', check_out: '06:05 PM', work_hours: '9h 3m', status: 'Present' },
  { id: '2', date: '2026-06-17', check_in: '09:15 AM', check_out: '06:12 PM', work_hours: '8h 57m', status: 'Present' },
  { id: '3', date: '2026-06-16', check_in: '08:55 AM', check_out: '05:58 PM', work_hours: '9h 3m', status: 'Present' },
  { id: '4', date: '2026-06-15', check_in: '09:05 AM', check_out: '01:10 PM', work_hours: '4h 5m', status: 'Half-Day' }
];

export default function AttendancePage() {
  const [logs, setLogs] = useState<AttendanceLog[]>(INITIAL_LOGS);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    let interval: any;
    if (isCheckedIn && checkInTime) {
      interval = setInterval(() => {
        const diff = Date.now() - new Date(checkInTime).getTime();
        const hrs = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const mins = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const secs = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setElapsedTime(`${hrs}:${mins}:${secs}`);
      }, 1000);
    } else {
      setElapsedTime('00:00:00');
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime]);

  const handleCheckInToggle = () => {
    const now = new Date();
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setCheckInTime(now.toISOString());
    } else {
      // Calculate work hours
      const diff = now.getTime() - new Date(checkInTime!).getTime();
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      
      const newLog: AttendanceLog = {
        id: Date.now().toString(),
        date: now.toISOString().split('T')[0],
        check_in: new Date(checkInTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        check_out: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        work_hours: `${hrs}h ${mins}m`,
        status: hrs >= 8 ? 'Present' : (hrs >= 4 ? 'Half-Day' : 'Absent')
      };

      setLogs([newLog, ...logs]);
      setIsCheckedIn(false);
      setCheckInTime(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header title */}
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase font-heading">Attendance terminal</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">Clock in/out to track and log operational shift hours.</p>
      </div>

      {/* Grid: Terminal & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Terminal panel */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Terminal Shell</span>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                ONLINE
              </span>
            </div>
            
            <div className="my-6 text-center">
              <div className="text-5xl font-bold font-heading tracking-widest text-slate-200 mb-2">
                {isCheckedIn ? elapsedTime : '00:00:00'}
              </div>
              <p className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5 mt-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>OFFICE LOCALIZATION ROUTE</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleCheckInToggle}
            className={`w-full py-3.5 font-mono font-medium rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer
              ${isCheckedIn 
                ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20' 
                : 'bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white shadow-blue-500/20'
              }
            `}
          >
            {isCheckedIn ? (
              <>
                <Coffee className="w-4 h-4 animate-bounce" />
                <span>Clock Out / Take Break</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Clock In Shift</span>
              </>
            )}
          </button>
        </div>

        {/* Stats card 1 */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading mb-4">Total Days Recorded</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-100 font-heading">{logs.length}</span>
              <span className="text-xs text-slate-500 font-mono">days tracked</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-800/80 pt-4 font-mono text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Present Count:</span>
              <span className="text-emerald-400 font-semibold">{logs.filter(l => l.status === 'Present').length}</span>
            </div>
            <div className="flex justify-between">
              <span>Half-Day Count:</span>
              <span className="text-purple-400 font-semibold">{logs.filter(l => l.status === 'Half-Day').length}</span>
            </div>
          </div>
        </div>

        {/* Stats card 2 */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading mb-4">Average Check-in Time</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-100 font-heading">09:04</span>
              <span className="text-xs text-slate-500 font-mono">AM</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-800/80 pt-4 font-mono text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Avg Work Hours:</span>
              <span className="text-blue-400 font-semibold">8h 45m</span>
            </div>
            <div className="flex justify-between">
              <span>Required Hours:</span>
              <span className="text-slate-350">8h 00m</span>
            </div>
          </div>
        </div>

      </div>

      {/* History table log */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-heading">Logs & History</h3>
          <span className="text-xs font-mono text-slate-400">Month of June 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/20 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-4 px-5">Shift Date</th>
                <th className="py-4 px-5">Check-In</th>
                <th className="py-4 px-5">Check-Out</th>
                <th className="py-4 px-5">Work Hours</th>
                <th className="py-4 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="py-4 px-5 font-semibold text-slate-200">{log.date}</td>
                  <td className="py-4 px-5 text-slate-450">{log.check_in}</td>
                  <td className="py-4 px-5 text-slate-450">{log.check_out || 'Active'}</td>
                  <td className="py-4 px-5 text-blue-400">{log.work_hours}</td>
                  <td className="py-4 px-5">
                    {log.status === 'Present' ? (
                      <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-[10px] uppercase font-bold tracking-wider">Present</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded border border-purple-500/30 bg-purple-950/20 text-purple-400 text-[10px] uppercase font-bold tracking-wider">Half-Day</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
