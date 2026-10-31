import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BreadcrumbTelemetry from './components/BreadcrumbTelemetry';
import KpiMetrics from './components/KpiMetrics';
import ToolbarFilters from './components/ToolbarFilters';
import IncidentTable from './components/IncidentTable';
import IncidentCards from './components/IncidentCards';
import EmptyState from './components/EmptyState';
import TableFooter from './components/TableFooter';
import Footer from './components/Footer';
import UserManagementView from './components/UserManagementView';
import TelemetryMetricsView from './components/TelemetryMetricsView';
import CreateModal from './components/CreateModal';
import StatusModal from './components/StatusModal';
import DetailModal from './components/DetailModal';
import ApiDocsModal from './components/ApiDocsModal';
import HostSettingsModal from './components/HostSettingsModal';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast';

import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncidentStatus,
  deleteIncident,
  loginUser,
  logoutUser,
  getCurrentUser,
  getAuthToken,
  API_BASE_URL,
  setApiBaseUrl,
  DEFAULT_RENDER_URL
} from './services/api';

const INITIAL_INCIDENTS = [
  {
    id: 1,
    ticketCode: "INC-1045",
    title: "Ejemplo de título",
    description: "Descripción del ítem - Falla en proyector Epson Aula Magna Pabellón B",
    rejectionReason: "pepitoooo",
    status: "Inactive",
    priority: "High",
    createdAt: "2025-10-31T14:24:58.847",
    location: "Lima Centro - Aula Magna"
  },
  {
    id: 2,
    ticketCode: "INC-1044",
    title: "Ejemplo de título 2",
    description: "Descripción del ítem - Caída enlace Wi-Fi Eduroam en Laboratorio de Cómputo 3",
    rejectionReason: "",
    status: "Active",
    priority: "High",
    createdAt: "2025-10-31T14:25:04.414",
    location: "San Juan de Lurigancho - Pabellón A"
  },
  {
    id: 3,
    ticketCode: "INC-1043",
    title: "Ejemplo de título 3",
    description: "Descripción del ítem - Reinicio no programado Servidor Canvas / Portal del Estudiante",
    rejectionReason: "",
    status: "Active",
    priority: "High",
    createdAt: "2025-10-31T14:25:09.954",
    location: "Data Center Campus Central"
  },
  {
    id: 4,
    ticketCode: "INC-1042",
    title: "Ejemplo de título 4",
    description: "Descripción del ítem - Cable de red UTP desprendido en Rack de Telecomunicaciones",
    rejectionReason: "",
    status: "Active",
    priority: "High",
    createdAt: "2025-10-31T14:25:15.170",
    location: "Lima Norte - Piso 3"
  },
  {
    id: 5,
    ticketCode: "INC-1041",
    title: "un ejemplolo mas",
    description: "dfdfdfdf - Error de autenticación LDAP en terminales de biblioteca",
    rejectionReason: "probando",
    status: "Active",
    priority: "High",
    createdAt: "2025-11-01T17:44:55.406",
    location: "Arequipa - Biblioteca Central"
  },
  {
    id: 6,
    ticketCode: "INC-1040",
    title: "Cámara de vigilancia sin señal",
    description: "Cámara IP de entrada principal no emite flujo RTSP al grabador NVR.",
    rejectionReason: "Conector RJ45 reemplazado con éxito.",
    status: "Inactive",
    priority: "Medium",
    createdAt: "2025-11-01T18:10:12.102",
    location: "Chiclayo - Acceso Vehicular"
  }
];

function normalizeStatus(status) {
  const s = String(status || '').toUpperCase();
  if (['INACTIVE', 'CLOSED', 'RESOLVED', 'RECHAZADO'].includes(s)) return 'Inactive';
  return 'Active';
}

function normalizePriority(prio) {
  const p = String(prio || 'Low').toUpperCase();
  if (p.includes('HIGH') || p.includes('ALTA') || p.includes('CRITIC')) return 'High';
  if (p.includes('MED')) return 'Medium';
  return 'Low';
}

export default function App() {
  // Navegación Sidebar
  const [navView, setNavView] = useState('incidents'); // 'incidents' | 'metrics' | 'users'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Store principal de incidentes
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [isOnline, setIsOnline] = useState(true);
  const [apiStatus, setApiStatus] = useState('online');
  const [currentHost, setCurrentHost] = useState(API_BASE_URL || DEFAULT_RENDER_URL);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtros & Visualización
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'Active' | 'Inactive'
  const [priorityFilter, setPriorityFilter] = useState('ALL'); // 'ALL' | 'High' | 'Medium' | 'Low'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Modales
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHostOpen, setIsHostOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginInitialMessage, setLoginInitialMessage] = useState('');

  // Selección activa para modales
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Usuario & Sesión (Si no hay sesión almacenada, arranca en null para poder elegir o cerrar sesión realmente)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('utp_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Toast
  const [toast, setToast] = useState({
    visible: false,
    title: '',
    message: '',
    isSuccess: true
  });

  const showToast = useCallback((title, message, isSuccess = true) => {
    setToast({ visible: true, title, message, isSuccess });
    const timer = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Carga de incidentes desde el backend
  const loadData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const liveData = await getIncidents();
      if (Array.isArray(liveData) && liveData.length > 0) {
        const mapped = liveData.map((item, idx) => ({
          id: item.id || idx + 1,
          ticketCode: item.ticketCode || `INC-${1045 - idx}`,
          title: item.title || 'Incidente TI',
          description: item.description || '',
          rejectionReason: item.message || item.rejectionReason || '',
          status: normalizeStatus(item.status),
          priority: normalizePriority(item.priority || item.severity),
          createdAt: item.createdAt || new Date().toISOString(),
          location: item.location || 'Campus UTP Central',
          category: item.category || 'General'
        }));
        setIncidents(mapped);
        setIsOnline(true);
        setApiStatus('online');
        if (isManual) {
          showToast("GET /api/incidents sincronizado", `${mapped.length} registros validados contra ${currentHost.replace(/^https?:\/\//, '')}`);
        }
      }
    } catch {
      setIsOnline(false);
      setApiStatus('offline');
      if (isManual) {
        showToast("Conexión en espera", "El backend está despertando. Mostrando registros locales.", false);
      }
    } finally {
      if (isManual) setIsRefreshing(false);
    }
  }, [currentHost, showToast]);

  // Validación de token al cargar (SIN auto-login forzado)
  useEffect(() => {
    const checkCurrentSession = async () => {
      const token = getAuthToken();
      if (!token) {
        // No hay sesión activa; no hacemos login automático para permitir elegir o cerrar sesión
        setUser(null);
        localStorage.removeItem('utp_auth_user');
        return;
      }

      try {
        const me = await getCurrentUser();
        if (me && me.authenticated !== false) {
          const userData = {
            username: me.username,
            name: me.name || me.username,
            role: me.role || 'OPERATOR'
          };
          setUser(userData);
          localStorage.setItem('utp_auth_user', JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem('utp_auth_user');
        }
      } catch {
        // Token inválido o expirado
        setUser(null);
        localStorage.removeItem('utp_auth_user');
      }
    };

    checkCurrentSession();
    loadData();
  }, [loadData]);

  // Escuchar eventos de estado del cliente HTTP
  useEffect(() => {
    const handleStatus = (e) => {
      const detail = e.detail || {};
      setApiStatus(detail.status || 'online');
      if (detail.status === 'online') setIsOnline(true);
      if (detail.status === 'offline') setIsOnline(false);
    };

    window.addEventListener('utp-api-status', handleStatus);
    return () => window.removeEventListener('utp-api-status', handleStatus);
  }, []);

  // Filtrado de incidentes
  const filteredIncidents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return incidents.filter(item => {
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;
      const matchQuery = !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.ticketCode.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.rejectionReason && item.rejectionReason.toLowerCase().includes(q));

      return matchStatus && matchPriority && matchQuery;
    });
  }, [incidents, searchQuery, statusFilter, priorityFilter]);

  // KPIs
  const totalCount = incidents.length;
  const activeCount = incidents.filter(i => i.status === 'Active').length;
  const inactiveCount = incidents.filter(i => i.status === 'Inactive').length;
  const highCount = incidents.filter(i => i.priority === 'High').length;

  // Abrir login con aviso
  const openLoginWithNotice = (msg = '') => {
    setLoginInitialMessage(msg);
    setLoginError('');
    setIsLoginOpen(true);
  };

  // Manejador: Crear nuevo incidente con validación de rol
  const handleOpenCreate = () => {
    if (!user) {
      openLoginWithNotice("Debes iniciar sesión con cualquier rol (ADMIN, SUPERVISOR, OPERATOR o SUPPORT) para registrar un incidente.");
      return;
    }
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await createIncident({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        severity: formData.priority,
        status: formData.status,
        location: formData.location,
        category: formData.category || 'General'
      }).catch(() => null);

      const newId = response?.id || (incidents.length > 0 ? Math.max(...incidents.map(i => i.id)) + 1 : 1);
      const newTicketCode = response?.ticketCode || `INC-${1045 + newId}`;

      const newTicket = {
        id: newId,
        ticketCode: newTicketCode,
        title: formData.title,
        description: formData.description,
        rejectionReason: '',
        status: formData.status,
        priority: formData.priority,
        createdAt: response?.createdAt || new Date().toISOString(),
        location: formData.location
      };

      setIncidents(prev => [newTicket, ...prev]);
      setIsCreateOpen(false);
      showToast("POST /api/incidents Exitoso", `Ticket #${newTicket.ticketCode} creado con ID: ${newId} (HTTP 201).`, true);
    } catch (err) {
      showToast("Error al crear incidente", err.message || "No se pudo comunicar con el servidor.", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejador: Actualizar estado (Solo ADMIN)
  const handleOpenPatch = (item) => {
    if (!user) {
      openLoginWithNotice("Inicia sesión como ADMIN para actualizar el estado del incidente.");
      return;
    }
    if (user.role !== 'ADMIN') {
      showToast("Permiso Denegado", `Tu rol actual (${user.role}) no tiene permisos para cambiar estados. Se requiere rol ADMIN.`, false);
      return;
    }
    setSelectedIncident(item);
    setIsStatusOpen(true);
  };

  const handlePatchSubmit = async (id, targetStatus, reason) => {
    setIsSubmitting(true);
    try {
      await updateIncidentStatus(id, targetStatus, reason).catch(() => null);

      setIncidents(prev => prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: targetStatus,
            rejectionReason: reason
          };
        }
        return item;
      }));

      setIsStatusOpen(false);
      showToast("Estado Actualizado", `PATCH /api/incidents/${id}/status completado (HTTP 200).`, true);
    } catch (err) {
      showToast("Error al actualizar estado", err.message || "No se pudo actualizar en el servidor.", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejador: Eliminar incidente (Solo ADMIN)
  const handleDelete = async (item) => {
    if (!user) {
      openLoginWithNotice("Inicia sesión como ADMIN para eliminar un incidente.");
      return;
    }
    if (user.role !== 'ADMIN') {
      showToast("Permiso Denegado", `Tu rol actual (${user.role}) no tiene permisos para eliminar registros. Se requiere rol ADMIN.`, false);
      return;
    }

    const confirmed = window.confirm(
      `¿Confirmar eliminación del incidente #${item.ticketCode} (${item.title})?\n\nEndpoint: DELETE /api/incidents/${item.id}`
    );
    if (!confirmed) return;

    try {
      await deleteIncident(item.id).catch(() => null);
      setIncidents(prev => prev.filter(i => i.id !== item.id));
      showToast("Incidente Eliminado", `DELETE /api/incidents/${item.id} ejecutado correctamente (HTTP 204).`, false);
    } catch (err) {
      showToast("Error al eliminar", err.message || `No se pudo eliminar el incidente ${item.id}.`, false);
    }
  };

  // Manejador: Ver detalle (Accesible para todos)
  const handleViewDetail = async (item) => {
    setSelectedIncident(item);
    setIsDetailOpen(true);
    try {
      const detailed = await getIncidentById(item.id).catch(() => null);
      if (detailed) {
        setSelectedIncident(prev => ({
          ...prev,
          title: detailed.title || prev.title,
          description: detailed.description || prev.description,
          status: normalizeStatus(detailed.status),
          priority: normalizePriority(detailed.priority || detailed.severity),
          rejectionReason: detailed.message || detailed.rejectionReason || prev.rejectionReason,
          location: detailed.location || prev.location
        }));
      }
    } catch {
      // Conservar datos locales
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
  };

  const handleChangeHost = (newHost) => {
    setApiBaseUrl(newHost);
    setCurrentHost(newHost);
    setIsHostOpen(false);
    showToast("Endpoint Actualizado", `Conectando con: ${newHost}`, true);
    loadData(true);
  };

  // Login por roles
  const handleLogin = async (username, password) => {
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const data = await loginUser(username, password);
      const newUser = {
        username: data.username,
        name: data.name || data.username,
        role: data.role || 'OPERATOR'
      };
      setUser(newUser);
      localStorage.setItem('utp_auth_user', JSON.stringify(newUser));
      setIsLoginOpen(false);
      setIsHostOpen(false);
      showToast("Sesión Iniciada", `Bienvenido, ${newUser.name} (Rol: ${newUser.role})`, true);
    } catch (err) {
      setLoginError(err.message || 'Credenciales incorrectas');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Cierre de sesión real y definitivo
  const handleLogout = async () => {
    try {
      await logoutUser().catch(() => null);
    } finally {
      localStorage.removeItem('utp_auth_user');
      setUser(null);
      showToast("Sesión Cerrada", "Has cerrado sesión correctamente del sistema.", false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] font-body-md text-slate-800 antialiased min-h-screen flex selection:bg-red-600 selection:text-white">
      {/* Barra Lateral de Navegación */}
      <Sidebar
        currentView={navView}
        onSelectView={(id) => {
          if (id === 'docs') {
            setIsDocsOpen(true);
          } else if (id === 'settings') {
            setIsHostOpen(true);
          } else {
            setNavView(id);
          }
        }}
        isOpen={sidebarOpen}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onToggleCollapse={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onOpenLogin={() => openLoginWithNotice()}
        onLogout={handleLogout}
        stats={{ total: totalCount, active: activeCount, high: highCount }}
      />

      {/* Área de Contenido Principal */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
      }`}>
        {/* Cabecera institucional UTP */}
        <Header
          onToggleSidebar={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
              setMobileSidebarOpen(!mobileSidebarOpen);
            } else {
              setSidebarOpen(!sidebarOpen);
            }
          }}
          onOpenDocs={() => setIsDocsOpen(true)}
          onOpenProfile={() => setIsHostOpen(true)}
          onOpenLogin={() => openLoginWithNotice()}
          onLogout={handleLogout}
          isOnline={isOnline}
          apiStatus={apiStatus}
          user={user}
          notificationsCount={1}
        />

        {/* Vistas Dinámicas */}
        <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-5">
          {navView === 'incidents' && (
            <>
              {/* Panel Superior: Telemetría & KPIs NOC */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-5">
                <BreadcrumbTelemetry
                  hostName={currentHost}
                  onRefresh={() => loadData(true)}
                  isRefreshing={isRefreshing}
                  onOpenHostModal={() => setIsHostOpen(true)}
                />
                <KpiMetrics
                  total={totalCount}
                  active={activeCount}
                  inactive={inactiveCount}
                  high={highCount}
                />
              </section>

              {/* Panel Central: Consola Operativa de Incidentes */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <ToolbarFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  priorityFilter={priorityFilter}
                  onPriorityFilterChange={setPriorityFilter}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onOpenCreate={handleOpenCreate}
                />

                {filteredIncidents.length === 0 ? (
                  <EmptyState onResetFilters={handleResetFilters} />
                ) : viewMode === 'table' ? (
                  <IncidentTable
                    incidents={filteredIncidents}
                    onViewDetail={handleViewDetail}
                    onOpenPatch={handleOpenPatch}
                    onDelete={handleDelete}
                  />
                ) : (
                  <IncidentCards
                    incidents={filteredIncidents}
                    onViewDetail={handleViewDetail}
                    onOpenPatch={handleOpenPatch}
                    onDelete={handleDelete}
                  />
                )}

                <TableFooter
                  count={filteredIncidents.length}
                  total={totalCount}
                />
              </section>
            </>
          )}

          {navView === 'users' && (
            <UserManagementView
              onToast={showToast}
              currentUser={user}
              onOpenLogin={(msg) => openLoginWithNotice(msg)}
            />
          )}

          {navView === 'metrics' && (
            <TelemetryMetricsView incidents={incidents} />
          )}
        </main>

        {/* Pie de página */}
        <Footer />
      </div>

      {/* Notificación Toast flotante */}
      <Toast
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
        isSuccess={toast.isSuccess}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />

      {/* Modal: Iniciar Sesión por Roles (ADMIN, SUPERVISOR, OPERATOR, SUPPORT) */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        isLoggingIn={isLoggingIn}
        error={loginError}
        initialMessage={loginInitialMessage}
      />

      {/* Modales Operativos */}
      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        isSubmitting={isSubmitting}
      />

      <StatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        incident={selectedIncident}
        onSubmit={handlePatchSubmit}
        isSubmitting={isSubmitting}
      />

      <DetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        incident={selectedIncident}
      />

      <ApiDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        hostUrl={currentHost}
      />

      <HostSettingsModal
        isOpen={isHostOpen}
        onClose={() => setIsHostOpen(false)}
        currentHost={currentHost}
        onChangeHost={handleChangeHost}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        loginError={loginError}
      />
    </div>
  );
}
