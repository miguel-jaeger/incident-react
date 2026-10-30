import { Incident } from '../../../core/models/incident.model';
import { computeStats, filterIncidents, createIncidentDraft } from './incident-calculations';

const incidents: Incident[] = [
  { id: 1, title: 'Caida de AP', description: 'desc1', status: 'Active', priority: 'High', location: 'Lima Centro' },
  { id: 2, title: 'Switch Core', description: 'desc2', status: 'Inactive', priority: 'Medium', location: 'Lima Norte' },
  { id: 3, title: 'Proyector', description: 'desc3', status: 'Active', priority: 'Low', location: 'Aula 502', message: 'Resuelto' }
];

describe('computeStats', () => {
  it('calcula totales y porcentajes', () => {
    const stats = computeStats(incidents);
    expect(stats.total).toBe(3);
    expect(stats.active).toBe(2);
    expect(stats.inactive).toBe(1);
    expect(stats.high).toBe(1);
    expect(stats.activePercentage).toBe(67);
    expect(stats.inactivePercentage).toBe(33);
  });

  it('maneja listas vacías sin dividir por cero', () => {
    const stats = computeStats([]);
    expect(stats.total).toBe(0);
    expect(stats.activePercentage).toBe(0);
  });
});

describe('filterIncidents', () => {
  it('retorna todo sin filtros', () => {
    expect(filterIncidents(incidents, '', 'ALL', 'ALL').length).toBe(3);
  });

  it('filtra por estado', () => {
    const result = filterIncidents(incidents, '', 'Active', 'ALL');
    expect(result.length).toBe(2);
  });

  it('filtra por prioridad', () => {
    const result = filterIncidents(incidents, '', 'ALL', 'High');
    expect(result.length).toBe(1);
  });

  it('busca por título, ubicación y nota de resolución (case-insensitive)', () => {
    expect(filterIncidents(incidents, 'switch', 'ALL', 'ALL').length).toBe(1);
    expect(filterIncidents(incidents, 'aula', 'ALL', 'ALL').length).toBe(1);
    expect(filterIncidents(incidents, 'resuelto', 'ALL', 'ALL').length).toBe(1);
  });

  it('combina búsqueda + estado + prioridad', () => {
    const result = filterIncidents(incidents, '', 'Inactive', 'Medium');
    expect(result.length).toBe(1);
    expect(filterIncidents(incidents, '', 'Active', 'Medium').length).toBe(0);
  });
});

describe('createIncidentDraft', () => {
  it('devuelve un borrador con valores por defecto', () => {
    const draft = createIncidentDraft();
    expect(draft.priority).toBe('High');
    expect(draft.status).toBe('Active');
    expect(draft.title).toBe('');
  });
});
