import React from 'react';

export default function EmptyState({ onResetFilters }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center px-4" id="emptyState">
      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
        <span className="material-symbols-outlined text-3xl">inbox</span>
      </div>
      <h3 className="font-headline-sm text-base font-bold text-slate-800 mb-1">Sin registros operacionales</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-4">
        No se hallaron incidentes que coincidan con la búsqueda o con los filtros activos.
      </p>
      <button 
        type="button"
        onClick={onResetFilters}
        className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer" 
        id="btnResetFilters"
      >
        Restablecer Filtros
      </button>
    </div>
  );
}

