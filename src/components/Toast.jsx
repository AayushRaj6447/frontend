import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-bounce-short">
      <div
        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl transition-all ${
          isSuccess
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50'
            : isError
            ? 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-950/50'
            : 'bg-slate-900/95 border-slate-700 text-slate-200 shadow-slate-950/50'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
          
          <span className="text-xs sm:text-sm font-semibold truncate">{toast.message}</span>
        </div>
        
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
