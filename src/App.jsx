import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getIncidents,
  getStats,
  createIncident,
  updateIncidentStatus,
  deleteIncident,
  loginUser,
  logoutUser,
  getCurrentUser,
  getAuthToken,
  API_BASE_URL,
} from './services/api';

const ACTIVE_STATUSES = ['ACTIVE', 'OPEN', 'IN_PROGRESS', 'EN_PROGRESO'];

function normalizeStatus(status) {
  return ACTIVE_STATUSES.includes(String(status || '').toUpperCase()) ? 'Active' : 'Inactive';
}

function normalizePriority(priority) {
  const value = String(priority || 'Low').toUpperCase();
  if (['CRITICAL', 'CRITICA', 'CRÍTICA', 'ALTA', 'HIGH'].includes(value)) return 'High';
  if (['MEDIA', 'MEDIUM'].includes(value)) return 'Medium';
  if (['BAJA', 'LOW'].includes(value)) return 'Low';
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return String(iso).split('T')[0];
  } catch {
    return String(iso);
  }
}

function Icon({ name, className = 'text-xl' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, bySeverity: {} });
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);
  const [apiMessage, setApiMessage] = useState('');

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('utp_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [campusFilter, setCampusFilter] = useState('ALL');

  const [showCreate, setShowCreate] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [selected, setSelected] = useState(null);
  const [patchData, setPatchData] = useState({ id: null, status: 'Active', message: '', ticketCode: '' });

  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    priority: 'High',
    status: 'Active',
    location: 'Lima Centro - Torre Tecnológica',
    category: 'General',
  });

  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'admin123' });
  const [loginError, setLoginError] = useState('');
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({ visible: false, title: '', message: '', isSuccess: true });

  const triggerToast = useCallback((title, message, isSuccess = true) => {
    setToast({ visible: true, title, message, isSuccess });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
  }, []);

  const isAdmin = Boolean(user && String(user.role || '').toUpperCase() === 'ADMIN');
  const isAuthenticated = Boolean(user);

  const mapIncident = (item) => ({
    id: item.id,
    ticketCode: item.ticketCode || item.ticket_code || `INC-${item.id}`,
    title: item.title || 'Sin título',
    description: item.description || '',
    rejectionReason: item.message || item.rejectionReason || item.rejection_reason || '',
    status: normalizeStatus(item.status),
    priority: normalizePriority(item.priority || item.severity),
    createdAt: item.createdAt || item.created_at || '',
    location: item.location || 'Campus UTP',
    category: item.category || 'General',
    raw: item,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [list, statsResult] = await Promise.all([
        getIncidents().catch(() => []),
        getStats().catch(() => null),
      ]);
      const arr = Array.isArray(list) ? list : list?.incidents || list?.content || [];
      const mapped = arr.map(mapIncident);
      setIncidents(mapped);

      if (statsResult && typeof statsResult === 'object') {
        const byStatus = statsResult.byStatus || {};
        const activeFromStats =
          statsResult.active ??
          Object.entries(byStatus).reduce((acc, [k, v]) => {
            return ACTIVE_STATUSES.includes(String(k).toUpperCase()) || String(k).toUpperCase() === 'ACTIVE'
              ? acc + Number(v || 0)
              : acc;
          }, 0);
        const total = statsResult.total ?? mapped.length;
        setStats({
          total,
          active: activeFromStats || mapped.filter((i) => i.status === 'Active').length,
          inactive: statsResult.inactive ?? Math.max(0, total - (activeFromStats || 0)),
          bySeverity: statsResult.bySeverity || {},
        });
      } else {
        setStats({
          total: mapped.length,
          active: mapped.filter((i) => i.status === 'Active').length,
          inactive: mapped.filter((i) => i.status === 'Inactive').length,
          bySeverity: {},
        });
      }
      setApiOnline(true);
      setApiMessage('200 OK');
    } catch (err) {
      setApiOnline(false);
      setApiMessage(err.message || 'Sin conexión');
      triggerToast('Error de API', err.message || 'No se pudo cargar incidentes', false);
    } finally {
      setLoading(false);
    }
  }, [triggerToast]);

  useEffect(() => {
    loadData();
    const token = getAuthToken();
    if (token && !user) {
      getCurrentUser()
        .then((me) => {
          if (me?.authenticated || me?.username) {
            const u = {
              username: me.username,
              name: me.name,
              email: me.email,
              role: me.role,
            };
            setUser(u);
            localStorage.setItem('utp_auth_user', JSON.stringify(u));
          }
        })
        .catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (e) => {
      const { status, message } = e.detail || {};
      if (status === 'online') {
        setApiOnline(true);
        setApiMessage('200 OK');
      } else if (status === 'offline') {
        setApiOnline(false);
        setApiMessage(message || 'Offline');
      } else if (status === 'waking' || status === 'connecting') {
        setApiMessage(message || 'Conectando…');
      }
    };
    window.addEventListener('utp-api-status', handler);
    return () => window.removeEventListener('utp-api-status', handler);
  }, []);

  const highCount = useMemo(() => {
    const fromStats =
      (stats.bySeverity &&
        (stats.bySeverity.High || stats.bySeverity.HIGH || stats.bySeverity.Alta)) ||
      0;
    if (fromStats) return Number(fromStats);
    return incidents.filter((i) => i.priority === 'High').length;
  }, [stats, incidents]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return incidents.filter((item) => {
      const matchPrio = priorityFilter === 'ALL' || item.priority === priorityFilter;
      const matchCampus =
        campusFilter === 'ALL' ||
        (item.location || '').toLowerCase().includes(campusFilter.toLowerCase());
      const matchQ =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.ticketCode.toLowerCase().includes(q) ||
        (item.rejectionReason || '').toLowerCase().includes(q) ||
        (item.location || '').toLowerCase().includes(q);
      return matchPrio && matchCampus && matchQ;
    });
  }, [incidents, searchQuery, priorityFilter, campusFilter]);

  const activeList = filtered.filter((i) => i.status === 'Active');
  const inactiveList = filtered.filter((i) => i.status === 'Inactive');

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoginError('');
    setSaving(true);
    try {
      const data = await loginUser(loginForm.username, loginForm.password);
      const u = {
        username: data.username,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      setUser(u);
      localStorage.setItem('utp_auth_user', JSON.stringify(u));
      setShowLogin(false);
      triggerToast('Sesión iniciada', `Bienvenido ${u.name || u.username}`);
    } catch (err) {
      setLoginError(err.message || 'Credenciales incorrectas');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      /* ignore */
    }
    setUser(null);
    localStorage.removeItem('utp_auth_user');
    triggerToast('Sesión cerrada', 'Hasta pronto');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowCreate(false);
      setShowLogin(true);
      triggerToast('Autenticación requerida', 'Inicia sesión para registrar incidentes', false);
      return;
    }
    setSaving(true);
    try {
      await createIncident({
        title: newIncident.title,
        description: newIncident.description,
        priority: newIncident.priority,
        severity: newIncident.priority,
        status: newIncident.status,
        location: newIncident.location,
        category: newIncident.category || 'General',
      });
      setShowCreate(false);
      setNewIncident({
        title: '',
        description: '',
        priority: 'High',
        status: 'Active',
        location: 'Lima Centro - Torre Tecnológica',
        category: 'General',
      });
      triggerToast('Ticket Registrado', 'POST /api/incidents — 201 Created');
      await loadData();
    } catch (err) {
      triggerToast('Error al crear', err.message, false);
      if (err.status === 401) {
        setShowCreate(false);
        setShowLogin(true);
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePatchStatus = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      triggerToast('Permiso denegado', 'Solo ADMIN puede cambiar estado (PATCH)', false);
      if (!isAuthenticated) setShowLogin(true);
      return;
    }
    setSaving(true);
    try {
      await updateIncidentStatus(patchData.id, patchData.status, patchData.message || undefined);
      setShowStatus(false);
      triggerToast('Estado Actualizado', `PATCH /api/incidents/${patchData.id}/status → ${patchData.status}`);
      await loadData();
    } catch (err) {
      triggerToast('Error al actualizar', err.message, false);
      if (err.status === 401 || err.status === 403) setShowLogin(true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`¿Eliminar ${item.ticketCode}?\n\nDELETE /api/incidents/${item.id}`)) return;
    try {
      await deleteIncident(item.id);
      triggerToast('Incidente Eliminado', `DELETE /api/incidents/${item.id} (204)`, false);
      await loadData();
    } catch (err) {
      triggerToast('Error al eliminar', err.message, false);
    }
  };

  const openDetail = (item) => {
    setSelected(item);
    setShowDetail(true);
  };

  const openPatch = (item) => {
    setPatchData({
      id: item.id,
      status: item.status,
      message: item.rejectionReason || '',
      ticketCode: item.ticketCode,
    });
    setShowStatus(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPriorityFilter('ALL');
    setCampusFilter('ALL');
  };

  const hostLabel = (API_BASE_URL || '').replace(/^https?:\/\//, '');

  return (
    <div className="bg-slate-100 text-slate-800 antialiased min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200/80 shadow-sm backdrop-blur-md">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/50/Utplogonuevo.svg"
              alt="UTP"
              className="h-8 w-auto object-contain"
            />
            <div className="h-8 w-px bg-slate-200 hidden sm:block" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  Mesa de Incidentes UTP
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-primary tracking-wider">
                  Kanban
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium font-body hidden md:inline">
                Centro de Operaciones NOC &amp; Infraestructura de Red
              </span>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-body text-xs text-slate-600">
            <Icon name="domain" className="text-sm text-primary" />
            <span className="font-semibold text-slate-800">Campus:</span>
            <select
              className="bg-transparent border-0 py-0 pl-1 pr-6 text-xs text-slate-700 font-medium focus:ring-0 cursor-pointer"
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
            >
              <option value="ALL">Todos los Campus (Nacional)</option>
              <option value="Lima Centro">Lima Centro - Torre Tecnológica</option>
              <option value="San Juan">San Juan de Lurigancho</option>
              <option value="Lima Norte">Lima Norte</option>
              <option value="Arequipa">Arequipa Central</option>
              <option value="Chiclayo">Chiclayo</option>
            </select>
            <div className="w-px h-4 bg-slate-200" />
            <div
              className={`flex items-center gap-1.5 font-semibold ${
                apiOnline ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  apiOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              <span>
                api-incident • {apiMessage || (apiOnline ? '200 OK' : 'Offline')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowDocs(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <Icon name="api" className="text-base text-primary" />
              <span>Swagger Docs</span>
            </button>
            <button
              type="button"
              onClick={loadData}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Recargar"
            >
              <Icon name="refresh" className="text-xl" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5 pl-2 sm:border-l border-slate-200">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-2 ring-primary/20 font-bold text-sm">
                  {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user.name || user.username}
                  </span>
                  <span className="text-[11px] text-slate-500 font-body">{user.role}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-slate-500 hover:text-primary font-semibold ml-1"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-dark"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Toast */}
      <div
        className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-xl max-w-md transition-all duration-300 ${
          toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`p-2 rounded-lg flex items-center justify-center ${
            toast.isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-primary'
          }`}
        >
          <Icon name={toast.isSuccess ? 'check_circle' : 'error'} className="text-xl" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-900">{toast.title}</span>
          <span className="text-xs text-slate-600 font-body">{toast.message}</span>
        </div>
      </div>

      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar métricas */}
          <aside className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-5">
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  setShowLogin(true);
                  triggerToast('Autenticación requerida', 'Inicia sesión para registrar', false);
                  return;
                }
                setShowCreate(true);
              }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md hover:shadow-lg shadow-red-900/20 active:scale-[0.99] transition"
            >
              <Icon name="add_circle" className="text-xl" />
              <span>+ Registrar Incidente</span>
            </button>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Icon name="monitoring" className="text-lg text-primary" />
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Panel de Métricas UTP
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-400">
                  GET /api/incidents
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Total Incidentes
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-slate-900">{stats.total}</span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {loading ? '…' : '100% Sync'}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-200/60 flex items-center justify-center text-slate-700">
                  <Icon name="dataset" className="text-2xl" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                    <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
                      Activos / En Atención
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-black text-emerald-900">{stats.active}</span>
                  <span className="text-xs font-medium text-emerald-700 font-body">
                    Requieren acción técnica
                  </span>
                </div>
                <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.total ? Math.round((stats.active / stats.total) * 100) : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                    Inactivos / Resueltos
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                    Inactive
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-black text-slate-800">{stats.inactive}</span>
                  <span className="text-xs font-medium text-slate-500 font-body">Historial archivado</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-slate-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.total ? Math.round((stats.inactive / stats.total) * 100) : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/80 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-primary">
                    <Icon name="warning" className="text-sm" />
                    <span className="text-[11px] font-bold uppercase tracking-wide">Prioridad Alta</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-primary">{highCount}</span>
                    <span className="text-[11px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                      Críticos UTP
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-red-700/80 font-body mt-1">
                    SLA Campus &lt; 2h
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-primary">
                  <Icon name="priority_high" className="text-2xl" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 font-body flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-800 font-semibold">
                <span className="flex items-center gap-1.5 font-sans">
                  <Icon name="hub" className="text-sm text-primary" />
                  incident-controller
                </span>
                <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  Render Cloud
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Instancia sincronizada con{' '}
                <span className="font-mono text-slate-700">{hostLabel || 'api-incident.onrender.com'}</span>.
                Cada acción ejecuta mutaciones REST contra el backend.
              </p>
            </div>
          </aside>

          {/* Kanban */}
          <section className="flex-1 w-full flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Icon
                  name="search"
                  className="absolute left-3.5 top-2.5 text-slate-400 text-xl"
                />
                <input
                  className="w-full pl-11 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-body text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="Buscar por ticket (INC-1045), título, motivo de rechazo o sede..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                    onClick={() => setSearchQuery('')}
                  >
                    <Icon name="close" className="text-base" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500 shrink-0 hidden sm:inline">
                  Prioridad:
                </label>
                <select
                  className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="ALL">Todas las prioridades</option>
                  <option value="High">Alta (High)</option>
                  <option value="Medium">Media (Medium)</option>
                  <option value="Low">Baja (Low)</option>
                </select>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                  title="Restablecer filtros"
                >
                  <Icon name="restart_alt" className="text-lg" />
                </button>
              </div>
            </div>

            {loading && incidents.length === 0 ? (
              <div className="py-20 text-center text-sm text-slate-500 font-body">
                Cargando incidentes desde la API…
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 p-8">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-primary mb-3">
                  <Icon name="search_off" className="text-3xl" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Sin incidentes coincidentes</h3>
                <p className="text-xs text-slate-500 font-body max-w-sm mb-4">
                  No se hallaron registros con los filtros seleccionados.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Limpiar Búsqueda
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                {/* Activos */}
                <div className="flex flex-col gap-4 bg-slate-200/50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-300/60">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                        En Atención / Activos
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                        {activeList.length}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      status: &quot;Active&quot;
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 min-h-[200px]">
                    {activeList.length === 0 ? (
                      <div className="h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-xs font-body text-slate-400">
                        No hay tickets activos en este filtro
                      </div>
                    ) : (
                      activeList.map((item) => (
                        <IncidentCard
                          key={item.id}
                          item={item}
                          onDetail={openDetail}
                          onPatch={openPatch}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Inactivos */}
                <div className="flex flex-col gap-4 bg-slate-200/50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-300/60">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-slate-500 ring-4 ring-slate-200" />
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                        Cerrados / Inactivos
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-600 text-white">
                        {inactiveList.length}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      status: &quot;Inactive&quot;
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 min-h-[200px]">
                    {inactiveList.length === 0 ? (
                      <div className="h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-xs font-body text-slate-400">
                        No hay tickets inactivos en este filtro
                      </div>
                    ) : (
                      inactiveList.map((item) => (
                        <IncidentCard
                          key={item.id}
                          item={item}
                          onDetail={openDetail}
                          onPatch={openPatch}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-body">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/50/Utplogonuevo.svg"
              alt="UTP"
              className="h-6 w-auto"
            />
            <span>© 2026 Universidad Tecnológica del Perú • Tablero Operativo Kanban</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Mesa de Ayuda TI</span>
            <span>•</span>
            <span>Soporte NOC Redes</span>
            <span>•</span>
            <span className={`font-mono font-semibold ${apiOnline ? 'text-emerald-600' : 'text-error'}`}>
              {apiOnline ? `En línea: ${hostLabel}` : 'Desconectado'}
            </span>
          </div>
        </div>
      </footer>

      {/* Modal Login */}
      {showLogin && (
        <Modal onClose={() => setShowLogin(false)} maxWidth="max-w-md">
          <ModalHeader
            icon="login"
            iconBg="bg-primary/10 text-primary"
            title="Iniciar sesión"
            subtitle="POST /api/auth/login"
            onClose={() => setShowLogin(false)}
          />
          <form onSubmit={handleLogin} className="py-4 space-y-4">
            {loginError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {loginError}
              </p>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Usuario o correo</label>
              <input
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={loginForm.username}
                onChange={(e) => setLoginForm((f) => ({ ...f, username: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 font-body">
              Demo: admin / admin123 · supervisor / utp2025 · operador / operador123
            </p>
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold disabled:opacity-60"
              >
                {saving ? 'Entrando…' : 'Entrar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Create */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} maxWidth="max-w-xl">
          <ModalHeader
            icon="add_alert"
            iconBg="bg-red-100 text-primary"
            title="Registrar Incidente TI"
            subtitle="POST /api/incidents • Mesa Operativa UTP"
            onClose={() => setShowCreate(false)}
          />
          <form onSubmit={handleCreate} className="py-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Título del Incidente <span className="text-primary">*</span>
              </label>
              <input
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={newIncident.title}
                onChange={(e) => setNewIncident((n) => ({ ...n, title: e.target.value }))}
                required
                placeholder="ej. Falla de Switch PoE en Pabellón B"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Descripción Técnica <span className="text-primary">*</span>
              </label>
              <textarea
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                rows={3}
                value={newIncident.description}
                onChange={(e) => setNewIncident((n) => ({ ...n, description: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Prioridad</label>
                <select
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs cursor-pointer"
                  value={newIncident.priority}
                  onChange={(e) => setNewIncident((n) => ({ ...n, priority: e.target.value }))}
                >
                  <option value="High">High (Crítico)</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Estado de ingreso</label>
                <select
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs cursor-pointer"
                  value={newIncident.status}
                  onChange={(e) => setNewIncident((n) => ({ ...n, status: e.target.value }))}
                >
                  <option value="Active">Active (En Atención)</option>
                  <option value="Inactive">Inactive (Resuelto)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Sede / Ubicación UTP</label>
              <input
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                value={newIncident.location}
                onChange={(e) => setNewIncident((n) => ({ ...n, location: e.target.value }))}
              />
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-600">
              <span>Schema: Incident {'{ title, description, priority, status }'}</span>
              <span className="text-primary font-bold">POST 201</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold disabled:opacity-60"
              >
                {saving ? 'Enviando…' : 'Enviar POST Ticket'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Status */}
      {showStatus && (
        <Modal onClose={() => setShowStatus(false)} maxWidth="max-w-lg">
          <ModalHeader
            icon="published_with_changes"
            iconBg="bg-amber-100 text-amber-700"
            title="Actualizar Estado"
            subtitle={`PATCH /api/incidents/${patchData.id}/status • ${patchData.ticketCode}`}
            onClose={() => setShowStatus(false)}
          />
          <form onSubmit={handlePatchStatus} className="py-4 space-y-4">
            {!isAdmin && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                Solo un usuario <strong>ADMIN</strong> puede ejecutar este PATCH. Inicia sesión como admin.
              </p>
            )}
            <div>
              <span className="block text-xs font-bold text-slate-800 mb-2">Nuevo estado:</span>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50 transition">
                  <input
                    type="radio"
                    name="targetStatus"
                    value="Active"
                    checked={patchData.status === 'Active'}
                    onChange={() => setPatchData((p) => ({ ...p, status: 'Active' }))}
                    className="accent-emerald-600"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-emerald-900">Active</span>
                    <span className="text-[11px] text-emerald-700 font-body">En Atención</span>
                  </div>
                </label>
                <label className="cursor-pointer flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 has-[:checked]:border-slate-500 has-[:checked]:bg-slate-100 transition">
                  <input
                    type="radio"
                    name="targetStatus"
                    value="Inactive"
                    checked={patchData.status === 'Inactive'}
                    onChange={() => setPatchData((p) => ({ ...p, status: 'Inactive' }))}
                    className="accent-slate-700"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Inactive</span>
                    <span className="text-[11px] text-slate-600 font-body">Cerrado / Resuelto</span>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Notas de resolución / rechazo
              </label>
              <textarea
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                rows={3}
                value={patchData.message}
                onChange={(e) => setPatchData((p) => ({ ...p, message: e.target.value }))}
                placeholder="ej. Resuelto tras cambio de switch"
              />
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowStatus(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold disabled:opacity-60"
              >
                {saving ? 'Ejecutando…' : 'Ejecutar PATCH'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Detail */}
      {showDetail && selected && (
        <Modal onClose={() => setShowDetail(false)} maxWidth="max-w-xl">
          <ModalHeader
            icon="quick_reference"
            iconBg="bg-sky-100 text-sky-800"
            title={`${selected.ticketCode} (ID: ${selected.id})`}
            subtitle="GET /api/incidents/{id} • 200 OK"
            onClose={() => setShowDetail(false)}
          />
          <div className="py-4 space-y-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Título</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">{selected.title}</h3>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Descripción Técnica
              </span>
              <p className="text-xs text-slate-700 font-body mt-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 leading-relaxed">
                {selected.description || '—'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Estado Actual
                </span>
                <div className="mt-1">
                  {selected.status === 'Active' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      ● En Atención (Active)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                      ○ Resuelto (Inactive)
                    </span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Prioridad SLA
                </span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      selected.priority === 'High'
                        ? 'bg-primary text-white'
                        : selected.priority === 'Medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-sky-600 text-white'
                    }`}
                  >
                    {selected.priority}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Razones del Rechazo / Solución
              </span>
              <p className="text-xs text-slate-700 font-body mt-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 leading-relaxed">
                {selected.rejectionReason || 'Sin observaciones ni notas de resolución.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1 text-xs font-body text-slate-600">
              <span className="font-mono text-[11px]">Created: {selected.createdAt || '—'}</span>
              <span className="font-medium text-slate-700">Ubicación: {selected.location}</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => setShowDetail(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cerrar Detalle
            </button>
          </div>
        </Modal>
      )}

      {/* Modal Docs */}
      {showDocs && (
        <Modal onClose={() => setShowDocs(false)} maxWidth="max-w-2xl">
          <ModalHeader
            icon="api"
            iconBg="bg-red-100 text-primary"
            title="OpenAPI 3.0 • incident-controller"
            subtitle={`Host: ${API_BASE_URL || 'https://api-incident.onrender.com'}`}
            onClose={() => setShowDocs(false)}
          />
          <div className="flex-1 overflow-y-auto py-4 space-y-3 font-body text-xs max-h-[60vh]">
            {[
              ['GET', 'sky', '/api/incidents', '200 OK Array<Incident>'],
              ['POST', 'emerald', '/api/incidents', '201 Created'],
              ['PATCH', 'amber', '/api/incidents/{id}/status', '200 OK'],
              ['PATCH', 'amber', '/api/incidents/{id}/priority', '200 OK'],
              ['GET', 'sky', '/api/incidents/{id}', '200 OK Single'],
              ['DELETE', 'red', '/api/incidents/{id}', '204 No Content'],
              ['GET', 'sky', '/api/incidents/stats', '200 OK'],
              ['POST', 'emerald', '/api/auth/login', '200 Token'],
            ].map(([method, color, path, res]) => (
              <div
                key={path + method}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-bold text-white bg-${color}-600 text-[10px]`}
                    style={{
                      backgroundColor:
                        color === 'sky'
                          ? '#0284c7'
                          : color === 'emerald'
                            ? '#059669'
                            : color === 'amber'
                              ? '#d97706'
                              : '#dc2626',
                    }}
                  >
                    {method}
                  </span>
                  <code className="font-mono text-slate-800">{path}</code>
                </div>
                <span className="text-emerald-700 font-bold">{res}</span>
              </div>
            ))}
            <a
              href={`${API_BASE_URL || 'https://api-incident.onrender.com'}/`}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-primary font-semibold hover:underline pt-2"
            >
              Abrir Swagger UI en el servidor →
            </a>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => setShowDocs(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cerrar Docs
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function IncidentCard({ item, onDetail, onPatch, onDelete }) {
  const isHigh = item.priority === 'High';
  const isMedium = item.priority === 'Medium';
  const accent = isHigh ? 'border-l-[#C8102E]' : isMedium ? 'border-l-amber-500' : 'border-l-sky-500';
  const priorityPill = isHigh ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-primary text-white tracking-wide">
      HIGH
    </span>
  ) : isMedium ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-white tracking-wide">
      MEDIUM
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-600 text-white tracking-wide">
      LOW
    </span>
  );

  return (
    <div
      className={`relative bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition p-4 flex flex-col justify-between border-l-4 ${accent}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-mono font-bold text-primary">{item.ticketCode}</span>
            <h4
              onClick={() => onDetail(item)}
              className="text-sm font-bold text-slate-900 hover:text-primary cursor-pointer transition leading-snug"
            >
              {item.title}
            </h4>
          </div>
          <div className="shrink-0">{priorityPill}</div>
        </div>
        <p className="text-xs text-slate-600 font-body leading-relaxed line-clamp-2 mt-1">
          {item.description}
        </p>
        {item.rejectionReason ? (
          <div className="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-body flex items-start gap-1.5">
            <span className="font-bold text-slate-600 shrink-0 text-[11px]">Resolución/Rechazo:</span>
            <span className="text-slate-800 break-words text-[11px]">{item.rejectionReason}</span>
          </div>
        ) : null}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-body text-slate-500">
          <div
            className="flex items-center gap-1 text-slate-600 font-medium truncate max-w-[170px]"
            title={item.location}
          >
            <Icon name="pin_drop" className="text-xs text-slate-400" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
            <Icon name="schedule" className="text-[10px]" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
        <button
          type="button"
          onClick={() => onDetail(item)}
          className="flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1 transition"
        >
          <Icon name="visibility" className="text-sm text-sky-700" />
          <span>Detalle</span>
        </button>
        <button
          type="button"
          onClick={() => onPatch(item)}
          className="flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center justify-center gap-1 transition"
        >
          <Icon name="edit" className="text-sm" />
          <span>Editar Estado</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-primary hover:bg-red-50 flex items-center justify-center gap-1 transition"
        >
          <Icon name="delete" className="text-sm" />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
}

function Modal({ children, onClose, maxWidth = 'max-w-xl' }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 flex flex-col overflow-hidden`}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ icon, iconBg, title, subtitle, onClose }) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <Icon name={icon} className="text-2xl" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500 font-mono">{subtitle}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
      >
        <Icon name="close" className="text-xl" />
      </button>
    </div>
  );
}
