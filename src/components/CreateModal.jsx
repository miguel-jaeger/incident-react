import React, { useState } from 'react';

export default function CreateModal({ isOpen, onClose, onSubmit, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'High',
    status: 'Active',
    location: 'Lima Centro - Torre Tecnológica',
    category: 'General'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;
    onSubmit({ ...formData });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" id="createModal">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C8102E] text-white">
              <span className="material-symbols-outlined text-xl">add_alert</span>
            </div>
            <div>
              <h2 className="font-headline-md text-base font-bold text-slate-900">Registrar Incidente TI</h2>
              <p className="text-xs text-slate-500 font-mono">POST /api/incidents • Consola NOC 34998</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer" 
            id="btnCloseCreate"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form className="py-4 space-y-4 text-xs font-sans" id="createIncidentForm" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Título del Incidente <span className="text-red-600">*</span>
            </label>
            <input 
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600" 
              id="newTitle" 
              placeholder="ej. Caída de Access Point - Piso 4 Torre Arequipa" 
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Descripción Técnica <span className="text-red-600">*</span>
            </label>
            <textarea 
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600" 
              id="newDescription" 
              placeholder="Detalles del fallo de conectividad, equipos afectados o usuarios impactados..." 
              required
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nivel de Prioridad</label>
              <select 
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white cursor-pointer" 
                id="newPriority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">High (Crítico - Afecta Clases)</option>
                <option value="Medium">Medium (Parcial / En espera)</option>
                <option value="Low">Low (Consulta / Mantenimiento)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estado Inicial</label>
              <select 
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white cursor-pointer" 
                id="newStatus"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active (En atención)</option>
                <option value="Inactive">Inactive (Resuelto / Cerrado)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sede / Ubicación UTP</label>
            <input 
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600" 
              id="newLocation" 
              placeholder="ej. Lima Centro - Pabellón B, Aula 502" 
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Payload JSON validado con Schema Incident</span>
            <span className="text-red-700 font-semibold">Content-Type: application/json</span>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition" 
              id="btnCancelCreate"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#C8102E] hover:bg-[#a60b24] text-white font-headline-sm text-xs font-bold shadow transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Enviar POST Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

