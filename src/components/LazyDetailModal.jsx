import React from 'react';
export default function LazyDetailModal({CATEGORY_COLORS, ContentSkeleton, detailLoading, priorityLabel, selectedIncident, setShowDetailModal, showDetailModal, statusLabel}) { return <>
      {/* Modal: Detalle */}
      {showDetailModal && selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-2xl bg-surface-container-lowest p-6 shadow-2xl flex flex-col border border-surface-container">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant">
                  <span className="material-symbols-outlined text-xl">info</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-base text-on-surface font-bold">{selectedIncident.ticketCode} (ID: {selectedIncident.id})</h2>
                  <p className="text-xs text-on-surface-variant">Detalle del incidente</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {detailLoading && <ContentSkeleton />}
            <div hidden={detailLoading} className="py-4 space-y-3">
              <div>
                <span className="text-xs uppercase text-on-surface-variant font-semibold">Título</span>
                <h3 className="font-headline-sm text-sm text-on-surface font-bold mt-0.5">{selectedIncident.title}</h3>
              </div>

              <div>
                <span className="text-xs uppercase text-on-surface-variant font-semibold">Descripción Técnica</span>
                <p className="text-[14px] whitespace-pre-wrap [overflow-wrap:anywhere] text-on-surface mt-0.5 p-3 rounded-lg bg-surface-container-low border border-surface-container">{selectedIncident.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-[11px] uppercase text-on-surface-variant font-semibold">Categoría</span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${CATEGORY_COLORS[selectedIncident.category] || CATEGORY_COLORS.General}`}>
                      {selectedIncident.category}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] uppercase text-on-surface-variant font-semibold">Estado</span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${selectedIncident.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-on-surface-variant'}`}>
                      {statusLabel(selectedIncident.status)}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] uppercase text-on-surface-variant font-semibold">Prioridad</span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold text-white ${selectedIncident.priority === 'High' ? 'bg-primary' : selectedIncident.priority === 'Medium' ? 'bg-amber-500' : 'bg-sky-600'}`}>
                      {priorityLabel(selectedIncident.priority)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs uppercase text-on-surface-variant font-semibold">Observaciones / Notas de Cierre</span>
                <p className="text-xs text-on-surface mt-0.5 p-3 rounded-lg bg-surface-container-low border border-surface-container">
                  {selectedIncident.rejectionReason || 'Ninguna observación registrada.'}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col gap-1 text-[11px] text-on-surface-variant border border-surface-container font-mono">
                <span>Registrado: {selectedIncident.createdAt}</span>
                <span>Ubicación: {selectedIncident.location || 'Campus UTP Central'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-container flex justify-end">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold">Cerrar Detalle</button>
            </div>
          </div>
        </div>
      )}


</>; }
