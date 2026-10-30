import { CATEGORY_COLORS, statusLabel, priorityLabel } from '../../lib/labels';
export function IncidentList({
    canDeleteIncident,
    canEditIncident,
    catClass,
    filteredIncidents,
    handleDelete,
    handleOpenDetailModal,
    handleOpenPatchModal,
    isActive,
    setCategoryFilter,
    setPriorityFilter,
    setSearchQuery,
    setStatusFilter,
    view
}) {
  return (
    <>
          {/* Main Incident Display */}
          <section className="w-full">
            {filteredIncidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-surface-container-lowest border border-dashed border-surface-container">
                <span className="material-symbols-outlined text-5xl text-outline mb-2">content_paste_off</span>
                <h3 className="font-headline-sm text-base text-on-surface font-semibold">No se encontraron incidentes</h3>
                <p className="text-xs text-on-surface-variant mt-1 max-w-sm">No hay registros que coincidan con los filtros seleccionados.</p>
                <button
                  onClick={() => { setStatusFilter('ALL'); setPriorityFilter('ALL'); setCategoryFilter('ALL'); setSearchQuery(''); }}
                  className="mt-4 px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : view === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredIncidents.map((item) => {
                  const isActive = item.status === 'Active';
                  const catClass = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.General;

                  return (
                    <div key={item.id} className="relative flex flex-col justify-between rounded-xl bg-surface-container-lowest p-4 shadow-sm hover:shadow-md transition border border-surface-container">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <span className="font-mono text-xs font-bold text-primary">{item.ticketCode}</span>
                            <h3
                              onClick={() => handleOpenDetailModal(item)}
                              className="font-headline-sm text-sm text-on-surface font-bold hover:text-primary transition cursor-pointer mt-0.5 line-clamp-1"
                            >
                              {item.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-on-surface-variant'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-outline'}`}></span>
                              {statusLabel(item.status)}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold text-white ${item.priority === 'High' ? 'bg-primary' : item.priority === 'Medium' ? 'bg-amber-500' : 'bg-sky-600'}`}>
                              {priorityLabel(item.priority)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-on-surface line-clamp-2">
                          <span className="font-semibold text-on-surface-variant">Descripción:</span> {item.description}
                        </div>

                        {item.rejectionReason && (
                          <div className="mt-2.5 p-2 rounded-lg bg-surface-container-low text-xs flex items-start gap-1.5 border border-surface-container">
                            <span className="font-semibold text-on-surface-variant shrink-0">Observaciones:</span>
                            <span className="text-on-surface break-words">{item.rejectionReason}</span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between text-[11px] text-outline font-mono pt-2 border-t border-surface-container">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${catClass}`}>
                            {item.category}
                          </span>
                          <span className="text-on-surface-variant truncate max-w-[130px]" title={item.location}>
                            {item.location || 'Campus UTP'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between gap-1">
                        <button
                          onClick={() => handleOpenDetailModal(item)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-tertiary hover:bg-tertiary/10 text-xs font-semibold transition"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                          <span>Detalle</span>
                        </button>
                        {canEditIncident && (
                          <button
                            onClick={() => handleOpenPatchModal(item)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-amber-600 hover:bg-amber-500/10 text-xs font-semibold transition"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                            <span>Editar</span>
                          </button>
                        )}
                        {canDeleteIncident && (
                          <button
                            onClick={() => handleDelete(item.id, item.ticketCode, item.title)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-primary hover:bg-primary/10 text-xs font-semibold transition"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                            <span>Eliminar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant border-b border-surface-container">
                    <tr>
                      <th className="py-3 px-4">Ticket</th>
                      <th className="py-3 px-4">Título &amp; Ubicación</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Prioridad</th>
                      <th className="py-3 px-4">Notas / Resolución</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {filteredIncidents.map((item) => {
                      const isActive = item.status === 'Active';
                      const catClass = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.General;

                      return (
                        <tr key={item.id} className="hover:bg-surface-container-low transition">
                          <td className="py-3 px-4 font-mono font-bold text-primary">{item.ticketCode}</td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-on-surface">{item.title}</div>
                            <div className="text-on-surface-variant text-xs">{item.location || 'Campus UTP'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${catClass}`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-on-surface-variant'}`}>
                              {statusLabel(item.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold text-white ${item.priority === 'High' ? 'bg-primary' : item.priority === 'Medium' ? 'bg-amber-500' : 'bg-sky-600'}`}>
                              {priorityLabel(item.priority)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-on-surface-variant text-xs max-w-xs truncate">{item.rejectionReason || '—'}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button onClick={() => handleOpenDetailModal(item)} className="p-1.5 rounded-lg text-tertiary hover:bg-tertiary/10" title="Ver Detalle">
                                <span className="material-symbols-outlined text-base">visibility</span>
                              </button>
                              {canEditIncident && (
                                <button onClick={() => handleOpenPatchModal(item)} className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-500/10" title="Editar Estado y Prioridad">
                                  <span className="material-symbols-outlined text-base">edit</span>
                                </button>
                              )}
                              {canDeleteIncident && (
                                <button onClick={() => handleDelete(item.id, item.ticketCode, item.title)} className="p-1.5 rounded-lg text-primary hover:bg-primary/10" title="Eliminar">
                                  <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
    </>
  );
}
