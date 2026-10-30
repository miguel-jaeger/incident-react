import React, { useState } from 'react';
export default function LazyCreateModal({handleCreateSubmit, newIncident: initialValue, setShowCreateModal, showCreateModal}) {
  const [newIncident, setNewIncident] = useState(initialValue);
  return <>
      {/* Modal: Crear Incidente */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-2xl bg-surface-container-lowest p-6 shadow-2xl flex flex-col border border-surface-container">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary text-white">
                  <span className="material-symbols-outlined text-xl">add_alert</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-lg text-on-surface font-bold">Registrar Incidente TI</h2>
                  <p className="text-xs text-on-surface-variant">Mesa de Servicio UTP</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={(event) => handleCreateSubmit(event, newIncident)} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Título del Incidente <span className="text-primary">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="ej. Falla en Access Point Piso 3 Pabellón B"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Descripción Técnica <span className="text-primary">*</span></label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detalles del equipo, usuario impactado o fallo..."
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Categoría</label>
                  <select
                    value={newIncident.category}
                    onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none cursor-pointer"
                  >
                    <option value="Redes">Redes</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Seguridad">Seguridad</option>
                    <option value="Infraestructura">Infraestructura</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Prioridad</label>
                  <select
                    value={newIncident.priority}
                    onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none cursor-pointer"
                  >
                    <option value="Low">Baja — por defecto</option>
                    <option value="Medium">Media</option>
                    <option value="High">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Estado</label>
                  <select
                    value={newIncident.status}
                    onChange={(e) => setNewIncident({ ...newIncident, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Activo (En atención)</option>
                    <option value="Inactive">Inactivo (Cerrado)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Sede / Ubicación UTP</label>
                <input
                  type="text"
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-md transition">Registrar Incidente</button>
              </div>
            </form>
          </div>
        </div>
      )}


</>; }
