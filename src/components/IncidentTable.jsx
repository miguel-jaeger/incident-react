import React from 'react';

export default function IncidentTable({ incidents = [], onViewDetail, onOpenPatch, onDelete }) {
  return (
    <div className="overflow-x-auto" id="tableContainer">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-100/80 text-[11px] font-mono uppercase tracking-wider text-slate-600 border-b border-slate-200">
          <tr>
            <th className="py-3 px-4 font-semibold">Ticket ID</th>
            <th className="py-3 px-4 font-semibold">Incidente / Descripción</th>
            <th className="py-3 px-4 font-semibold">Campus & Aula</th>
            <th className="py-3 px-4 font-semibold text-center">Estado</th>
            <th className="py-3 px-4 font-semibold text-center">Prioridad</th>
            <th className="py-3 px-4 font-semibold">Registro / Timestamp</th>
            <th className="py-3 px-4 font-semibold text-right">Comandos Operativos</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-700" id="tableBody">
          {incidents.map((item, idx) => {
            const isActive = item.status === 'Active';
            const rowBg = idx % 2 === 0 ? 'bg-white hover:bg-slate-50/90' : 'bg-slate-50/40 hover:bg-slate-50';
            const datePart = (item.createdAt || '').split('T')[0] || '';
            const timePart = (item.createdAt || '').split('T')[1] || '';

            return (
              <tr key={item.id} className={`${rowBg} transition-colors`}>
                {/* TICKET ID */}
                <td className="py-3 px-4 font-mono text-xs font-bold text-red-700 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">label</span>
                    <span>{item.ticketCode}</span>
                  </div>
                </td>

                {/* INCIDENTE / DESCRIPCIÓN */}
                <td className="py-3 px-4 max-w-sm">
                  <div 
                    onClick={() => onViewDetail(item)}
                    className="font-headline-sm font-semibold text-slate-900 hover:text-red-700 transition cursor-pointer text-xs sm:text-sm line-clamp-1"
                  >
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {item.description}
                  </div>
                  {item.rejectionReason ? (
                    <div className="mt-1 text-[11px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/60 inline-flex items-center gap-1 max-w-md truncate">
                      <span className="font-semibold shrink-0">Rechazo/Obs:</span>
                      <span className="truncate">{item.rejectionReason}</span>
                    </div>
                  ) : null}
                </td>

                {/* CAMPUS & AULA */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                    <span className="material-symbols-outlined text-sm text-slate-400">location_on</span>
                    <span>{item.location || 'Sede Campus UTP'}</span>
                  </div>
                </td>

                {/* ESTADO */}
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      <span>Inactive</span>
                    </span>
                  )}
                </td>

                {/* PRIORIDAD */}
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  {item.priority === 'High' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wide bg-gradient-to-r from-[#C8102E] to-[#e70648] text-white shadow-xs">
                      HIGH
                    </span>
                  ) : item.priority === 'Medium' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wide bg-amber-500 text-white">
                      MEDIUM
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wide bg-sky-600 text-white">
                      LOW
                    </span>
                  )}
                </td>

                {/* REGISTRO / TIMESTAMP */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="text-[11px] font-mono text-slate-600 flex flex-col">
                    <span className="font-semibold text-slate-800">{datePart}</span>
                    <span className="text-slate-400 text-[10px]">{timePart}</span>
                  </div>
                </td>

                {/* COMANDOS OPERATIVOS */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => onViewDetail(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-sky-700 text-xs font-medium transition cursor-pointer" 
                      title="GET /api/incidents/{id}"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span className="hidden sm:inline">Detalle</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => onOpenPatch(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 text-xs font-medium transition cursor-pointer" 
                      title="PATCH /api/incidents/{id}/status"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span className="hidden sm:inline">Estado</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => onDelete(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-medium transition cursor-pointer" 
                      title="DELETE /api/incidents/{id}"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

