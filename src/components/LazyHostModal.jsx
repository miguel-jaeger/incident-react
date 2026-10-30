import React, { useState } from 'react';
export default function LazyHostModal({DEFAULT_LOCAL_URL, DEFAULT_RENDER_URL, currentHost, customHostInput: initialValue, handleSaveHost, isOnline, setShowHostModal, showHostModal}) {
  const [customHostInput, setCustomHostInput] = useState(initialValue);
  return <>
      {/* Modal: Cambiar Servidor */}
      {showHostModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl flex flex-col border border-surface-container">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-xl">dns</span>
                <h2 className="font-headline-md text-base text-on-surface font-bold">Configuración de Servidor Backend</h2>
              </div>
              <button onClick={() => setShowHostModal(false)} className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3">
              <label className="block text-xs font-semibold text-on-surface">URL Base de la API:</label>
              <input
                type="text"
                value={customHostInput}
                onChange={(e) => setCustomHostInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm font-mono text-on-surface border border-surface-container focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setCustomHostInput(DEFAULT_LOCAL_URL)} className="flex-1 py-1.5 px-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface">Local (8081)</button>
                <button type="button" onClick={() => setCustomHostInput('http://localhost:8080')} className="flex-1 py-1.5 px-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface">Local (8080)</button>
                <button type="button" onClick={() => setCustomHostInput(DEFAULT_RENDER_URL)} className="flex-1 py-1.5 px-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface">Render Prod</button>
              </div>
            </div>

            <div className="pt-2 border-t border-surface-container flex justify-end gap-2">
              <button onClick={() => handleSaveHost(customHostInput)} className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold">Guardar y Reconectar</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-surface-container py-6">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/50/Utplogonuevo.svg" alt="UTP Logo" className="h-6 w-auto object-contain" />
            <span>© 2026 Universidad Tecnológica del Perú • Mesa Operativa de Incidentes TI (React)</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Mesa de Ayuda UTP</span>
            <span>•</span>
            <span>Soporte NOC Campus</span>
            <span>•</span>
            <span className={`font-mono font-semibold ${isOnline ? 'text-emerald-600' : 'text-error'}`}>
              {isOnline ? `En línea: ${currentHost.replace(/^https?:\/\//, '')}` : 'Desconectado'}
            </span>
          </div>
        </div>
      </footer>
</>; }
