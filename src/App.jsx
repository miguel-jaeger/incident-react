import React, { useMemo, useState } from 'react';
import TopBar from './components/dashboard/TopBar';
import StatCard from './components/dashboard/StatCard';
import FilterBar from './components/dashboard/FilterBar';
import IncidentTable from './components/dashboard/IncidentTable';
import { incidentData, overviewStats } from './data/incidentData';

const statsConfig = [
  {
    title: 'Total incidentes',
    value: overviewStats.total,
    meta: { text: 'Sincronizados', icon: '▣', value: '100%' },
    accent: 'text-slate-700',
    progress: 100,
    label: '/incidents',
    tone: 'default',
  },
  {
    title: 'Activos / En atención',
    value: overviewStats.active,
    meta: {
      text: 'Requieren acción',
      icon: '◉',
      value: `${Math.round((overviewStats.active / overviewStats.total) * 100)}%`,
    },
    accent: 'text-emerald-600',
    progress: (overviewStats.active / overviewStats.total) * 100,
    label: 'Active',
    tone: 'success',
  },
  {
    title: 'Inactivos / Resultos',
    value: overviewStats.inactive,
    meta: {
      text: 'Tickets resueltos',
      icon: '◌',
      value: `${Math.round((overviewStats.inactive / overviewStats.total) * 100)}%`,
    },
    accent: 'text-slate-600',
    progress: (overviewStats.inactive / overviewStats.total) * 100,
    label: 'Inactive',
    tone: 'default',
  },
  {
    title: 'Prioridad alta',
    value: overviewStats.critical,
    meta: { text: 'SLA < 2h Campus', icon: '⚠', value: 'Atención UTP' },
    accent: 'text-red-600',
    progress: (overviewStats.critical / overviewStats.total) * 100,
    label: 'Críticos',
    tone: 'danger',
  },
  {
    title: 'Tiempo promedio',
    value: overviewStats.avgTime,
    meta: { text: 'Resolución media', icon: '⏱', value: 'Óptimo' },
    accent: 'text-sky-600',
    progress: 75,
    label: '-22% vs meta',
    tone: 'info',
  },
];

export default function App() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [priorityFilter, setPriorityFilter] = useState('Todas');

  const filteredIncidents = useMemo(() => {
    const normalizedStatus =
      statusFilter === 'Activos' ? 'Active' : statusFilter === 'Inactivos' ? 'Inactive' : null;

    return incidentData.filter((incident) => {
      const matchesStatus = !normalizedStatus || incident.status === normalizedStatus;
      const matchesPriority = priorityFilter === 'Todas' || incident.priority === priorityFilter;
      const matchesSearch =
        !search ||
        incident.id.toLowerCase().includes(search.toLowerCase()) ||
        incident.title.toLowerCase().includes(search.toLowerCase()) ||
        incident.description.toLowerCase().includes(search.toLowerCase()) ||
        incident.campus.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [search, statusFilter, priorityFilter]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 antialiased">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <TopBar />

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statsConfig.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="mt-5">
          <FilterBar
            search={search}
            onSearch={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            onOpenCreate={() => console.log('Nuevo incidente')}
          />
        </div>

        <div className="mt-5">
          <IncidentTable incidents={filteredIncidents} />
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 sm:flex-row">
          <span>Mostrando {filteredIncidents.length} de {incidentData.length} incidentes registrados</span>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Conectado NOC UTP · Sincronización continua activa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
