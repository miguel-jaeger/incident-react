import React from 'react';

export default function DetailModal({ isOpen, onClose, incident }) {
  if (!isOpen || !incident) return null;

  const isActive = incident.status === 'Active';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" id="detailModal">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
              <span className="material-symbols-outlined text-xl">info</span>
            </div>
            <div>
              <h2 className="font-headline-md text-base font-bold text-slate-900" id="detailTicketId">
                {incident.ticketCode} (ID: {incident.id})
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Detalle inspeccionado vía GET /api/incidents/{incident.id}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer" 
            id="btnCloseDetail"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3.5 text-xs font-sans">
          <div>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Título del Ticket</span>
            <h3 className="font-headline-sm text-sm font-bold text-slate-900 mt-0.5" id="detailTitle">
              {incident.title}
            </h3>
          </div>

          <div>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Descripción Técnica</span>
            <p className="text-xs text-slate-700 mt-1 p-3 rounded-lg bg-slate-50 border border-slate-200" id="detailDescription">
              {incident.description || "Sin descripción proporcionada."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Estado Actual</span>
              <div className="mt-1" id="detailStatusBadge">
                {isActive ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-100 text-emerald-800">
                    ● Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700">
                    ○ Inactive
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Prioridad</span>
              <div className="mt-1" id="detailPriorityBadge">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold ${
                  incident.priority === 'High' ? 'bg-[#C8102E] text-white' : 
                  incident.priority === 'Medium' ? 'bg-amber-500 text-white' : 
                  'bg-sky-600 text-white'
                }`}>
                  {incident.priority}
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Razones del rechazo / Notas</span>
            <p className="text-xs text-slate-700 mt-1 p-3 rounded-lg bg-slate-50 border border-slate-200" id="detailRejection">
              {incident.rejectionReason || "Sin observaciones ni razones de rechazo registradas."}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1 text-[11px] font-mono text-slate-600">
            <span id="detailCreatedAt">Created: {incident.createdAt}</span>
            <span id="detailLocation">Ubicación: {incident.location || 'Sede Lima Centro'}</span>
            {incident.category && <span>Categoría: {incident.category}</span>}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer" 
            id="btnDismissDetail"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}

