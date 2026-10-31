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
  API_BASE_URL
} from './services/api';

const ACTIVE_STATUSES = ['ACTIVE', 'OPEN', 'IN_PROGRESS', 'EN_PROGRESO'];

function normalizeStatus(status) {
  return ACTIVE_STATUSES.includes(String(status || '').toUpperCase()) ? 'Active' : 'Inactive';
}

function normalizePriority(priority) {
  const value = String(priority || 'Low').toUpperCase();
  if (value === 'CRITICAL' || value === 'CRITICA' || value === 'CRÍTICA' || value === 'HIGH') return 'High';
  if (value === 'MEDIA' || value === 'MEDIUM') return 'Medium';
  if (value === 'BAJA' || value === 'LOW') return 'Low';
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' o 'cards'

  // Estados de Autenticación y Usuario
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'admin123' });
  const [loginError, setLoginError] = useState('');

  // Modales de Operación
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [patchData, setPatchData] = useState({ status: 'Active', message: '' });

  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    priority: 'High',
    status: 'Active',
    location: 'Lima Centro - Torre Tecnológica',
    category: 'Redes'
  });

  const [toast, setToast] = useState({ visible: false, title: '', message: '', isSuccess: true });

  const triggerToast = useCallback((title, message, isSuccess = true) => {
    setToast({ visible: true, title, message, isSuccess });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  }, []);

  // Verificar sesión actual al cargar
  useEffect(() => {
    async function checkAuth() {
      const token = getAuthToken();
      if (token) {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch {
          logoutUser();
          setCurrentUser(null);
        }
      }
    }
    checkAuth();
  }, []);

  // Cargar incidentes desde el Backend
  const fetchIncidentsFromBackend = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getIncidents();
      if (data && Array.isArray(data)) {
        const formatted = data.map(item => ({
          id: item.id,
          ticketCode: item.ticketCode || `INC-${1000 + item.id}`,
          title: item.title,
          description: item.description,
          rejectionReason: item.message || item.rejectionReason || '',
          status: normalizeStatus(item.status),
          priority: normalizePriority(item.priority || item.severity),
          createdAt: item.createdAt || new Date().toISOString(),
          location: item.location || 'Campus UTP',
          category: item.category || 'General'
        }));
        setIncidents(formatted);
      }
    } catch (e) {
      console.error('Error al conectar con el backend:', e);
      triggerToast('Aviso de Conexión', 'Usando almacenamiento local o reintentando conexión con api-incident.', false);
    } finally {
      setLoading(false);
    }
  }, [triggerToast]);

  useEffect(() => {
    fetchIncidentsFromBackend();
  }, [fetchIncidentsFromBackend]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(item => {
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery = !q || 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) || 
        item.ticketCode.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.rejectionReason && item.rejectionReason.toLowerCase().includes(q));
      return matchStatus && matchPriority && matchQuery;
    });
  }, [incidents, statusFilter, priorityFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = incidents.length;
    const active = incidents.filter(i => i.status === 'Active').length;
    const inactive = incidents.filter(i => i.status === 'Inactive').length;
    const high = incidents.filter(i => i.priority === 'High').length;
    return { total, active, inactive, high };
  }, [incidents]);

  // Manejo de Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await loginUser(loginForm.username, loginForm.password);
      setCurrentUser(res.user || { username: loginForm.username, role: 'ADMIN' });
      setShowLoginModal(false);
      triggerToast('Sesión Iniciada', `Bienvenido al sistema NOC, ${loginForm.username}.`);
    } catch (err) {
      setLoginError(err.message || 'Credenciales inválidas. Verifica usuario y contraseña.');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    triggerToast('Sesión Cerrada', 'Has salido del sistema de administración.');
  };

  // Crear Incidente (Requiere Token)
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    try {
      await createIncident({
        title: newIncident.title,
        description: newIncident.description,
        priority: newIncident.priority.toUpperCase(),
        status: newIncident.status.toUpperCase(),
        location: newIncident.location,
        category: newIncident.category
      });
      setShowCreateModal(false);
      setNewIncident({ title: '', description: '', priority: 'High', status: 'Active', location: 'Lima Centro - Torre Tecnológica', category: 'Redes' });
      triggerToast('POST /api/incidents Exitoso', 'Ticket creado y guardado en el backend.');
      fetchIncidentsFromBackend();
    } catch (e) {
      triggerToast('Error de Autorización', e.message || 'Inicia sesión con permisos de administrador o operador.', false);
    }
  };

  // Actualizar Estado / Notas (PATCH)
  const handlePatchSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setShowStatusModal(false);
      setShowLoginModal(true);
      return;
    }
    try {
      await updateIncidentStatus(selectedIncident.id, patchData.status.toUpperCase(), patchData.message);
      setShowStatusModal(false);
      triggerToast('PATCH Exitoso', `Estado del ticket #${selectedIncident.ticketCode} actualizado.`);
      fetchIncidentsFromBackend();
    } catch (e) {
      triggerToast('Error', e.message || 'No se pudo actualizar el estado.', false);
    }
  };

  // Eliminar Incidente (DELETE)
  const handleDelete = async (id, code) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    if (confirm(`¿Desea eliminar permanentemente el incidente #${code} del servidor?`)) {
      try {
        await deleteIncident(id);
        triggerToast('Incidente Eliminado', `DELETE /api/incidents/${id} ejecutado con éxito.`, false);
        fetchIncidentsFromBackend();
      } catch (e) {
        triggerToast('Error', e.message || 'No tienes permisos suficientes o falló la conexión.', false);
      }
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col text-slate-800 font-sans antialiased">
      {/* Header Institucional UTP */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 text-base">Mesa de Incidentes UTP</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-100 text-red-700">34998</span>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <span className="text-xs text-slate-500 hidden sm:inline">NOC Campus TI • {API_BASE_URL}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowDocsModal(true)} className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200">
              Schemas & Docs
            </button>
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900">{currentUser.name || currentUser.username}</span>
                  <span className="text-[10px] text-emerald-600 font-mono font-semibold">Online ({currentUser.role || 'ADMIN'})</span>
                </div>
                <button onClick={handleLogout} className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition">
                  Salir
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="px-4 py-1.5 rounded-lg bg-[#C8102E] hover:bg-[#a60b24] text-white text-xs font-bold shadow transition">
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-5 flex-1">
        
        {/* KPI Bento Grid */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4">
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
              <span className="text-[11px] font-semibold uppercase text-slate-500">Total Incidentes</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
            </div>
            <div className="bg-emerald-50/50 rounded-lg p-3.5 border border-emerald-100">
              <span className="text-[11px] font-semibold uppercase text-emerald-800">Activos / En Atención</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{stats.active}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
              <span className="text-[11px] font-semibold uppercase text-slate-500">Inactivos / Resueltos</span>
              <div className="text-2xl font-bold text-slate-700 mt-1">{stats.inactive}</div>
            </div>
            <div className="bg-red-50/60 rounded-lg p-3.5 border border-red-100">
              <span className="text-[11px] font-semibold uppercase text-red-800">Prioridad Alta (High)</span>
              <div className="text-2xl font-bold text-[#C8102E] mt-1">{stats.high}</div>
            </div>
            <div className="col-span-2 md:col-span-1 bg-slate-50 rounded-lg p-3.5 border border-slate-200">
              <span className="text-[11px] font-semibold uppercase text-slate-500">Estado del Sistema</span>
              <div className="text-sm font-bold text-emerald-600 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Servidor Online
              </div>
            </div>
          </div>
        </section>

        {/* Workspace Controls & Table/Cards Section */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 lg:p-5 border-b border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input 
                type="text" 
                placeholder="Filtrar por ticket, sede, motivo o aula..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:max-w-md px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
              />
              <div className="inline-flex rounded-lg bg-slate-200/70 p-1">
                <button onClick={() => setStatusFilter('ALL')} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>Todos</button>
                <button onClick={() => setStatusFilter('Active')} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${statusFilter === 'Active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>Activos</button>
                <button onClick={() => setStatusFilter('Inactive')} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${statusFilter === 'Inactive' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>Inactivos</button>
              </div>
              <select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white border border-slate-200 text-xs font-medium text-slate-700 px-3 py-2 rounded-lg cursor-pointer"
              >
                <option value="ALL">Todas las prioridades</option>
                <option value="High">Prioridad Alta (High)</option>
                <option value="Medium">Prioridad Media (Medium)</option>
                <option value="Low">Prioridad Baja (Low)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <div className="inline-flex rounded-lg bg-slate-200/70 p-1">
                <button onClick={() => setViewMode('cards')} className={`p-1.5 rounded-md text-xs ${viewMode === 'cards' ? 'bg-white text-red-700 font-semibold shadow-xs' : 'text-slate-600'}`} title="Vista Tarjetas">🗂️</button>
                <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md text-xs ${viewMode === 'table' ? 'bg-white text-red-700 font-semibold shadow-xs' : 'text-slate-600'}`} title="Vista Tabla">📋</button>
              </div>
              <button 
                onClick={() => {
                  if (!currentUser) { setShowLoginModal(true); } 
                  else { setShowCreateModal(true); }
                }} 
                className="px-4 py-2 rounded-lg bg-[#C8102E] hover:bg-[#a60b24] text-white text-xs font-bold shadow transition flex items-center gap-2"
              >
                <span>+ Nuevo Incidente</span>
              </button>
            </div>
          </div>

          {/* Vista Tabla Operacional */}
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-[11px] font-mono uppercase tracking-wider text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Incidente / Descripción</th>
                    <th className="py-3 px-4">Campus & Aula</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-center">Prioridad</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Comandos Operativos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {loading ? (
                    <tr><td colSpan="7" className="py-12 text-center text-slate-500 text-xs">Cargando registros desde el servidor...</td></tr>
                  ) : filteredIncidents.length === 0 ? (
                    <tr><td colSpan="7" className="py-12 text-center text-slate-500 text-xs">No se encontraron incidentes registrados.</td></tr>
                  ) : (
                    filteredIncidents.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs font-bold text-red-700">{item.ticketCode}</td>
                        <td className="py-3 px-4 max-w-sm">
                          <div className="font-semibold text-slate-900 text-xs sm:text-sm">{item.title}</div>
                          <div className="text-xs text-slate-500 truncate">{item.description}</div>
                          {item.rejectionReason && (
                            <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                              Obs/Rechazo: {item.rejectionReason}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-700">{item.location}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono ${item.priority === 'High' ? 'bg-[#C8102E] text-white' : 'bg-amber-500 text-white'}`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] font-mono text-slate-600">
                          {item.createdAt ? item.createdAt.split('T')[0] : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex gap-1">
                            <button onClick={() => { setSelectedIncident(item); setShowDetailModal(true); }} className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-100 font-medium">Detalle</button>
                            <button onClick={() => { 
                              if (!currentUser) { setShowLoginModal(true); } 
                              else { setSelectedIncident(item); setPatchData({ status: item.status, message: item.rejectionReason || '' }); setShowStatusModal(true); } 
                            }} className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-amber-50 hover:text-amber-700 font-medium">Estado</button>
                            <button onClick={() => handleDelete(item.id, item.ticketCode)} className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-red-600 hover:bg-red-50 font-medium">Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Vista Tarjetas Grid */
            <div className="p-4 lg:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredIncidents.map((item) => (
                <div key={item.id} className="rounded-xl bg-white p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs font-bold text-red-700">{item.ticketCode}</span>
                      <div className="flex gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{item.status}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.priority === 'High' ? 'bg-[#C8102E] text-white' : 'bg-amber-500 text-white'}`}>{item.priority}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-600 mb-2">{item.description}</p>
                    {item.rejectionReason && (
                      <div className="mb-2 p-2 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900">
                        <b>Obs:</b> {item.rejectionReason}
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">{item.location}</span>
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedIncident(item); setShowDetailModal(true); }} className="px-2 py-1 border rounded hover:bg-slate-100">Ver</button>
                      <button onClick={() => { 
                        if (!currentUser) { setShowLoginModal(true); } 
                        else { setSelectedIncident(item); setPatchData({ status: item.status, message: item.rejectionReason || '' }); setShowStatusModal(true); } 
                      }} className="px-2 py-1 border rounded hover:bg-amber-50">Estado</button>
                      <button onClick={() => handleDelete(item.id, item.ticketCode)} className="px-2 py-1 border rounded text-red-600 hover:bg-red-50">Borrar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
            <span className="font-mono">Mostrando {filteredIncidents.length} de {incidents.length} incidentes</span>
            <span className="font-mono text-[11px]">Consola NOC UTP • {currentUser ? `Sesión activa: ${currentUser.username}` : 'Modo lectura (Inicia sesión para editar)'}</span>
          </div>
        </section>
      </main>

      {/* Modal de Inicio de Sesión (Login) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <h2 className="font-bold text-slate-900 text-base">Iniciar Sesión • NOC UTP</h2>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {loginError && <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 font-semibold">{loginError}</div>}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Usuario / Username</label>
                <input 
                  type="text" 
                  required 
                  value={loginForm.username}
                  onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
                  placeholder="ej. admin"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contraseña / Password</label>
                <input 
                  type="password" 
                  required 
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
                  placeholder="ej. admin123"
                />
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border text-[11px] text-slate-500 font-mono">
                Credenciales por defecto del backend: <b>admin</b> / <b>admin123</b>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button type="button" onClick={() => setShowLoginModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 font-semibold">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-[#C8102E] text-white font-bold">Autenticar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Crear Incidente */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-4">Registrar Incidente TI (POST /api/incidents)</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título del Incidente *</label>
                <input 
                  type="text" 
                  required 
                  value={newIncident.title}
                  onChange={e => setNewIncident({...newIncident, title: e.target.value})}
                  placeholder="ej. Falla en proyector Aula Magna..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción Técnica *</label>
                <textarea 
                  rows="3" 
                  required 
                  value={newIncident.description}
                  onChange={e => setNewIncident({...newIncident, description: e.target.value})}
                  placeholder="Detalles del fallo..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prioridad</label>
                  <select 
                    value={newIncident.priority}
                    onChange={e => setNewIncident({...newIncident, priority: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estado</label>
                  <select 
                    value={newIncident.status}
                    onChange={e => setNewIncident({...newIncident, status: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ubicación / Sede UTP</label>
                <input 
                  type="text" 
                  value={newIncident.location}
                  onChange={e => setNewIncident({...newIncident, location: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 font-semibold">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-[#C8102E] text-white font-bold">Enviar POST Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Actualizar Estado (PATCH) */}
      {showStatusModal && selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Actualizar Estado • {selectedIncident.ticketCode}</h2>
            <p className="text-xs text-slate-500 font-mono mb-4">PATCH /api/incidents/{selectedIncident.id}/status</p>
            <form onSubmit={handlePatchSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Nuevo Estado</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input type="radio" name="st" value="Active" checked={patchData.status === 'Active'} onChange={e => setPatchData({...patchData, status: e.target.value})} />
                    <div>
                      <span className="font-bold block">Active</span>
                      <span className="text-[10px] text-slate-500">En curso</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input type="radio" name="st" value="Inactive" checked={patchData.status === 'Inactive'} onChange={e => setPatchData({...patchData, status: e.target.value})} />
                    <div>
                      <span className="font-bold block">Inactive</span>
                      <span className="text-[10px] text-slate-500">Resuelto / Cerrado</span>
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Razones de resolución u observaciones</label>
                <textarea 
                  rows="3" 
                  value={patchData.message}
                  onChange={e => setPatchData({...patchData, message: e.target.value})}
                  placeholder="ej. Switch PoE reiniciado con éxito..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button type="button" onClick={() => setShowStatusModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 font-semibold">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold">Ejecutar PATCH</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {showDetailModal && selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-base font-bold text-slate-900">{selectedIncident.ticketCode} (ID: {selectedIncident.id})</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-500 font-bold">Cerrar</button>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px]">Título</span>
              <p className="text-sm font-semibold text-slate-900">{selectedIncident.title}</p>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px]">Descripción Técnica</span>
              <p className="p-3 bg-slate-50 rounded-lg border mt-1 text-slate-700">{selectedIncident.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px]">Estado</span>
                <p className="font-bold text-emerald-700">{selectedIncident.status}</p>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px]">Prioridad</span>
                <p className="font-bold text-red-600">{selectedIncident.priority}</p>
              </div>
            </div>
            {selectedIncident.rejectionReason && (
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px]">Notas de Resolución / Observaciones</span>
                <p className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 mt-1">{selectedIncident.rejectionReason}</p>
              </div>
            )}
            <div className="p-3 bg-slate-50 rounded border font-mono text-[11px] text-slate-500">
              Ubicación: {selectedIncident.location} <br />
              Creado: {selectedIncident.createdAt}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Documentación OpenAPI */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl bg-white p-6 shadow-2xl flex flex-col border border-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-900 text-base">Endpoints UTP incident-controller • OpenAPI 3.0</h2>
              <button onClick={() => setShowDocsModal(false)} className="text-slate-500 font-bold">Cerrar</button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-3 text-xs">
              <div className="p-3 rounded bg-slate-50 border">
                <span className="px-2 py-0.5 rounded bg-sky-600 text-white font-mono font-bold mr-2">GET</span>
                <code>/api/incidents</code> — Obtiene listado completo de incidentes.
              </div>
              <div className="p-3 rounded bg-slate-50 border">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold mr-2">POST</span>
                <code>/api/incidents</code> — Crea un nuevo ticket (Requiere Autenticación).
              </div>
              <div className="p-3 rounded bg-slate-50 border">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-mono font-bold mr-2">PATCH</span>
                <code>/api/incidents/{id}/status</code> — Actualiza el estado y notas.
              </div>
              <div className="p-3 rounded bg-slate-50 border">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold mr-2">DELETE</span>
                <code>/api/incidents/{id}</code> — Elimina el registro del servidor.
              </div>
            </div>
            <div className="pt-3 border-t flex justify-end">
              <button onClick={() => setShowDocsModal(false)} className="px-4 py-2 rounded bg-slate-100 font-semibold text-xs">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-white shadow-xl border border-slate-200 flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-bold text-xs text-slate-900">{toast.title}</span>
            <span className="text-xs text-slate-600">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
