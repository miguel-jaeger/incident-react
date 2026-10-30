import { Incident } from '../../../core/models/incident.model';

export type StatusFilter = 'ALL' | 'Active' | 'Inactive';
export type PriorityFilter = 'ALL' | 'High' | 'Medium' | 'Low';
export type IncidentView = 'cards' | 'table';

export interface IncidentStats {
  total: number;
  active: number;
  inactive: number;
  high: number;
  activePercentage: number;
  inactivePercentage: number;
}

/** Valores iniciales del formulario de creación de incidentes. */
export function createIncidentDraft(): Partial<Incident> {
  return {
    title: '',
    description: '',
    priority: 'High',
    status: 'Active',
    location: 'Lima Centro - Torre Tecnológica',
    category: 'Infraestructura',
    severity: 'Medium'
  };
}

/** Calcula los KPIs del panel a partir del listado en memoria. */
export function computeStats(incidents: Incident[]): IncidentStats {
  const total = incidents.length;
  const active = incidents.filter((i) => i.status === 'Active').length;
  const inactive = incidents.filter((i) => i.status === 'Inactive').length;
  const high = incidents.filter((i) => i.priority === 'High').length;

  return {
    total,
    active,
    inactive,
    high,
    activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
    inactivePercentage: total > 0 ? Math.round((inactive / total) * 100) : 0
  };
}

/** Filtra el listado por búsqueda textual + estado + prioridad. */
export function filterIncidents(
  incidents: Incident[],
  searchQuery: string,
  statusFilter: StatusFilter,
  priorityFilter: PriorityFilter
): Incident[] {
  const q = searchQuery.trim().toLowerCase();

  return incidents.filter((item) => {
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;

    const searchable = [
      item.id !== undefined ? String(item.id) : '',
      item.ticketCode || `inc-${1040 + (item.id || 0)}`,
      item.title || '',
      item.description || '',
      item.location || '',
      item.message || ''
    ]
      .join(' ')
      .toLowerCase();

    return matchStatus && matchPriority && (!q || searchable.includes(q));
  });
}
