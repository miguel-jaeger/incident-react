import React from 'react';

export default function Toast({ visible, title, message, isSuccess = true, onClose }) {
  return (
    <div 
      className={`fixed top-20 right-6 z-50 transform transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-xl max-w-md cursor-pointer ${
        visible 
          ? 'translate-x-0 opacity-100 pointer-events-auto' 
          : 'translate-x-full opacity-0 pointer-events-none'
      }`}
      id="liveToast"
      onClick={onClose}
    >
      <div 
        className={`p-2 rounded-lg flex items-center justify-center shrink-0 ${
          isSuccess 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-red-100 text-red-700'
        }`} 
        id="toastIconBg"
      >
        <span className="material-symbols-outlined text-xl" id="toastIcon">
          {isSuccess ? 'check_circle' : 'delete_sweep'}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-headline-sm text-xs font-bold text-slate-900" id="toastTitle">
          {title}
        </span>
        <span className="text-xs text-slate-600" id="toastMessage">
          {message}
        </span>
      </div>
    </div>
  );
}

