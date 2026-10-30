import React from 'react';
export default function LazyStatusModal({active, base, handlePatchSubmit, label, patchStatusData, setPatchStatusData, setShowStatusModal, showStatusModal, value}) { return <>
      {/* Modal: Editar Estado */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-2xl flex flex-col border border-surface-container">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                  <span className="material-symbols-outlined text-xl">edit_note</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-base text-on-surface font-bold">Editar Incidente</h2>
                  <p className="text-xs text-on-surface-variant">Estado y prioridad • {patchStatusData.ticketCode}</p>
                </div>
              </div>
              <button onClick={() => setShowStatusModal(false)} className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handlePatchSubmit} className="py-4 space-y-4">
              <div>
                <span className="block text-xs font-semibold text-on-surface mb-2">Seleccionar Nuevo Estado:</span>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`cursor-pointer flex items-center gap-2 p-3 rounded-xl border transition ${patchStatusData.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500' : 'bg-surface-container-low border-surface-container'}`}>
                    <input
                      type="radio"
                      name="statusChoice"
                      value="Active"
                      checked={patchStatusData.status === 'Active'}
                      onChange={() => setPatchStatusData({ ...patchStatusData, status: 'Active' })}
                      className="accent-emerald-600"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-emerald-800">Activo</span>
                      <span className="text-[11px] text-on-surface-variant">En curso / Atención</span>
                    </div>
                  </label>
                  <label className={`cursor-pointer flex items-center gap-2 p-3 rounded-xl border transition ${patchStatusData.status === 'Inactive' ? 'bg-slate-200 border-slate-400' : 'bg-surface-container-low border-surface-container'}`}>
                    <input
                      type="radio"
                      name="statusChoice"
                      value="Inactive"
                      checked={patchStatusData.status === 'Inactive'}
                      onChange={() => setPatchStatusData({ ...patchStatusData, status: 'Inactive' })}
                      className="accent-slate-700"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">Inactivo</span>
                      <span className="text-[11px] text-on-surface-variant">Solucionado / Cerrado</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-on-surface mb-2">Prioridad del Incidente:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'High', label: 'Alta', hint: 'Atención inmediata', active: 'bg-rose-500/10 border-rose-500', dot: 'bg-rose-600' },
                    { value: 'Medium', label: 'Media', hint: 'Atención normal', active: 'bg-amber-500/10 border-amber-500', dot: 'bg-amber-500' },
                    { value: 'Low', label: 'Baja', hint: 'Puede esperar', active: 'bg-sky-500/10 border-sky-500', dot: 'bg-sky-600' },
                  ].map(option => (
                    <label
                      key={option.value}
                      className={`cursor-pointer flex items-center gap-2 p-3 rounded-xl border transition ${patchStatusData.priority === option.value ? option.active : 'bg-surface-container-low border-surface-container'}`}
                    >
                      <input
                        type="radio"
                        name="priorityChoice"
                        value={option.value}
                        checked={patchStatusData.priority === option.value}
                        onChange={() => setPatchStatusData({ ...patchStatusData, priority: option.value })}
                        className="accent-primary"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${option.dot}`}></span>
                          {option.label}
                        </span>
                        <span className="text-[11px] text-on-surface-variant">{option.hint}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1.5">Valor por defecto: Baja.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Razones del rechazo / Notas de resolución</label>
                <textarea
                  rows={3}
                  value={patchStatusData.message}
                  onChange={(e) => setPatchStatusData({ ...patchStatusData, message: e.target.value })}
                  placeholder="ej. Resuelto tras reemplazo de cable de red..."
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowStatusModal(false)} className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition">Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}


</>; }
