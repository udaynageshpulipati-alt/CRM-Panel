'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar, Clock, 
  MapPin, X, Info, Tag, Layers, BellRing
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'Task' | 'Meeting' | 'Follow-up' | 'Reminder';
  date: string; // YYYY-MM-DD
  time: string;
  description: string;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Submit phase 1 site reports', type: 'Task', date: '2026-06-20', time: '12:00 PM', description: 'Municipal load specs compilation.' },
  { id: '2', title: 'Phase 1 alignment meeting', type: 'Meeting', date: '2026-06-20', time: '10:00 AM', description: 'Logistics blueprint review.' },
  { id: '3', title: 'Safety inspection site A', type: 'Task', date: '2026-06-18', time: '09:00 AM', description: 'Walkthrough with local inspectors.' },
  { id: '4', title: 'Chairman concrete deadline', type: 'Follow-up', date: '2026-06-25', time: '04:00 PM', instruction: 'Make sure concrete slab is completed.', description: 'Direct instruction follow-up.' } as any,
  { id: '5', title: 'Material testing review meet', type: 'Meeting', date: '2026-06-22', time: '02:30 PM', description: 'Align steel reports.' }
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 19)); // Fix baseline month to June 2026
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // Create event modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<'Task' | 'Meeting' | 'Follow-up' | 'Reminder'>('Reminder');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysArray.push(d);
  }

  const getMonthName = (m: number) => {
    const names = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return names[m];
  };

  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case 'Meeting':
        return 'bg-blue-500/20 border border-blue-500/30 text-blue-400';
      case 'Task':
        return 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400';
      case 'Follow-up':
        return 'bg-purple-500/20 border border-purple-500/30 text-purple-400';
      default:
        return 'bg-amber-500/20 border border-amber-500/30 text-amber-400';
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      type: eventType,
      date: eventDate,
      time: eventTime || '09:00 AM',
      description: eventDesc
    };

    setEvents([...events, newEv]);
    setIsModalOpen(false);
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase font-heading">Calendar Planner</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">Operational events schedule, deadlines, and meetings calendar.</p>
        </div>

        <button 
          onClick={() => {
            setEventDate(new Date(year, month, 19).toISOString().split('T')[0]);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-mono font-medium rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Event Reminder</span>
        </button>
      </div>

      {/* Calendar layout card */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        
        {/* Navigation bar */}
        <div className="flex justify-between items-center p-5 border-b border-slate-850">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-heading">
            {getMonthName(month)} {year}
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-900 border border-slate-850 rounded-xl text-slate-450 hover:text-slate-200 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-900 border border-slate-850 rounded-xl text-slate-450 hover:text-slate-200 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days grid header */}
        <div className="grid grid-cols-7 border-b border-slate-850 bg-slate-900/10 text-center font-mono text-[10px] uppercase font-bold tracking-wider py-3 text-slate-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Days grid cell body */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-850 border-b border-slate-850 bg-slate-950/20">
          {daysArray.map((dayNum, idx) => {
            const dateStr = dayNum ? `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}` : '';
            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = dayNum === 19 && month === 5 && year === 2026;

            return (
              <div 
                key={idx} 
                className={`min-h-[110px] p-2 flex flex-col justify-between font-mono transition-colors hover:bg-slate-900/10
                  ${!dayNum ? 'bg-slate-950/40 pointer-events-none' : ''}
                `}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-semibold ${isToday ? 'bg-emerald-500 text-slate-950 w-5 h-5 rounded-full flex items-center justify-center font-bold' : 'text-slate-400'}`}>
                    {dayNum}
                  </span>
                </div>

                {/* Day events stack list */}
                <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
                  {dayEvents.map(ev => (
                    <div 
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`px-1.5 py-0.5 rounded text-[9px] truncate font-semibold cursor-pointer border ${getEventBadgeClass(ev.type)}`}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Selected event detail modal drawer */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-card rounded-2xl border border-slate-800 shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-850">
                <span className={`px-2 py-0.5 border rounded font-mono text-[9px] uppercase tracking-wider font-bold ${getEventBadgeClass(selectedEvent.type)}`}>
                  {selectedEvent.type}
                </span>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-slate-200 uppercase font-heading">{selectedEvent.title}</h3>
              
              <div className="mt-4 space-y-3 font-mono text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Date: {selectedEvent.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Time: {selectedEvent.time}</span>
                </div>
                {selectedEvent.description && (
                  <p className="mt-4 p-3 bg-slate-900/30 border border-slate-850 rounded-xl text-slate-350 italic">
                    {selectedEvent.description}
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 border border-slate-850 hover:border-slate-800 text-xs font-mono text-slate-350 rounded-xl transition-all"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass-card rounded-2xl border border-slate-800 shadow-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-heading">
                New Calendar Event
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-800 rounded text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Event Title</label>
                <input 
                  type="text" 
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Municipal Board Review Meet"
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Event Type</label>
                  <select 
                    value={eventType}
                    onChange={(e: any) => setEventType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  >
                    <option value="Task">Task</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Reminder">Reminder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Time</label>
                  <input 
                    type="text" 
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Date</label>
                <input 
                  type="date" 
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Detailed Notes</label>
                <textarea 
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Enter details..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
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
                  Save Event
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
