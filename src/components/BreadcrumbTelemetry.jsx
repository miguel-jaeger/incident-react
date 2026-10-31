import React from 'react';

export default function BreadcrumbTelemetry({ hostName = 'api-incident.onrender.com', onRefresh, isRefreshing = false, onOpenHostModal }) {
  // Extract clean host display name
  const cleanHost = hostName.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 pb-4 border-b border-slate-100">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-1.5 text-red-700 font-bold bg-red-50 px-2.5 py-1 rounded-md border border-red-100 shadow-2xs">
          <span className="material-symbols-outlined text-sm">terminal</span>
          <span>incident-controller</span>
        </div>
        <span>/</span>
        <span className="text-slate-800 font-medium font-sans">Mesa Operativa Campus 34998</span>
        <span>/</span>
        <button 
          type="button"
          onClick={onOpenHostModal}
          className="bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-600 transition flex items-center gap-1 cursor-pointer"
          title="Cambiar o configurar endpoint API"
        >
          <span>{cleanHost}</span>
          <span className="material-symbols-outlined text-xs text-slate-400">swap_horiz</span>
        </button>
      </div>

      <div className="flex items-center gap-2 self-end xl:self-auto">
        <button 
          type="button"
          onClick={onRefresh}
          className="text-[11px] font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1 transition px-2 py-1 rounded hover:bg-slate-100"
          title="Sincronizar ahora con la API"
        >
          <span className={`material-symbols-outlined text-sm text-slate-400 ${isRefreshing ? 'animate-spin text-red-600' : ''}`}>
            sync
          </span>
          <span>Telemetría en tiempo real</span>
        </button>
      </div>
    </div>
  );
}

