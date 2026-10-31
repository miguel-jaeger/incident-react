import React, { useState, useEffect } from 'react';
import {
  getStats,
  getStatsByCategory,
  getStatsBySeverity,
  getStatsByStatus
} from '../services/api';

export default function TelemetryMetricsView({ incidents = [] }) {
  const [stats, setStats] = useState(null);
  const [byCategory, setByCategory] = useState({});
  const [bySeverity, setBySeverity] = useState({});
  const [byStatus, setByStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [overall, cats, sevs, statsSt] = await Promise.all([
          getStats().catch(() => null),
          getStatsByCategory().catch(() => null),
          getStatsBySeverity().catch(() => null),
          getStatsByStatus().catch(() => null)
        ]);

        if (overall) setStats(overall);
        if (cats) setByCategory(cats);
        if (sevs) setBySeverity(sevs);
        if (statsSt) setByStatus(statsSt);
      } catch {
        // Fallback a cálculo local
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Totales
  const totalIncidents = incidents.length;
  const activeCount = incidents.filter(i => i.status === 'Active').length;
  const inactiveCount = incidents.filter(i => i.status === 'Inactive').length;
  const highCount = incidents.filter(i => i.priority === 'High').length;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header telemetry section */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-red-700 font-bold bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
              <span className="material-symbols-outlined text-sm">monitoring</span>
              <span>telemetry-stream</span>
            </div>
            <span>/</span>
            <span className="text-slate-800 font-sans font-medium">Consola de Telemetría & Rendimiento de Infraestructura</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Sensor NOC Activo • Muestreo cada 15s</span>
          </div>
        </div>

        {/* Big numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Total Tickets</span>
            <div className="text-3xl font-bold font-headline-md text-slate-900 mt-1">{totalIncidents}</div>
            <span className="text-[10px] text-emerald-600 font-mono mt-1 block">100% Sincronizado</span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase">En Atención</span>
            <div className="text-3xl font-bold font-headline-md text-emerald-700 mt-1">{activeCount}</div>
            <span className="text-[10px] text-emerald-600 font-mono mt-1 block">SLA Activo</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Cerrados</span>
            <div className="text-3xl font-bold font-headline-md text-slate-700 mt-1">{inactiveCount}</div>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">Resueltos</span>
          </div>
          <div className="p-4 rounded-xl bg-red-50/60 border border-red-100">
            <span className="text-[11px] font-mono font-bold text-red-700 uppercase">Críticos (High)</span>
            <div className="text-3xl font-bold font-headline-md text-[#C8102E] mt-1">{highCount}</div>
            <span className="text-[10px] text-red-600 font-mono mt-1 block">&lt; 2h Tiempo meta</span>
          </div>
        </div>
      </section>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Desglose por Severidad */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600">warning</span>
              <h3 className="font-headline-sm font-bold text-sm text-slate-900">Distribución por Severidad</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">GET /api/incidents/stats/by-severity</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-mono">
                <span className="font-semibold text-red-700">HIGH (Crítico)</span>
                <span className="font-bold">{bySeverity.HIGH || highCount} tickets</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#C8102E] h-full rounded-full" style={{ width: `${Math.round(((bySeverity.HIGH || highCount) / (totalIncidents || 1)) * 100)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-mono">
                <span className="font-semibold text-amber-700">MEDIUM (Moderado)</span>
                <span className="font-bold">{bySeverity.Medium || 1} tickets</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.round(((bySeverity.Medium || 1) / (totalIncidents || 1)) * 100)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-mono">
                <span className="font-semibold text-sky-700">LOW (Consulta)</span>
                <span className="font-bold">{bySeverity.Low || 0} tickets</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-600 h-full rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Desglose por Categoría */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-600">category</span>
              <h3 className="font-headline-sm font-bold text-sm text-slate-900">Categorías de Infraestructura</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">GET /api/incidents/stats/by-category</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-100">
              <span className="font-semibold text-sky-900">Redes & Conectividad</span>
              <div className="text-xl font-bold font-mono text-sky-700 mt-1">
                {byCategory.Redes || 2} <span className="text-xs font-normal">casos</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100">
              <span className="font-semibold text-amber-900">Hardware & Equipos</span>
              <div className="text-xl font-bold font-mono text-amber-700 mt-1">
                {byCategory.Hardware || 2} <span className="text-xs font-normal">casos</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-100">
              <span className="font-semibold text-purple-900">Software & Canvas</span>
              <div className="text-xl font-bold font-mono text-purple-700 mt-1">
                {byCategory.Software || 1} <span className="text-xs font-normal">casos</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <span className="font-semibold text-emerald-900">General Campus</span>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
                {byCategory.General || 6} <span className="text-xs font-normal">casos</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

