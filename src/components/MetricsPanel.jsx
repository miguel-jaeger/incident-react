import React, { memo } from 'react';
export default memo(function MetricsPanel({Skeleton, categoryFilter, incidents, setCategoryFilter, stats, statsLoading}) { return <>
            {/* Metric Bento Grid (5 Cards) */}
            <div className="bento-metrics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Total Tickets */}
              <div className="bento-metric relative overflow-hidden rounded-3xl bg-surface-container-lowest p-5 sm:p-6 border border-surface-container">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Total Incidentes</span>
                  <span className="p-1 rounded-lg bg-surface-container text-tertiary material-symbols-outlined text-base">dataset</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl text-on-surface font-bold">{statsLoading ? <Skeleton className="h-10 w-20" /> : (stats.total || incidents.length)}</span>
                  <span className="text-xs text-emerald-600 font-medium">Métricas actualizadas</span>
                </div>
                <div className="mt-2 text-xs text-on-surface-variant flex items-center justify-between">
                  <span>Sincronizado con la base de datos</span>
                  <span className="font-semibold text-on-surface">En línea</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-tertiary to-tertiary-container"></div>
              </div>

              {/* Active */}
              <div className="bento-metric relative overflow-hidden rounded-3xl bg-surface-container-lowest p-5 sm:p-6 border border-surface-container">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Activos / En Atención</span>
                  <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700 material-symbols-outlined text-base">radio_button_checked</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl text-emerald-700 font-bold">{statsLoading ? <Skeleton className="h-10 w-20" /> : (stats.active || 0)}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold">Activo</span>
                </div>
                <div className="mt-2 text-xs text-on-surface-variant flex items-center justify-between">
                  <span>Requieren acción técnica</span>
                  <span className="font-semibold text-emerald-700">
                    {statsLoading ? <Skeleton className="h-4 w-8" /> : `${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%`}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
              </div>

              {/* Inactive */}
              <div className="bento-metric relative overflow-hidden rounded-3xl bg-surface-container-lowest p-5 sm:p-6 border border-surface-container">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Inactivos / Cerrados</span>
                  <span className="p-1 rounded-lg bg-surface-container text-outline material-symbols-outlined text-base">task_alt</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl text-on-surface font-bold">{statsLoading ? <Skeleton className="h-10 w-20" /> : (stats.inactive || 0)}</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-xs font-bold">Inactivo</span>
                </div>
                <div className="mt-2 text-xs text-on-surface-variant flex items-center justify-between">
                  <span>Tickets solucionados</span>
                  <span className="font-semibold text-on-surface">
                    {statsLoading ? <Skeleton className="h-4 w-8" /> : `${stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}%`}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-outline"></div>
              </div>

              {/* Critical / High Priority */}
              <div className="bento-metric relative overflow-hidden rounded-3xl bg-surface-container-lowest p-5 sm:p-6 border border-surface-container">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Prioridad Alta</span>
                  <span className="p-1 rounded-lg bg-red-100 text-primary material-symbols-outlined text-base">warning</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl text-primary font-bold">
                    {statsLoading ? <Skeleton className="h-10 w-20" /> : ((stats.bySeverity && (stats.bySeverity.High || stats.bySeverity.HIGH)) || incidents.filter(i => (i.priority || '').toUpperCase() === 'HIGH').length)}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary text-xs font-bold">Críticos</span>
                </div>
                <div className="mt-2 text-xs text-on-surface-variant flex items-center justify-between">
                  <span>SLA Campus &lt; 2h</span>
                  <span className="font-semibold text-primary">Atención UTP</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-container"></div>
              </div>

              {/* Campus SLA */}
              <div className="bento-metric relative overflow-hidden rounded-3xl bg-surface-container-lowest p-5 sm:p-6 border border-surface-container">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Tiempo Promedio</span>
                  <span className="p-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant material-symbols-outlined text-base">timer</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl text-on-surface font-bold">1.2<span className="text-lg font-normal">h</span></span>
                  <span className="text-xs text-emerald-600 font-medium">-25% vs meta</span>
                </div>
                <div className="mt-2 text-xs text-on-surface-variant flex items-center justify-between">
                  <span>Resolución de incidentes</span>
                  <span className="font-semibold text-tertiary">Óptimo NOC</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-tertiary"></div>
              </div>
            </div>

            {/* Interactive Category Pills Bar */}
            <div className="mt-4 p-4 rounded-3xl bg-surface-container-lowest border border-surface-container flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                <span className="material-symbols-outlined text-sm text-primary">category</span>
                <span>Métricas por Categoría:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {statsLoading ? <Skeleton className="h-8 w-48" /> : Object.entries(stats.byCategory || {}).map(([cat, count]) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(categoryFilter === cat ? 'ALL' : cat)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container border-surface-container text-on-surface'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${categoryFilter === cat ? 'bg-white text-primary' : 'bg-primary/10 text-primary'}`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

</>; });
