import React from 'react';

export default function KpiMetrics({ total = 6, active = 4, inactive = 2, high = 5 }) {
  const safeTotal = total > 0 ? total : 1;
  const activePercent = Math.round((active / safeTotal) * 100);
  const inactivePercent = Math.round((inactive / safeTotal) * 100);
  const highPercent = Math.round((high / safeTotal) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4 pt-4">
      {/* 1. Total Incidentes */}
      <div className="bg-slate-50/80 rounded-lg p-3.5 border border-slate-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold tracking-wider uppercase">Total Incidentes</span>
          <span className="material-symbols-outlined text-base text-slate-400">dataset</span>
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-2xl font-bold font-headline-md text-slate-900" id="statTotal">
            {total}
          </span>
          <span className="text-[11px] font-mono text-emerald-600 font-medium">GET /incidents</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate">Sincronizados</span>
          <span className="font-mono font-semibold text-slate-700">100%</span>
        </div>
        <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
          <div className="bg-slate-700 h-full rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* 2. Activos / En Atención */}
      <div className="bg-emerald-50/50 rounded-lg p-3.5 border border-emerald-100 flex flex-col justify-between">
        <div className="flex items-center justify-between text-emerald-800 mb-1">
          <span className="text-[11px] font-semibold tracking-wider uppercase">Activos / En Atención</span>
          <span className="material-symbols-outlined text-base text-emerald-600">radio_button_checked</span>
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-2xl font-bold font-headline-md text-emerald-700" id="statActive">
            {active}
          </span>
          <span className="text-[11px] font-mono px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
            Active
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate">Requieren acción</span>
          <span className="font-mono font-semibold text-emerald-700">{activePercent}%</span>
        </div>
        <div className="w-full bg-emerald-200/70 h-1 rounded-full mt-1.5 overflow-hidden">
          <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(activePercent, 100)}%` }}></div>
        </div>
      </div>

      {/* 3. Inactivos / Resueltos */}
      <div className="bg-slate-50/80 rounded-lg p-3.5 border border-slate-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold tracking-wider uppercase">Inactivos / Resueltos</span>
          <span className="material-symbols-outlined text-base text-slate-400">task_alt</span>
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-2xl font-bold font-headline-md text-slate-700" id="statInactive">
            {inactive}
          </span>
          <span className="text-[11px] font-mono px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-semibold">
            Inactive
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate">Tickets resueltos</span>
          <span className="font-mono font-semibold text-slate-700">{inactivePercent}%</span>
        </div>
        <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
          <div className="bg-slate-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(inactivePercent, 100)}%` }}></div>
        </div>
      </div>

      {/* 4. Prioridad Alta (High) */}
      <div className="bg-red-50/60 rounded-lg p-3.5 border border-red-100 flex flex-col justify-between">
        <div className="flex items-center justify-between text-red-800 mb-1">
          <span className="text-[11px] font-semibold tracking-wider uppercase">Prioridad Alta (High)</span>
          <span className="material-symbols-outlined text-base text-red-600">warning</span>
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-2xl font-bold font-headline-md text-[#C8102E]" id="statHigh">
            {high}
          </span>
          <span className="text-[11px] font-bold px-1.5 py-0.5 bg-red-600 text-white rounded tracking-wide">
            Críticos
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate">SLA &lt; 2h Campus</span>
          <span className="font-semibold text-red-700">Atención UTP</span>
        </div>
        <div className="w-full bg-red-200/60 h-1 rounded-full mt-1.5 overflow-hidden">
          <div className="bg-[#C8102E] h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(highPercent, 100)}%` }}></div>
        </div>
      </div>

      {/* 5. Tiempo Promedio UTP */}
      <div className="col-span-2 md:col-span-1 bg-slate-50/80 rounded-lg p-3.5 border border-slate-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold tracking-wider uppercase">Tiempo Promedio UTP</span>
          <span className="material-symbols-outlined text-base text-sky-600">timer</span>
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-2xl font-bold font-headline-md text-slate-900">
            1.4<span className="text-base font-normal text-slate-500">h</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-600 font-semibold">-22% vs meta</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate">Resolución media</span>
          <span className="font-semibold text-sky-700">Óptimo</span>
        </div>
        <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
          <div className="bg-sky-600 h-full rounded-full transition-all duration-500" style={{ width: '70%' }}></div>
        </div>
      </div>
    </div>
  );
}

