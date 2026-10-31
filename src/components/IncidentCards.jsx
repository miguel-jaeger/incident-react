import React from 'react';

export default function IncidentCards({ incidents = [], onViewDetail, onOpenPatch, onDelete }) {
  return (
    <div className="p-4 lg:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="cardsContainer">
      {incidents.map((item) => {
        const isActive = item.status === 'Active';

        return (
          <div 
            key={item.id} 
            className="relative flex flex-col justify-between rounded-xl bg-white p-4 border border-slate-200 shadow-xs hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="font-mono text-xs font-bold text-red-700">{item.ticketCode}</span>
                  <h3 
                    onClick={() => onViewDetail(item)}
                    className="font-headline-sm text-sm text-slate-900 font-bold hover:text-red-700 transition cursor-pointer mt-0.5"
                  >
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Status badge */}
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      <span>Inactive</span>
                    </span>
                  )}

                  {/* Priority badge */}
                  {item.priority === 'High' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-gradient-to-r from-[#C8102E] to-[#e70648] text-white shadow-xs">
                      HIGH
                    </span>
                  ) : item.priority === 'Medium' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-amber-500 text-white">
                      MEDIUM
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-sky-600 text-white">
                      LOW
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Descripción:</span> {item.description}
              </div>

              {item.rejectionReason && (
                <div className="mt-2.5 p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-1.5">
                  <span className="font-semibold shrink-0">Razones del rechazo:</span>
                  <span className="break-words">{item.rejectionReason}</span>
                </div>
              )}

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  <span>{item.createdAt}</span>
                </span>
                <span className="text-slate-600 truncate max-w-[130px]" title={item.location}>
                  {item.location || 'Campus UTP'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
              <button 
                type="button"
                onClick={() => onViewDetail(item)}
                className="flex-1 py-1.5 px-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span>Detalle</span>
              </button>
              <button 
                type="button"
                onClick={() => onOpenPatch(item)}
                className="flex-1 py-1.5 px-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-700 text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                <span>Estado</span>
              </button>
              <button 
                type="button"
                onClick={() => onDelete(item)}
                className="flex-1 py-1.5 px-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-700 text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

