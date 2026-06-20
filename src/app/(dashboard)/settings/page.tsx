'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { motion } from 'framer-motion';
import { 
  Settings, User, Shield, CheckCircle, 
  AlertTriangle, UploadCloud, Save, Key 
} from 'lucide-react';

export default function SettingsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  // Profile settings state
  const [fullName, setFullName] = useState(profile?.full_name || 'Shero');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80');
  const [role, setRole] = useState(profile?.role || 'Operations Head');
  
  // Security settings state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (profile) {
      profile.full_name = fullName;
      profile.avatar_url = avatarUrl;
      profile.role = role;
    }
    
    setFeedback({ type: 'success', text: 'Profile configurations updated successfully.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setFeedback({ type: 'success', text: 'Security password configured successfully.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header title */}
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase font-heading">Control Panel Settings</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">Configure profile details, secure passwords, and dashboard setups.</p>
      </div>

      {/* Tabs selectors */}
      <div className="flex gap-2 p-1.5 bg-slate-950/60 border border-slate-850 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-2
            ${activeTab === 'profile' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold' 
              : 'text-slate-450 hover:text-slate-200'}
          `}
        >
          <User className="w-4 h-4" />
          <span>Profile Specs</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-2
            ${activeTab === 'security' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold' 
              : 'text-slate-450 hover:text-slate-200'}
          `}
        >
          <Shield className="w-4 h-4" />
          <span>Security Key</span>
        </button>
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div className={`p-4 rounded-xl border font-mono text-xs flex items-center gap-3
          ${feedback.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-950/40 border-red-500/20 text-red-400'}
        `}>
          {feedback.type === 'success' ? <CheckCircle className="w-4.5 h-4.5" /> : <AlertTriangle className="w-4.5 h-4.5" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tab Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card Summary Panel */}
        <div className="glass-card p-6 rounded-2xl border border-slate-850 flex flex-col items-center justify-between text-center min-h-[250px]">
          <div className="flex flex-col items-center">
            <img 
              src={avatarUrl} 
              alt={fullName} 
              className="w-20 h-20 rounded-2xl border border-slate-700 object-cover shadow-2xl shadow-blue-500/10" 
            />
            <h3 className="text-sm font-bold text-slate-200 uppercase font-heading mt-4">{fullName}</h3>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">{role}</span>
          </div>

          <div className="w-full text-slate-500 font-mono text-[10px] border-t border-slate-850 pt-4 mt-4">
            DEPARTMENT: OPERATIONS
          </div>
        </div>

        {/* Configurations input Form column */}
        <div className="md:col-span-2 glass-card p-6 rounded-2xl border border-slate-800">
          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-heading mb-4">Edit Profile details</h3>
              
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Avatar URL Path</label>
                <input 
                  type="text" 
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Role Title</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-850">
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-mono rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configs</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSecuritySave} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-heading mb-4">Secure Password Access</h3>
              
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-850">
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-mono rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <Key className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
