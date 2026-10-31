import React from 'react';

export default function TableFooter({ count = 0, total = 0 }) {
  return (
    <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
      <span className="font-mono" id="resultsCount">
        Mostrando {count} de {total} incidentes registrados
      </span>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span className="font-mono text-[11px]">
          Consola NOC UTP • Sincronización continua activada
        </span>
      </div>
    </div>
  );
}

