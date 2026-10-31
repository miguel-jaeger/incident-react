import React, { useState, useEffect } from 'react';

export default function StatusModal({ isOpen, onClose, incident, onSubmit, isSubmitting = false }) {
  const [targetStatus, setTargetStatus] = useState('Active');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (incident) {
      setTargetStatus(incident.status || 'Active');
      setReason(incident.rejectionReason || '');
    }
  }, [incident]);

  if (!isOpen || !incident) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(incident.id, targetStatus, reason);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" id="statusModal">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <span className="material-symbols-outlined text-xl">edit_note</span>
            </div>
            <div>
              <h2 className="font-headline-md text-base font-bold text-slate-900">Actualizar Estado</h2>
              <p className="text-xs text-slate-500 font-mono" id="patchModalSubtitle">
                PATCH /api/incidents/{incident.id}/status • {incident.ticketCode}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer" 
            id="btnCloseStatus"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form className="py-4 space-y-4 text-xs font-sans" id="patchStatusForm" onSubmit={handleSubmit}>
          <div>
            <span className="block font-semibold text-slate-700 mb-2">Seleccionar Nuevo Estado</span>
            <div className="grid grid-cols-2 gap-3">
              <label 
                className={`cursor-pointer flex items-center gap-2.5 p-3 rounded-xl border transition ${
                  targetStatus === 'Active'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input 
                  className="accent-emerald-600 cursor-pointer" 
                  id="radioStatusActive" 
                  name="targetStatus" 
                  type="radio" 
                  value="Active"
                  checked={targetStatus === 'Active'}
                  onChange={() => setTargetStatus('Active')}
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">Active</span>
                  <span className="text-[11px] text-slate-500">En curso / Atención</span>
                </div>
              </label>

              <label 
                className={`cursor-pointer flex items-center gap-2.5 p-3 rounded-xl border transition ${
                  targetStatus === 'Inactive'
                    ? 'bg-slate-100 border-slate-400 text-slate-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input 
                  className="accent-slate-700 cursor-pointer" 
                  id="radioStatusInactive" 
                  name="targetStatus" 
                  type="radio" 
                  value="Inactive"
                  checked={targetStatus === 'Inactive'}
                  onChange={() => setTargetStatus('Inactive')}
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">Inactive</span>
                  <span className="text-[11px] text-slate-500">Solucionado / Cerrado</span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Razones del rechazo / Notas de resolución
            </label>
            <textarea 
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs" 
              id="patchReason" 
              placeholder="ej. 'Resuelto tras reinicio de switch poe', 'pepitoooo' o razón de desestimación..." 
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer transition" 
              id="btnCancelStatus"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-headline-sm font-bold shadow transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Ejecutar PATCH"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

