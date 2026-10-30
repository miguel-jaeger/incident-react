import MetricsPanel from './components/MetricsPanel.jsx';
import IncidentList from './components/IncidentList.jsx';
import React, { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from 'react';
import {
  cancelRead,
  cancelPendingReads,
  getIncidents,
  getStats,
  getStatsByCategory,
  getStatsByStatus,
  getStatsBySeverity,
  getTotalIncidents,
  getIncidentCount,
  createIncident,
  updateIncidentStatus,
  updateIncidentPriority,
  deleteIncident,
  getIncidentById,
  loginUser,
  logoutUser,
  getCurrentUser,
  getAuthToken,
  registerUser,
  getUsers,
  getUserById,
  updateUserRole,
  updateUserPassword,
  deleteUser,
  USER_ROLES,
  API_BASE_URL,
  setApiBaseUrl,
  DEFAULT_LOCAL_URL,
  DEFAULT_RENDER_URL
} from './services/api';

// Helper de estilos por categoría
const CATEGORY_COLORS = {
  Redes: 'bg-sky-100 text-sky-800 border-sky-200',
  Hardware: 'bg-amber-100 text-amber-800 border-amber-200',
  Software: 'bg-purple-100 text-purple-800 border-purple-200',
  Seguridad: 'bg-rose-100 text-rose-800 border-rose-200',
  Infraestructura: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  General: 'bg-slate-100 text-slate-700 border-slate-200',
};

const ROLE_STYLES = {
  ADMIN: 'bg-primary/10 text-primary border-primary/30',
  SUPERVISOR: 'bg-amber-100 text-amber-800 border-amber-200',
  OPERATOR: 'bg-sky-100 text-sky-800 border-sky-200',
  SUPPORT: 'bg-violet-100 text-violet-800 border-violet-200',
};

const ROLE_LABELS = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  OPERATOR: 'Operador',
  SUPPORT: 'Soporte',
};

// El backend mantiene datos históricos con OPEN/CLOSED y nuevos con Active/Inactive.
const ACTIVE_STATUSES = ['ACTIVE', 'OPEN', 'IN_PROGRESS', 'EN_PROGRESO'];

function normalizeStatus(status) {
  return ACTIVE_STATUSES.includes(String(status || '').toUpperCase()) ? 'Active' : 'Inactive';
}

function normalizePriority(priority) {
  const value = String(priority || 'Low').toUpperCase();
  if (value === 'CRITICAL' || value === 'CRITICA' || value === 'CRÍTICA') return 'High';
  if (value === 'ALTA') return 'High';
  if (value === 'MEDIA') return 'Medium';
  if (value === 'BAJA') return 'Low';
  return value.charAt(0) + value.slice(1).toLowerCase();
}

const STATUS_LABELS = { Active: 'Activo', Inactive: 'Inactivo' };
const PRIORITY_LABELS = { High: 'Alta', Medium: 'Media', Low: 'Baja' };

function statusLabel(status) {
  return STATUS_LABELS[status] || status || '—';
}

function priorityLabel(priority) {
  return PRIORITY_LABELS[priority] || priority || '—';
}

function Skeleton({ className = '' }) {
  return <span aria-hidden="true" className={`skeleton block rounded-lg ${className}`} />;
}

function ContentSkeleton({ cards = false }) {
  return (
    <div role="status" aria-label="Cargando datos" className={cards ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-4 p-4'}>
      <span className="sr-only">Cargando datos…</span>
      {Array.from({ length: cards ? 6 : 3 }, (_, index) => (
        <div key={index} className={cards ? 'rounded-3xl border border-surface-container bg-surface-container-lowest p-6 space-y-4' : 'space-y-3'}>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          {cards && <Skeleton className="h-9 w-full mt-5" />}
        </div>
      ))}
    </div>
  );
}

const LazyHostModal = lazy(() => import('./components/LazyHostModal.jsx'));
const LazyDocsModal = lazy(() => import('./components/LazyDocsModal.jsx'));
const LazyUserModal = lazy(() => import('./components/LazyUserModal.jsx'));
const LazyDetailModal = lazy(() => import('./components/LazyDetailModal.jsx'));
const LazyStatusModal = lazy(() => import('./components/LazyStatusModal.jsx'));
const LazyCreateModal = lazy(() => import('./components/LazyCreateModal.jsx'));
const LazyRegisterModal = lazy(() => import('./components/LazyRegisterModal.jsx'));
const LazyLoginModal = lazy(() => import('./components/LazyLoginModal.jsx'));
const LazyPasswordModal = lazy(() => import('./components/LazyPasswordModal.jsx'));
const LazyProfileModal = lazy(() => import('./components/LazyProfileModal.jsx'));

export default function App() {
  const loadVersion = useRef(0);
  const [incidentsLoading, setIncidentsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);
  const detailVersion = useRef(0);
  // Estado principal
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, byCategory: {}, bySeverity: {}, byStatus: {} });
  const [isOnline, setIsOnline] = useState(true);
  const [apiStatus, setApiStatus] = useState({ status: 'connecting', message: 'Conectando con el servidor...' });
  const [currentHost, setCurrentHost] = useState(API_BASE_URL);
  const [view, setView] = useState('cards'); // 'cards' | 'table'
  const [activeView, setActiveView] = useState('incidents'); // 'incidents' | 'users'

  // Filtros
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'Active' | 'Inactive'
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Usuario y Autenticación (la sesión se restaura desde localStorage)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('utp_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Modales
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showHostModal, setShowHostModal] = useState(false);

  // Selecciones para modales
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [patchStatusData, setPatchStatusData] = useState({ id: null, status: 'Active', priority: 'Low', message: '', ticketCode: '' });

  // Formularios
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    category: 'Redes',
    priority: 'Low',
    status: 'Active',
    location: 'Lima Centro - Torre Tecnológica',
  });
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'admin123' });
  const [loginError, setLoginError] = useState('');
  const [registerForm, setRegisterForm] = useState({ username: '', name: '', email: '', password: '' });
  const [registerError, setRegisterError] = useState('');

  // Administración de usuarios (GET /api/users, PATCH /api/users/{id}/role)
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [usersAvailable, setUsersAvailable] = useState(true);
  const [savingRoleId, setSavingRoleId] = useState(null);
  const [usersSearch, setUsersSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [userDetailError, setUserDetailError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ userId: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordInfo, setPasswordInfo] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState({ visible: false, title: '', message: '', isSuccess: true });

  const triggerToast = useCallback((title, message, isSuccess = true) => {
    setToast({ visible: true, title, message, isSuccess });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  }, []);

  // Carga de datos: lista + endpoints de métricas del backend
  const loadData = useCallback(async (updated) => {
    const local = Array.isArray(updated) ? updated : null;
    const version = ++loadVersion.current;
    setIncidentsLoading(true);
    setStatsLoading(true);
    setDataError('');
    const incidentRequest = (local ? Promise.resolve(local) : getIncidents()).then(incidentData => {
      const formatted = (incidentData || []).map(item => ({
        id: item.id,
        ticketCode: item.ticketCode || `INC-${1000 + item.id}`,
        title: item.title,
        description: item.description,
        category: item.category || 'General',
        location: item.location || 'Campus UTP',
        status: normalizeStatus(item.status),
        priority: normalizePriority(item.priority || item.severity),
        severity: normalizePriority(item.severity || item.priority),
        rejectionReason: item.message ?? item.rejectionReason ?? '',
        createdAt: item.createdAt || new Date().toISOString(),
      }));


      if (version === loadVersion.current) {
        setIncidents(formatted);
        setIncidentsLoading(false);
      }
      return formatted;
    }).catch(error => {
      if (version === loadVersion.current) {
        setIncidentsLoading(false);
        setDataError('No se pudieron cargar las incidencias. Vuelve a intentarlo.');
      }
      throw error;
    });
    try {
      const [
        formatted,
        statsResult,
        totalResult,
        statusResult,
        severityResult,
        categoryResult,
        countResult
      ] = await Promise.all([
        incidentRequest,
        getStats().catch(() => null),
        (local ? Promise.resolve(null) : getTotalIncidents().catch(() => null)),
        (local ? Promise.resolve(null) : getStatsByStatus().catch(() => null)),
        (local ? Promise.resolve(null) : getStatsBySeverity().catch(() => null)),
        (local ? Promise.resolve(null) : getStatsByCategory().catch(() => null)),
        (local ? Promise.resolve(null) : getIncidentCount().catch(() => null))
      ]);

      if (version !== loadVersion.current) return;
      setIsOnline(true);

      const byCategory = categoryResult || (statsResult && statsResult.byCategory) || {};
      const bySeverityRaw = severityResult || (statsResult && statsResult.bySeverity) || {};
      const byStatus = statusResult || (statsResult && statsResult.byStatus) || {};

      // Unifica claves de severidad (HIGH/High, MEDIUM/Medium, ...)
      const bySeverity = {};
      Object.entries(bySeverityRaw).forEach(([key, value]) => {
        const label = normalizePriority(key);
        bySeverity[label] = (bySeverity[label] || 0) + Number(value || 0);
      });

      const statusTotal = Object.values(byStatus).reduce((acc, n) => acc + Number(n || 0), 0);
      const total =
        (totalResult && totalResult.total) ??
        (countResult && countResult.total) ??
        (statsResult && statsResult.total) ??
        formatted.length;

      const active = Object.entries(byStatus).reduce(
        (acc, [key, value]) => (ACTIVE_STATUSES.includes(String(key).toUpperCase()) ? acc + Number(value || 0) : acc),
        0
      );

      const fallbackCategory = {};
      formatted.forEach(i => {
        fallbackCategory[i.category] = (fallbackCategory[i.category] || 0) + 1;
      });
      const fallbackSeverity = {};
      formatted.forEach(i => {
        fallbackSeverity[i.severity] = (fallbackSeverity[i.severity] || 0) + 1;
      });

      const resolvedActive = statusTotal > 0
        ? active
        : ((statsResult && statsResult.active) ?? formatted.filter(i => i.status === 'Active').length);

      setStats({
        total,
        active: resolvedActive,
        inactive: Math.max(total - resolvedActive, 0),
        byCategory: Object.keys(byCategory).length ? byCategory : fallbackCategory,
        bySeverity: Object.keys(bySeverity).length ? bySeverity : fallbackSeverity,
        byStatus,
      });
    } catch {
      if (version === loadVersion.current) setIsOnline(false);
    } finally {
      if (version === loadVersion.current) setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!showDetailModal && selectedIncident) {
      detailVersion.current += 1;
      cancelRead(`/api/incidents/${selectedIncident.id}`);
    }
  }, [showDetailModal, selectedIncident]);
  useEffect(() => {
    if (!showUserModal && selectedUser) cancelRead(`/api/users/${selectedUser.id}`);
  }, [showUserModal, selectedUser]);
  useEffect(() => {
    if (showProfileModal) return () => cancelRead('/api/auth/me');
  }, [showProfileModal]);

  // Estado de conexión reportado por el cliente API (arranque en frío de Render).
  useEffect(() => {
    const handleApiStatus = (event) => {
      const detail = event.detail || {};
      setApiStatus({
        status: detail.status || 'online',
        message: detail.message || '',
      });
      if (detail.status === 'online') setIsOnline(true);
      if (detail.status === 'offline') setIsOnline(false);
    };

    window.addEventListener('utp-api-status', handleApiStatus);
    return () => window.removeEventListener('utp-api-status', handleApiStatus);
  }, []);

  useEffect(() => {
    loadData();
    return cancelPendingReads;
  }, [loadData]);

  // GET /api/auth/me: valida la sesión guardada al iniciar la aplicación
  useEffect(() => {
    if (!getAuthToken()) return;
    let cancelled = false;
    getCurrentUser()
      .then(me => {
        if (!cancelled && me && me.authenticated !== false) {
          setUser(prev => ({
            username: me.username || (prev && prev.username),
            name: me.name || (prev && prev.name) || me.username,
            role: me.role || (prev && prev.role),
          }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem('utp_auth_user');
          setUser(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isAdmin = Boolean(user && String(user.role || '').toUpperCase() === 'ADMIN');
  const isAuthenticated = Boolean(user);
  // Permisos de la interfaz alineados con las reglas del backend.
  const canCreateIncident = isAuthenticated;
  const canEditIncident = isAdmin;
  const canDeleteIncident = isAdmin;

  // GET /api/users: listado de usuarios para administración
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const data = await getUsers();
      const list = Array.isArray(data) ? data : (data && Array.isArray(data.users) ? data.users : []);
      setUsers(list.map(item => ({
        ...item,
        role: String(item.role || 'OPERATOR').toUpperCase(),
      })));
      // Guarda el id propio (el backend puede incluirlo en /api/users) para cambios de contraseña.
      setUser(prev => {
        if (!prev || prev.id) return prev;
        const match = list.find(item => item.username === prev.username);
        if (!match) return prev;
        const merged = { ...prev, id: match.id };
        localStorage.setItem('utp_auth_user', JSON.stringify(merged));
        return merged;
      });
      setUsersAvailable(true);
    } catch (err) {
      setUsers([]);
      if (err.status === 401) {
        setUsersError('Sesión sin token válido. Vuelve a iniciar sesión como ADMIN para administrar usuarios.');
      } else if (err.status === 404 || err.status === 405) {
        setUsersAvailable(false);
        setUsersError('La gestión de usuarios no está disponible en este momento.');
      } else {
        setUsersError(err.message || 'No se pudo obtener el listado de usuarios.');
      }
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeView === 'users' && isAdmin) loadUsers();
  }, [activeView, isAdmin, loadUsers]);

  // Si la sesión deja de ser ADMIN (logout o expiración), vuelve a incidentes.
  useEffect(() => {
    if (!isAdmin && activeView === 'users') setActiveView('incidents');
  }, [isAdmin, activeView]);

  // PATCH /api/users/{id}/role — se ejecuta al cambiar el selector
  const handleRoleChange = async (target, role) => {
    if (!role || role === target.role) return;
    setSavingRoleId(target.id);
    try {
      const updated = await updateUserRole(target.id, role);
      setUsers(prev => prev.map(item => (item.id === target.id
        ? { ...item, ...(updated && typeof updated === 'object' ? updated : {}), role: (updated && updated.role) || role }
        : item)));
      const label = target.name || target.username || `#${target.id}`;
      triggerToast('Rol Actualizado', `El rol de ${label} ahora es ${ROLE_LABELS[role] || role}.`);
      if (target.username && user && target.username === user.username) {
        setUser(prev => (prev ? { ...prev, role } : prev));
        localStorage.setItem('utp_auth_user', JSON.stringify({ ...user, role }));
      }
    } catch (err) {
      if (err.status === 404 || err.status === 405) {
        setUsersAvailable(false);
        setUsersError('La actualización de roles no está disponible en este momento.');
      }
      triggerToast('Error al Actualizar Rol', err.message, false);
    } finally {
      setSavingRoleId(null);
    }
  };

  // GET /api/users/{id}: detalle del usuario seleccionado
  const handleOpenUserDetail = async (target) => {
    setSelectedUser(target);
    setShowUserModal(true);
    setUserDetailError('');
    setUserDetailLoading(true);
    try {
      const fresh = await getUserById(target.id);
      if (fresh && typeof fresh === 'object') {
        setSelectedUser({
          ...target,
          ...fresh,
          role: String(fresh.role || target.role || 'OPERATOR').toUpperCase(),
        });
      }
    } catch (err) {
      setUserDetailError(err.message || 'No se pudo cargar el detalle del usuario.');
    } finally {
      setUserDetailLoading(false);
    }
  };

  // PATCH /api/users/{id}/password
  const resolveUserId = async (username) => {
    if (!username) return null;
    if (user && user.username === username && user.id) return user.id;
    try {
      const data = await getUsers();
      const list = Array.isArray(data) ? data : (data && Array.isArray(data.users) ? data.users : []);
      const match = list.find(item => item.username === username);
      return match ? match.id : null;
    } catch {
      return null;
    }
  };

  const handleOpenPasswordModal = async (target) => {
    const isSelf = !target || Boolean(user && target.username === user.username);
    const base = target || user || {};
    setPasswordTarget({
      id: base.id || null,
      username: base.username || '',
      name: base.name || base.username || '',
      isSelf,
    });
    setPasswordForm({ userId: '', currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordInfo('');
    setShowPasswordModal(true);

    if (isSelf && !base.id) {
      const resolvedId = await resolveUserId(base.username);
      if (resolvedId) {
        setPasswordTarget(prev => (prev ? { ...prev, id: resolvedId } : prev));
      } else {
        setPasswordInfo('No pudimos obtener tu ID de usuario desde la sesión. Ingrésalo abajo; el administrador puede verlo en la vista Usuarios.');
      }
    }
  };

  const handlePasswordSubmit = async (e, passwordForm) => {
    e.preventDefault();
    if (!passwordTarget) return;

    const { id, isSelf, username } = passwordTarget;
    const targetId = id || Number(passwordForm.userId);
    if (!Number.isInteger(targetId) || targetId <= 0) {
      setPasswordError('No se pudo determinar el ID del usuario. Ingrésalo manualmente.');
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('La confirmación no coincide con la nueva contraseña.');
      return;
    }
    if (isSelf && !passwordForm.currentPassword) {
      setPasswordError('Debes ingresar tu contraseña actual.');
      return;
    }

    setPasswordSaving(true);
    setPasswordError('');
    try {
      await updateUserPassword(targetId, {
        ...(isSelf ? { currentPassword: passwordForm.currentPassword } : {}),
        newPassword: passwordForm.newPassword,
      });
      setShowPasswordModal(false);
      triggerToast(
        'Contraseña Actualizada',
        `La contraseña de ${username || 'usuario'} se actualizó correctamente.`
      );
    } catch (err) {
      if (err.status === 404 || err.status === 405) {
        setPasswordError('El cambio de contraseña no está disponible en este momento.');
      } else {
        setPasswordError(err.message || 'No se pudo actualizar la contraseña.');
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteUser = async (target) => {
    if (!target || !target.id) return;
    if (user && target.username === user.username) {
      triggerToast('Acción no permitida', 'No puedes eliminar tu propia cuenta.', false);
      return;
    }
    if (!window.confirm(`¿Eliminar la cuenta ${target.username} (${target.name || 'sin nombre'})?`)) {
      return;
    }
    try {
      await deleteUser(target.id);
      setUsers(prev => prev.filter(item => item.id !== target.id));
      triggerToast('Usuario Eliminado', `La cuenta ${target.username} fue eliminada correctamente.`);
    } catch (err) {
      triggerToast('Error al Eliminar Usuario', err.message, false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = usersSearch.trim().toLowerCase();
    return users.filter(item => {
      const matchRole = userRoleFilter === 'ALL' || item.role === userRoleFilter;
      const matchQuery = !q
        || String(item.username || '').toLowerCase().includes(q)
        || String(item.name || item.fullName || '').toLowerCase().includes(q)
        || String(item.email || '').toLowerCase().includes(q);
      return matchRole && matchQuery;
    });
  }, [users, usersSearch, userRoleFilter]);

  // Manejo de Login (POST /api/auth/login)
  const handleLoginSubmit = async (e, loginForm) => {
    e.preventDefault();
    setLoginError('');
    try {
      const auth = await loginUser(loginForm.username, loginForm.password);
      const sessionUser = {
        id: auth.id,
        username: auth.username,
        name: auth.name || auth.username,
        role: auth.role,
        email: auth.email,
      };
      setUser(sessionUser);
      localStorage.setItem('utp_auth_user', JSON.stringify(sessionUser));
      setShowLoginModal(false);
      triggerToast('Sesión Iniciada', `Bienvenido ${sessionUser.name} (${ROLE_LABELS[String(sessionUser.role || '').toUpperCase()] || sessionUser.role})`);
      loadData();
    } catch (err) {
      setLoginError(err.message || 'Usuario o contraseña inválidos');
    }
  };

  // Registro de usuarios (POST /api/users)
  const handleRegisterSubmit = async (e, registerForm) => {
    e.preventDefault();
    setRegisterError('');
    try {
      const created = await registerUser({
        username: registerForm.username.trim(),
        name: registerForm.name.trim(),
        fullName: registerForm.name.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
      });
      const username = created.username || registerForm.username.trim();
      setRegisterForm({ username: '', name: '', email: '', password: '' });
      if (isAdmin) {
        // Un administrador registra cuentas para terceros: permanece en la vista Usuarios.
        setShowRegisterModal(false);
        triggerToast('Usuario Registrado', `La cuenta ${username} fue creada con el rol ${ROLE_LABELS[String(created.role || 'OPERATOR').toUpperCase()] || created.role || 'Operador'}.`);
        if (usersAvailable) loadUsers();
      } else {
        setLoginForm({ username, password: registerForm.password });
        setShowRegisterModal(false);
        setShowLoginModal(true);
        triggerToast('Usuario Registrado', `La cuenta ${username} fue creada con el rol ${ROLE_LABELS[String(created.role || 'OPERATOR').toUpperCase()] || created.role || 'Operador'}.`);
      }
    } catch (err) {
      setRegisterError(err.message || 'No se pudo registrar el usuario');
    }
  };

  // Perfil del usuario autenticado (GET /api/auth/me)
  const handleOpenProfile = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setProfileUser(user);
    setProfileError('');
    setShowProfileModal(true);

    if (!getAuthToken()) return;
    setProfileLoading(true);
    try {
      const me = await getCurrentUser();
      if (me && me.authenticated !== false) {
        setProfileUser(prev => ({
          ...(prev || {}),
          ...me,
          email: me.email || (prev && prev.email),
        }));
        setUser(prev => {
          const merged = {
            ...(prev || {}),
            ...me,
            email: me.email || (prev && prev.email),
          };
          localStorage.setItem('utp_auth_user', JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err) {
      setProfileError(err.message || 'No se pudo actualizar el perfil.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('No se pudo cerrar sesión en el backend:', err.message);
    }
    localStorage.removeItem('utp_auth_user');
    setShowProfileModal(false);
    setProfileUser(null);
    setUser(null);
    triggerToast('Sesión Cerrada', 'Has salido del sistema.', false);
    setShowLoginModal(true);
  };

  // Manejo de Creación (POST)
  const handleCreateSubmit = async (e, newIncident) => {
    e.preventDefault();
    try {
      const created = await createIncident({
        title: newIncident.title,
        description: newIncident.description,
        category: newIncident.category,
        severity: newIncident.priority,
        priority: newIncident.priority,
        status: newIncident.status,
        location: newIncident.location,
        message: ''
      });
      setShowCreateModal(false);
      setNewIncident({
        title: '',
        description: '',
        category: 'Redes',
        priority: 'Low',
        status: 'Active',
        location: 'Lima Centro - Torre Tecnológica',
      });
      triggerToast('Incidente Registrado', `El ticket ${created.ticketCode || created.id} se registró correctamente.`);
      loadData([...incidents, { ...newIncident, ...created }]);
    } catch (err) {
      triggerToast('Error al Crear', err.message, false);
    }
  };

  // Manejo de Actualización de Estado y Prioridad (PATCH)
  const handleOpenPatchModal = useCallback((incident) => {
    setPatchStatusData({
      id: incident.id,
      ticketCode: incident.ticketCode,
      status: incident.status === 'Active' ? 'Active' : 'Inactive',
      priority: normalizePriority(incident.priority || incident.severity),
      message: incident.rejectionReason || ''
    });
    setShowStatusModal(true);
  }, []);

  const handlePatchSubmit = async (e, patchStatusData) => {
    e.preventDefault();
    if (!patchStatusData.id) {
      triggerToast('Error al Actualizar', 'No se seleccionó un incidente válido.', false);
      return;
    }
    try {
      await Promise.all([
        updateIncidentStatus(patchStatusData.id, patchStatusData.status, patchStatusData.message),
        updateIncidentPriority(patchStatusData.id, patchStatusData.priority),
      ]);
      setShowStatusModal(false);
      triggerToast('Incidente Actualizado', 'El estado y la prioridad del incidente se actualizaron correctamente.');
      loadData(incidents.map(item => item.id === patchStatusData.id ? { ...item, status: patchStatusData.status, priority: patchStatusData.priority, severity: patchStatusData.priority, message: patchStatusData.message } : item));
    } catch (err) {
      loadData();
      triggerToast('Error al Actualizar', err.message, false);
    }
  };

  // Manejo de Eliminación (DELETE)
  const handleDelete = useCallback(async (id, ticketCode, title) => {
    if (!window.confirm(`¿Confirmar eliminación del incidente ${ticketCode} (${title})?`)) {
      return;
    }
    try {
      await deleteIncident(id);
      triggerToast('Incidente Eliminado', `Ticket ${ticketCode} eliminado correctamente.`, false);
      loadData(incidents.filter(item => item.id !== id));
    } catch (err) {
      triggerToast('Error al Eliminar', err.message, false);
    }
  }, [incidents, loadData, triggerToast]);

  // Manejo de Detalle Extendido (GET)
  const handleOpenDetailModal = useCallback(async (incident) => {
    const version = ++detailVersion.current;
    setDetailLoading(true);
    setSelectedIncident(incident);
    setShowDetailModal(true);
    try {
      const fresh = await getIncidentById(incident.id);
      if (version !== detailVersion.current) return;
      setSelectedIncident({
        ...fresh,
        ticketCode: fresh.ticketCode || `INC-${1000 + fresh.id}`,
        status: normalizeStatus(fresh.status),
        priority: normalizePriority(fresh.priority || fresh.severity),
        severity: normalizePriority(fresh.severity || fresh.priority),
        rejectionReason: fresh.message || ''
      });
    } catch {
      // Usa el que ya tiene en memoria
    } finally {
      if (version === detailVersion.current) setDetailLoading(false);
    }
  }, []);

  // Cambio de Servidor API
  const handleSaveHost = (customHostInput) => {
    let clean = customHostInput.trim().replace(/\/$/, '');
    if (clean) {
      setApiBaseUrl(clean);
      setCurrentHost(clean);
      setShowHostModal(false);
      triggerToast('Servidor Conectado', `Conectando con ${clean}`);
      loadData();
    }
  };

  // Filtrado reactivo de incidentes
  const searchableIncidents = useMemo(() => incidents.map(item => ({ item, text: [item.title, item.description, item.ticketCode, item.location, item.rejectionReason].join(' ').toLowerCase() })), [incidents]);
  const filteredIncidents = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return searchableIncidents.filter(({item, text}) => {
      const itemActive = item.status === 'Active';
      const statusVal = itemActive ? 'Active' : 'Inactive';
      const matchStatus = statusFilter === 'ALL' || statusVal === statusFilter;

      const itemPrio = (item.priority || item.severity || 'Low').toUpperCase();
      const matchPriority = priorityFilter === 'ALL' || itemPrio === priorityFilter.toUpperCase();

      const itemCat = (item.category || 'General').toLowerCase();
      const matchCategory = categoryFilter === 'ALL' || itemCat === categoryFilter.toLowerCase();

      const matchQuery = !q || text.includes(q);

      return matchStatus && matchPriority && matchCategory && matchQuery;
    }).map(({item}) => item);
  }, [searchableIncidents, statusFilter, priorityFilter, categoryFilter, searchQuery]);

  return (
    <div className="bg-background min-h-screen flex flex-col justify-between font-body-md text-on-surface antialiased">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3">
            <img alt="UTP" className="h-6 sm:h-9 w-auto object-contain" src="https://upload.wikimedia.org/wikipedia/commons/5/50/Utplogonuevo.svg" />
            <div className="flex flex-col">
              <span className="hidden sm:block font-headline-sm text-base text-primary tracking-tight font-bold">UTP Incidentes TI</span>
              <span className="hidden lg:block font-label-sm text-xs text-on-surface-variant leading-none">Gestión Campus &amp; Infraestructura (React)</span>
            </div>
          </div>

          {/* View Switcher */}
          <nav className="flex items-center bg-surface-container-low rounded-lg p-1 border border-surface-container">
            <button
              onClick={() => setActiveView('incidents')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs transition flex items-center gap-1 ${activeView === 'incidents' ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
              title="Incidentes"
            >
              <span className="material-symbols-outlined text-base">confirmation_number</span>
              <span className="hidden md:inline">Incidentes</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveView('users')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs transition flex items-center gap-1 ${activeView === 'users' ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                title="Usuarios"
              >
                <span className="material-symbols-outlined text-base">manage_accounts</span>
                <span className="hidden md:inline">Usuarios</span>
              </button>
            )}
          </nav>

          {/* Host Indicator */}
          <div className="hidden xl:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className="font-mono text-xs font-medium text-on-surface-variant">
              {currentHost.replace(/^https?:\/\//, '')}
            </span>
            <button onClick={() => setShowHostModal(true)} className="text-xs text-tertiary hover:underline ml-1 font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-sm">swap_horiz</span> Servidor
            </button>
          </div>

          {/* Right Header: User profile */}
          <div className="flex items-center gap-3">
            <button onClick={loadData} title="Sincronizar" className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition">
              <span className="material-symbols-outlined text-xl">sync</span>
            </button>

            <button
              type="button"
              onClick={handleOpenProfile}
              title={user ? 'Ver mi perfil' : 'Iniciar sesión'}
              className="flex items-center gap-2 pl-2 border-l border-surface-container cursor-pointer hover:opacity-90 transition bg-transparent"
            >
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-label-sm text-xs text-on-surface font-semibold">{user ? user.name : 'Iniciar Sesión'}</span>
                <span className="font-label-sm text-[10px] text-outline leading-none">{user ? `Rol: ${ROLE_LABELS[String(user.role || '').toUpperCase()] || user.role || 'Usuario'}` : 'No autenticado'}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {user ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
            </button>

            {user && (
              <button onClick={handleLogout} title="Cerrar sesión" className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition">
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="w-full pt-24 px-4 sm:px-6 max-w-7xl mx-auto flex-1 pb-16">
        {apiStatus.status !== 'online' && (
          <div className={`mb-4 rounded-xl border px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm ${
            apiStatus.status === 'offline'
              ? 'bg-red-50 border-red-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className={`p-2 rounded-lg flex items-center justify-center ${
              apiStatus.status === 'offline' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <span className="material-symbols-outlined text-xl">
                {apiStatus.status === 'offline' ? 'cloud_off' : 'hourglass_top'}
              </span>
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${apiStatus.status === 'offline' ? 'text-red-800' : 'text-amber-800'}`}>
                {apiStatus.status === 'offline'
                  ? 'Sin conexión con el backend'
                  : apiStatus.status === 'waking'
                    ? 'Despertando el servidor de Render'
                    : 'Conectando con el servidor'}
              </p>
              <p className={`text-xs mt-0.5 ${apiStatus.status === 'offline' ? 'text-red-700' : 'text-amber-700'}`}>
                {apiStatus.message || (apiStatus.status === 'offline'
                  ? 'Verifica que el backend esté activo o vuelve a intentarlo.'
                  : 'El plan gratuito de Render suspende el backend tras un periodo de inactividad.')}
              </p>
            </div>
            <button
              type="button"
              onClick={loadData}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                apiStatus.status === 'offline'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              Reintentar
            </button>
          </div>
        )}
        <div className="flex flex-col w-full">
          <div className={activeView === 'incidents' ? 'contents' : 'hidden'}>
          {/* Top Status & Docs Bar */}
          <section className="w-full pt-2 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <span className="material-symbols-outlined text-sm">terminal</span>
                  Incidentes
                </span>
                <span>/</span>
                <span className="text-on-surface font-medium">Mesa Operativa Campus</span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isOnline ? 'bg-emerald-500/10 text-emerald-700' : 'bg-red-500/10 text-red-700'}`}>
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`}></span>
                  <span>{isOnline ? 'Servicio en línea' : 'Servicio desconectado'}</span>
                </div>
                <button
                  onClick={() => setShowDocsModal(true)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary shadow-sm hover:shadow transition text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-sm">code</span>
                  <span>Documentación</span>
                </button>
              </div>
            </div>

          <MetricsPanel Skeleton={Skeleton} categoryFilter={categoryFilter} incidents={incidents} setCategoryFilter={setCategoryFilter} stats={stats} statsLoading={statsLoading} />
          </section>

          {/* Controls & Filters Bar */}
          <section className="w-full mb-4">
            <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:max-w-xs">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">search</span>
                  <input
                    type="text"
                    placeholder="Buscar por ID, título, aula..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-surface-container"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-on-surface-variant hover:text-on-surface">
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  )}
                </div>

                {/* Status Toggle */}
                <div className="w-full sm:w-auto flex items-center bg-surface-container-low rounded-lg p-1 border border-surface-container">
                  {['ALL', 'Active', 'Inactive'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-md text-xs transition ${
                        statusFilter === s
                          ? 'font-semibold bg-surface-container-lowest text-on-surface shadow-sm'
                          : 'font-medium text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {s === 'ALL' ? 'Todos' : s === 'Active' ? 'Activos' : 'Inactivos'}
                    </button>
                  ))}
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto bg-surface-container-low text-xs text-on-surface px-3 py-2 rounded-lg focus:outline-none cursor-pointer border border-surface-container"
                >
                  <option value="ALL">Todas las Categorías</option>
                  <option value="Redes">Redes</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Infraestructura">Infraestructura</option>
                  <option value="General">General</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full sm:w-auto bg-surface-container-low text-xs text-on-surface px-3 py-2 rounded-lg focus:outline-none cursor-pointer border border-surface-container"
                >
                  <option value="ALL">Todas las Prioridades</option>
                  <option value="High">Alta</option>
                  <option value="Medium">Media</option>
                  <option value="Low">Baja</option>
                </select>
              </div>

              {/* View Toggles & Add Button */}
              <div className="flex items-center gap-2 justify-end">
                <div className="flex items-center bg-surface-container-low rounded-lg p-1 border border-surface-container">
                  <button
                    onClick={() => setView('cards')}
                    title="Vista Tarjetas"
                    className={`p-1.5 rounded-md transition ${view === 'cards' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    <span className="material-symbols-outlined text-base">grid_view</span>
                  </button>
                  <button
                    onClick={() => setView('table')}
                    title="Vista Tabla"
                    className={`p-1.5 rounded-md transition ${view === 'table' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    <span className="material-symbols-outlined text-base">format_list_bulleted</span>
                  </button>
                </div>

                {canCreateIncident ? (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-semibold text-sm transition shadow-sm"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    <span>Nuevo Incidente</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-semibold text-sm transition shadow-sm"
                    title="Inicia sesión para registrar incidentes"
                  >
                    <span className="material-symbols-outlined text-lg">login</span>
                    <span>Iniciar sesión</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          <IncidentList CATEGORY_COLORS={CATEGORY_COLORS} ContentSkeleton={ContentSkeleton} canDeleteIncident={canDeleteIncident} canEditIncident={canEditIncident} dataError={dataError} filteredIncidents={filteredIncidents} handleDelete={handleDelete} handleOpenDetailModal={handleOpenDetailModal} handleOpenPatchModal={handleOpenPatchModal} incidentsLoading={incidentsLoading} priorityLabel={priorityLabel} setCategoryFilter={setCategoryFilter} setPriorityFilter={setPriorityFilter} setSearchQuery={setSearchQuery} setStatusFilter={setStatusFilter} statusLabel={statusLabel} view={view} />
          </div>

          {activeView === 'users' && (
            <section className="w-full pt-2 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <span className="material-symbols-outlined text-sm">manage_accounts</span>
                    Usuarios
                  </span>
                  <span>/</span>
                  <span className="text-on-surface font-medium">Administración de Usuarios</span>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={loadUsers}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary shadow-sm text-xs font-semibold"
                    >
                      <span className="material-symbols-outlined text-sm">refresh</span>
                      Recargar
                    </button>
                    <button
                      onClick={() => { setRegisterError(''); setShowRegisterModal(true); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">person_add</span>
                      Registrar Usuario
                    </button>
                  </div>
                )}
              </div>

              {!isAdmin ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-surface-container-lowest border border-dashed border-surface-container">
                  <span className="material-symbols-outlined text-5xl text-outline mb-2">lock</span>
                  <h3 className="font-headline-sm text-base text-on-surface font-semibold">Acceso restringido</h3>
                  <p className="text-xs text-on-surface-variant mt-1 max-w-sm">Solo un usuario con rol ADMIN puede listar y actualizar roles.</p>
                </div>
              ) : (
                <>
                  {!usersAvailable && (
                    <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-600 text-xl">warning</span>
                      <div>
                        <p className="text-sm font-bold text-amber-800">Gestión de usuarios no disponible</p>
                        <p className="text-xs text-amber-700 mt-1">
                          La interfaz está lista, pero el servicio de usuarios no está disponible en este momento. Inténtalo más tarde.
                        </p>
                      </div>
                    </div>
                  )}

                  {usersError && usersAvailable && (
                    <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">error</span>
                      {usersError}
                    </div>
                  )}

                  <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container mb-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    <div className="min-w-0 flex flex-col sm:flex-row sm:flex-wrap items-center gap-3 flex-1">
                      <div className="relative w-full sm:max-w-xs">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">search</span>
                        <input
                          type="text"
                          placeholder="Buscar por usuario, nombre o correo..."
                          value={usersSearch}
                          onChange={(e) => setUsersSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-surface-container"
                        />
                      </div>
                      <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="w-full sm:w-auto bg-surface-container-low text-xs text-on-surface px-3 py-2 rounded-lg focus:outline-none cursor-pointer border border-surface-container"
                      >
                        <option value="ALL">Todos los Roles</option>
                        {USER_ROLES.map(role => (
                          <option key={role} value={role}>{ROLE_LABELS[role] || role}</option>
                        ))}
                      </select>
                    </div>
                    <span className="text-xs text-on-surface-variant font-semibold">
                      {filteredUsers.length} de {users.length} usuarios
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant border-b border-surface-container">
                        <tr>
                          <th className="py-3 px-4">ID</th>
                          <th className="py-3 px-4">Usuario</th>
                          <th className="py-3 px-4">Nombre / Correo</th>
                          <th className="py-3 px-4">Rol actual</th>
                          <th className="py-3 px-4">Cambiar rol</th>
                          <th className="py-3 px-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container">
                        {usersLoading ? (
                          <tr>
                            <td colSpan={6} className="p-4"><ContentSkeleton /></td>
                          </tr>
                        ) : filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 px-4 text-center text-xs text-on-surface-variant">
                              {users.length === 0 ? 'No se pudieron cargar usuarios desde el backend.' : 'No hay usuarios que coincidan con los filtros.'}
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map(item => {
                            const currentRole = item.role;
                            const isSelf = Boolean(user && item.username === user.username);
                            const badge = ROLE_STYLES[currentRole] || ROLE_STYLES.OPERATOR;

                            return (
                              <tr key={item.id} className="hover:bg-surface-container-low transition">
                                <td className="py-3 px-4 font-mono text-xs text-on-surface-variant">{item.id}</td>
                                <td className="py-3 px-4">
                                  <button
                                    onClick={() => handleOpenUserDetail(item)}
                                    className="font-bold text-on-surface hover:text-primary transition flex items-center gap-1.5"
                                    title="Ver detalle del usuario"
                                  >
                                    {item.username}
                                    {isSelf && <span className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] font-semibold text-on-surface-variant">Tú</span>}
                                  </button>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="text-on-surface text-xs font-semibold">{item.name || item.fullName || '—'}</div>
                                  <div className="text-on-surface-variant text-xs">{item.email || '—'}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${badge}`}>
                                    {ROLE_LABELS[currentRole] || currentRole}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  {isSelf ? (
                                    <span className="text-[11px] text-on-surface-variant">No puedes cambiar tu propio rol</span>
                                  ) : (
                                    <select
                                      value={currentRole}
                                      disabled={savingRoleId === item.id}
                                      onChange={(e) => handleRoleChange(item, e.target.value)}
                                      className="bg-surface-container-low text-xs text-on-surface px-2 py-1.5 rounded-lg border border-surface-container focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                      title={savingRoleId === item.id ? 'Guardando rol...' : 'Cambia el rol y se guarda al instante'}
                                      aria-label={`Rol de ${item.username}`}
                                    >
                                      {USER_ROLES.map(role => (
                                        <option key={role} value={role}>{ROLE_LABELS[role] || role}</option>
                                      ))}
                                    </select>
                                  )}
                                  {savingRoleId === item.id && (
                                    <div className="text-[10px] text-on-surface-variant mt-1">Guardando...</div>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="inline-flex flex-wrap items-center justify-end gap-1">
                                    <button
                                      onClick={() => handleOpenPasswordModal(item)}
                                      className="px-2.5 py-1.5 rounded-lg text-tertiary hover:bg-tertiary/10 text-xs font-semibold flex items-center gap-1"
                                      title={`Cambiar contraseña de ${item.username}`}
                                    >
                                      <span className="material-symbols-outlined text-base">key</span>
                                      Contraseña
                                    </button>
                                    {!isSelf && (
                                      <button
                                        onClick={() => handleDeleteUser(item)}
                                        className="px-2.5 py-1.5 rounded-lg text-error hover:bg-error/10 text-xs font-semibold flex items-center gap-1"
                                        title={`Eliminar ${item.username}`}
                                      >
                                        <span className="material-symbols-outlined text-base">person_remove</span>
                                        Eliminar
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[11px] text-on-surface-variant mt-3">
                    Los roles se actualizan al instante. Solo un administrador puede gestionar usuarios y roles.
                  </p>
                </>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Floating Toast */}
      {toast.visible && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-lowest shadow-xl max-w-md border border-surface-container transition-all">
          <div className={`p-2 rounded-lg flex items-center justify-center ${toast.isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            <span className="material-symbols-outlined text-xl">{toast.isSuccess ? 'check_circle' : 'error'}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-sm text-on-surface font-bold">{toast.title}</span>
            <span className="font-body-sm text-xs text-on-surface-variant">{toast.message}</span>
          </div>
        </div>
      )}

      {showProfileModal && <Suspense fallback={null}><LazyProfileModal ContentSkeleton={ContentSkeleton} ROLE_LABELS={ROLE_LABELS} ROLE_STYLES={ROLE_STYLES} currentHost={currentHost} handleLogout={handleLogout} handleOpenPasswordModal={handleOpenPasswordModal} isAdmin={isAdmin} profileError={profileError} profileLoading={profileLoading} profileUser={profileUser} setActiveView={setActiveView} setShowProfileModal={setShowProfileModal} showProfileModal={showProfileModal} /></Suspense>}
      {showPasswordModal && <Suspense fallback={null}><LazyPasswordModal handlePasswordSubmit={handlePasswordSubmit} passwordError={passwordError} passwordForm={passwordForm} passwordInfo={passwordInfo} passwordSaving={passwordSaving} passwordTarget={passwordTarget} setShowPasswordModal={setShowPasswordModal} showPasswordModal={showPasswordModal} /></Suspense>}
      {showLoginModal && <Suspense fallback={null}><LazyLoginModal handleLoginSubmit={handleLoginSubmit} loginError={loginError} loginForm={loginForm} setLoginError={setLoginError} setShowLoginModal={setShowLoginModal} setShowRegisterModal={setShowRegisterModal} showLoginModal={showLoginModal} /></Suspense>}
      {showRegisterModal && <Suspense fallback={null}><LazyRegisterModal handleRegisterSubmit={handleRegisterSubmit} registerError={registerError} registerForm={registerForm} setShowLoginModal={setShowLoginModal} setShowRegisterModal={setShowRegisterModal} showRegisterModal={showRegisterModal} /></Suspense>}
      {showCreateModal && <Suspense fallback={null}><LazyCreateModal handleCreateSubmit={handleCreateSubmit} newIncident={newIncident} setShowCreateModal={setShowCreateModal} showCreateModal={showCreateModal} /></Suspense>}
      {showStatusModal && <Suspense fallback={null}><LazyStatusModal handlePatchSubmit={handlePatchSubmit} patchStatusData={patchStatusData} setShowStatusModal={setShowStatusModal} showStatusModal={showStatusModal} /></Suspense>}
      {showDetailModal && <Suspense fallback={null}><LazyDetailModal CATEGORY_COLORS={CATEGORY_COLORS} ContentSkeleton={ContentSkeleton} detailLoading={detailLoading} priorityLabel={priorityLabel} selectedIncident={selectedIncident} setShowDetailModal={setShowDetailModal} showDetailModal={showDetailModal} statusLabel={statusLabel} /></Suspense>}
      {showUserModal && <Suspense fallback={null}><LazyUserModal ContentSkeleton={ContentSkeleton} ROLE_LABELS={ROLE_LABELS} ROLE_STYLES={ROLE_STYLES} selectedUser={selectedUser} setShowUserModal={setShowUserModal} showUserModal={showUserModal} userDetailError={userDetailError} userDetailLoading={userDetailLoading} /></Suspense>}
      {showDocsModal && <Suspense fallback={null}><LazyDocsModal setShowDocsModal={setShowDocsModal} showDocsModal={showDocsModal} /></Suspense>}
      {showHostModal && <Suspense fallback={null}><LazyHostModal DEFAULT_LOCAL_URL={DEFAULT_LOCAL_URL} DEFAULT_RENDER_URL={DEFAULT_RENDER_URL} currentHost={currentHost} customHostInput={currentHost} handleSaveHost={handleSaveHost} isOnline={isOnline} setShowHostModal={setShowHostModal} showHostModal={showHostModal} /></Suspense>}

    </div>
  );
}
