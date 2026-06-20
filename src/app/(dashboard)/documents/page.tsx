'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, File, UploadCloud, Trash2, Download, 
  Search, Grid, List, ChevronRight, HardDrive, 
  CheckCircle, ShieldAlert, Plus, FolderPlus
} from 'lucide-react';

interface DocFile {
  id: string;
  name: string;
  category: 'Reports' | 'Approvals' | 'Meeting Notes' | 'Site Documents';
  size: string;
  uploaded_at: string;
}

const INITIAL_DOCS: DocFile[] = [
  { id: '1', name: 'phase1_safety_report.pdf', category: 'Reports', size: '2.4 MB', uploaded_at: '2026-06-15' },
  { id: '2', name: 'municipal_permits_signed.pdf', category: 'Approvals', size: '4.8 MB', uploaded_at: '2026-06-18' },
  { id: '3', name: 'alignment_notes_week2.docx', category: 'Meeting Notes', size: '342 KB', uploaded_at: '2026-06-12' },
  { id: '4', name: 'concrete_strength_specs.pdf', category: 'Site Documents', size: '1.2 MB', uploaded_at: '2026-06-14' }
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocFile[]>(INITIAL_DOCS);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Reports' | 'Approvals' | 'Meeting Notes' | 'Site Documents'>('All');
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDoc: DocFile = {
        id: Date.now().toString(),
        name: file.name,
        category: (activeCategory !== 'All' ? activeCategory : 'Reports') as any,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploaded_at: new Date().toISOString().split('T')[0]
      };
      setDocs([newDoc, ...docs]);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this document?')) {
      setDocs(docs.filter(d => d.id !== id));
    }
  };

  const filteredDocs = docs.filter(doc => {
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header title */}
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase font-heading">Operations Vault</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">Upload and store municipal approvals, reports, and site documentation.</p>
      </div>

      {/* Main Grid: Categories Sidebar & Folder grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Categories / Storage usage Column */}
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 font-mono text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-heading mb-4 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" /> Storage Status
            </h3>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
              <div className="w-[35%] h-full bg-emerald-500" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-2">
              <span>8.7 MB used</span>
              <span>100 MB quota</span>
            </div>
          </div>

          <div className="glass-card p-3 rounded-2xl border border-slate-850 space-y-1 font-mono text-xs">
            {[
              { name: 'All Files', key: 'All' },
              { name: 'Reports', key: 'Reports' },
              { name: 'Approvals', key: 'Approvals' },
              { name: 'Meeting Notes', key: 'Meeting Notes' },
              { name: 'Site Documents', key: 'Site Documents' },
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer
                  ${activeCategory === cat.key 
                    ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/10' 
                    : 'text-slate-450 hover:text-slate-200 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Folder className={`w-4.5 h-4.5 ${activeCategory === cat.key ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{cat.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Upload area & Document grid */}
        <div className="md:col-span-3 space-y-6">
          {/* Search bar & Upload trigger wrapper */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all font-mono"
              />
            </div>

            {/* Custom file upload input label */}
            <label className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-mono font-medium rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs">
              <UploadCloud className="w-4.5 h-4.5" />
              <span>{isUploading ? 'Uploading file...' : 'Upload document'}</span>
              <input 
                type="file" 
                onChange={handleUploadSimulate} 
                className="hidden" 
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Feedback messages */}
          {uploadSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4.5 h-4.5" /> Document uploaded successfully to the folder vault.
            </div>
          )}

          {/* Document list */}
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/20 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                    <th className="py-4 px-5">Document Name</th>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5">File Size</th>
                    <th className="py-4 px-5">Upload Date</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
                  {filteredDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-4 px-5 font-semibold text-slate-200 flex items-center gap-2.5">
                        <File className="w-4.5 h-4.5 text-blue-400 shrink-0" />
                        <span className="truncate max-w-xs">{doc.name}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] uppercase tracking-wider">{doc.category}</span>
                      </td>
                      <td className="py-4 px-5 text-slate-400">{doc.size}</td>
                      <td className="py-4 px-5 text-slate-400">{doc.uploaded_at}</td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <button 
                          onClick={() => {
                            const element = document.createElement("a");
                            const file = new Blob([`Simulated document content for: ${doc.name}\nSize: ${doc.size}\nUploaded: ${doc.uploaded_at}`], {type: 'text/plain'});
                            element.href = URL.createObjectURL(file);
                            element.download = doc.name;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-blue-400 transition-colors cursor-pointer inline-flex border border-slate-850"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-red-400 transition-colors cursor-pointer inline-flex border border-slate-850"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredDocs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No documents stored in this directory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
