import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl transition-all ${
          isSuccess
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50'
            : isError
            ? 'bg-rose-950/80 border-rose-500/40 text-rose-200 shadow-rose-950/50'
            : 'bg-slate-900/90 border-slate-700 text-slate-200'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
        
        <span className="text-sm font-medium pr-2">{toast.message}</span>
        
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
