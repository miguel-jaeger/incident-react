import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ApiBanner } from './components/incidents/ApiBanner';
import { IncidentMetrics } from './components/incidents/IncidentMetrics';
import { IncidentFilters } from './components/incidents/IncidentFilters';
import { IncidentList } from './components/incidents/IncidentList';
import { UsersPanel } from './components/users/UsersPanel';
import { Toast } from './components/feedback/Toast';
import { ProfileModal } from './components/modals/ProfileModal';
import { PasswordModal } from './components/modals/PasswordModal';
import { LoginModal } from './components/modals/LoginModal';
import { RegisterModal } from './components/modals/RegisterModal';
import { CreateIncidentModal } from './components/modals/CreateIncidentModal';
import { StatusModal } from './components/modals/StatusModal';
import { DetailModal } from './components/modals/DetailModal';
import { UserDetailModal } from './components/modals/UserDetailModal';
import { DocsModal } from './components/modals/DocsModal';
import { HostModal } from './components/modals/HostModal';
import { CATEGORY_COLORS, ROLE_STYLES, ROLE_LABELS, statusLabel, priorityLabel, normalizeStatus, normalizePriority } from './lib/labels';
import {
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

export default function App() {
  // Estado principal
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, byCategory: {}, bySeverity: {}, byStatus: {} });
  const [isOnline, setIsOnline] = useState(true);
  const [apiStatus, setApiStatus] = useState({ status: 'connecting', message: 'Conectando con el servidor...' });
  const [currentHost, setCurrentHost] = useState(API_BASE_URL);
  const [view, setView] = useState('table'); // 'cards' | 'table'
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
  const [customHostInput, setCustomHostInput] = useState(API_BASE_URL);

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
  const loadData = useCallback(async () => {
    try {
      const [
        incidentData,
        statsResult,
        totalResult,
        statusResult,
        severityResult,
        categoryResult,
        countResult
      ] = await Promise.all([
        getIncidents(),
        getStats().catch(() => null),
        getTotalIncidents().catch(() => null),
        getStatsByStatus().catch(() => null),
        getStatsBySeverity().catch(() => null),
        getStatsByCategory().catch(() => null),
        getIncidentCount().catch(() => null)
      ]);

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
        rejectionReason: item.message || '',
        createdAt: item.createdAt || new Date().toISOString(),
      }));

      setIncidents(formatted);
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
      setIsOnline(false);
    }
  }, []);

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

  const handlePasswordSubmit = async (e) => {
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
  const handleLoginSubmit = async (e) => {
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
  const handleRegisterSubmit = async (e) => {
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
  const handleCreateSubmit = async (e) => {
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
      loadData();
    } catch (err) {
      triggerToast('Error al Crear', err.message, false);
    }
  };

  // Manejo de Actualización de Estado y Prioridad (PATCH)
  const handleOpenPatchModal = (incident) => {
    setPatchStatusData({
      id: incident.id,
      ticketCode: incident.ticketCode,
      status: incident.status === 'Active' ? 'Active' : 'Inactive',
      priority: normalizePriority(incident.priority || incident.severity),
      message: incident.rejectionReason || ''
    });
    setShowStatusModal(true);
  };

  const handlePatchSubmit = async (e) => {
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
      loadData();
    } catch (err) {
      triggerToast('Error al Actualizar', err.message, false);
    }
  };

  // Manejo de Eliminación (DELETE)
  const handleDelete = async (id, ticketCode, title) => {
    if (!window.confirm(`¿Confirmar eliminación del incidente ${ticketCode} (${title})?`)) {
      return;
    }
    try {
      await deleteIncident(id);
      triggerToast('Incidente Eliminado', `Ticket ${ticketCode} eliminado correctamente.`, false);
      loadData();
    } catch (err) {
      triggerToast('Error al Eliminar', err.message, false);
    }
  };

  // Manejo de Detalle Extendido (GET)
  const handleOpenDetailModal = async (incident) => {
    setSelectedIncident(incident);
    setShowDetailModal(true);
    try {
      const fresh = await getIncidentById(incident.id);
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
    }
  };

  // Cambio de Servidor API
  const handleSaveHost = () => {
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
  const filteredIncidents = useMemo(() => {
    return incidents.filter(item => {
      const itemActive = item.status === 'Active';
      const statusVal = itemActive ? 'Active' : 'Inactive';
      const matchStatus = statusFilter === 'ALL' || statusVal === statusFilter;

      const itemPrio = (item.priority || item.severity || 'Low').toUpperCase();
      const matchPriority = priorityFilter === 'ALL' || itemPrio === priorityFilter.toUpperCase();

      const itemCat = (item.category || 'General').toLowerCase();
      const matchCategory = categoryFilter === 'ALL' || itemCat === categoryFilter.toLowerCase();

      const q = searchQuery.toLowerCase();
      const matchQuery = !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.ticketCode && item.ticketCode.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.rejectionReason && item.rejectionReason.toLowerCase().includes(q));

      return matchStatus && matchPriority && matchCategory && matchQuery;
    });
  }, [incidents, statusFilter, priorityFilter, categoryFilter, searchQuery]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-body-md text-slate-800 antialiased">
      <Header
        activeView={activeView}
        handleLogout={handleLogout}
        handleOpenProfile={handleOpenProfile}
        isAdmin={isAdmin}
        isOnline={isOnline}
        loadData={loadData}
        setActiveView={setActiveView}
        setShowDocsModal={setShowDocsModal}
        setShowHostModal={setShowHostModal}
        user={user}
      />
      <main className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1">
        <ApiBanner
          apiStatus={apiStatus}
          loadData={loadData}
        />
        <div className="flex flex-col w-full">
          <div className={activeView === 'incidents' ? 'contents' : 'hidden'}>
            <IncidentMetrics
              base={base}
              categoryFilter={categoryFilter}
              currentHost={currentHost}
              incidents={incidents}
              isOnline={isOnline}
              setCategoryFilter={setCategoryFilter}
              setShowDocsModal={setShowDocsModal}
              stats={stats}
            />
            <IncidentFilters
              canCreateIncident={canCreateIncident}
              categoryFilter={categoryFilter}
              priorityFilter={priorityFilter}
              searchQuery={searchQuery}
              setCategoryFilter={setCategoryFilter}
              setPriorityFilter={setPriorityFilter}
              setSearchQuery={setSearchQuery}
              setShowCreateModal={setShowCreateModal}
              setShowLoginModal={setShowLoginModal}
              setStatusFilter={setStatusFilter}
              setView={setView}
              statusFilter={statusFilter}
              value={value}
              view={view}
            />
            <IncidentList
              canDeleteIncident={canDeleteIncident}
              canEditIncident={canEditIncident}
              catClass={catClass}
              filteredIncidents={filteredIncidents}
              handleDelete={handleDelete}
              handleOpenDetailModal={handleOpenDetailModal}
              handleOpenPatchModal={handleOpenPatchModal}
              isActive={isActive}
              setCategoryFilter={setCategoryFilter}
              setPriorityFilter={setPriorityFilter}
              setSearchQuery={setSearchQuery}
              setStatusFilter={setStatusFilter}
              view={view}
            />
          </div>
          <UsersPanel
            activeView={activeView}
            badge={badge}
            currentRole={currentRole}
            filteredUsers={filteredUsers}
            handleDeleteUser={handleDeleteUser}
            handleOpenPasswordModal={handleOpenPasswordModal}
            handleOpenUserDetail={handleOpenUserDetail}
            handleRoleChange={handleRoleChange}
            isAdmin={isAdmin}
            isSelf={isSelf}
            label={label}
            loadUsers={loadUsers}
            savingRoleId={savingRoleId}
            setRegisterError={setRegisterError}
            setShowRegisterModal={setShowRegisterModal}
            setUserRoleFilter={setUserRoleFilter}
            setUsersSearch={setUsersSearch}
            user={user}
            userRoleFilter={userRoleFilter}
            users={users}
            usersAvailable={usersAvailable}
            usersError={usersError}
            usersLoading={usersLoading}
            usersSearch={usersSearch}
            value={value}
          />
        </div>
      </main>
      <Toast
        toast={toast}
      />
      <ProfileModal
        currentHost={currentHost}
        handleLogout={handleLogout}
        handleOpenPasswordModal={handleOpenPasswordModal}
        isAdmin={isAdmin}
        profileError={profileError}
        profileLoading={profileLoading}
        profileUser={profileUser}
        setActiveView={setActiveView}
        setShowProfileModal={setShowProfileModal}
        showProfileModal={showProfileModal}
      />
      <PasswordModal
        handlePasswordSubmit={handlePasswordSubmit}
        label={label}
        passwordError={passwordError}
        passwordForm={passwordForm}
        passwordInfo={passwordInfo}
        passwordSaving={passwordSaving}
        passwordTarget={passwordTarget}
        setPasswordForm={setPasswordForm}
        setShowPasswordModal={setShowPasswordModal}
        showPasswordModal={showPasswordModal}
        users={users}
        value={value}
      />
      <LoginModal
        handleLoginSubmit={handleLoginSubmit}
        label={label}
        loginError={loginError}
        loginForm={loginForm}
        setLoginError={setLoginError}
        setLoginForm={setLoginForm}
        setShowLoginModal={setShowLoginModal}
        setShowRegisterModal={setShowRegisterModal}
        showLoginModal={showLoginModal}
        username={username}
        value={value}
      />
      <RegisterModal
        handleRegisterSubmit={handleRegisterSubmit}
        label={label}
        registerError={registerError}
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        setShowLoginModal={setShowLoginModal}
        setShowRegisterModal={setShowRegisterModal}
        showRegisterModal={showRegisterModal}
        username={username}
        users={users}
        value={value}
      />
      <CreateIncidentModal
        handleCreateSubmit={handleCreateSubmit}
        label={label}
        newIncident={newIncident}
        setNewIncident={setNewIncident}
        setShowCreateModal={setShowCreateModal}
        showCreateModal={showCreateModal}
        value={value}
      />
      <StatusModal
        active={active}
        handlePatchSubmit={handlePatchSubmit}
        label={label}
        patchStatusData={patchStatusData}
        setPatchStatusData={setPatchStatusData}
        setShowStatusModal={setShowStatusModal}
        showStatusModal={showStatusModal}
        value={value}
      />
      <DetailModal
        selectedIncident={selectedIncident}
        setShowDetailModal={setShowDetailModal}
        showDetailModal={showDetailModal}
      />
      <UserDetailModal
        selectedUser={selectedUser}
        setShowUserModal={setShowUserModal}
        showUserModal={showUserModal}
        userDetailError={userDetailError}
        userDetailLoading={userDetailLoading}
        users={users}
      />
      <DocsModal
        auth={auth}
        base={base}
        currentHost={currentHost}
        incidents={incidents}
        me={me}
        setShowDocsModal={setShowDocsModal}
        showDocsModal={showDocsModal}
        stats={stats}
        total={total}
        users={users}
      />
      <HostModal
        customHostInput={customHostInput}
        handleSaveHost={handleSaveHost}
        label={label}
        setCustomHostInput={setCustomHostInput}
        setShowHostModal={setShowHostModal}
        showHostModal={showHostModal}
        value={value}
      />
      <Footer
        currentHost={currentHost}
        isOnline={isOnline}
      />
    </div>
  );
}