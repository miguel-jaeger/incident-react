// Estilos y etiquetas compartidos por los componentes de la mesa.
// Helper de estilos por categoría
export const CATEGORY_COLORS = {
  Redes: 'bg-sky-100 text-sky-800 border-sky-200',
  Hardware: 'bg-amber-100 text-amber-800 border-amber-200',
  Software: 'bg-purple-100 text-purple-800 border-purple-200',
  Seguridad: 'bg-rose-100 text-rose-800 border-rose-200',
  Infraestructura: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  General: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const ROLE_STYLES = {
  ADMIN: 'bg-primary/10 text-primary border-primary/30',
  SUPERVISOR: 'bg-amber-100 text-amber-800 border-amber-200',
  OPERATOR: 'bg-sky-100 text-sky-800 border-sky-200',
  SUPPORT: 'bg-violet-100 text-violet-800 border-violet-200',
};

export const ROLE_LABELS = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  OPERATOR: 'Operador',
  SUPPORT: 'Soporte',
};

// El backend mantiene datos históricos con OPEN/CLOSED y nuevos con Active/Inactive.
const ACTIVE_STATUSES = ['ACTIVE', 'OPEN', 'IN_PROGRESS', 'EN_PROGRESO'];

export function normalizeStatus(status) {
  return ACTIVE_STATUSES.includes(String(status || '').toUpperCase()) ? 'Active' : 'Inactive';
}

export function normalizePriority(priority) {
  const value = String(priority || 'Low').toUpperCase();
  if (value === 'CRITICAL' || value === 'CRITICA' || value === 'CRÍTICA') return 'High';
  if (value === 'ALTA') return 'High';
  if (value === 'MEDIA') return 'Medium';
  if (value === 'BAJA') return 'Low';
  return value.charAt(0) + value.slice(1).toLowerCase();
}

const STATUS_LABELS = { Active: 'Activo', Inactive: 'Inactivo' };
const PRIORITY_LABELS = { High: 'Alta', Medium: 'Media', Low: 'Baja' };

export function statusLabel(status) {
  return STATUS_LABELS[status] || status || '—';
}

export function priorityLabel(priority) {
  return PRIORITY_LABELS[priority] || priority || '—';
}

