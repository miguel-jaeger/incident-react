import React, { useState, useEffect, useCallback } from 'react';
import {
  getUsers,
  registerUser,
  updateUserRole,
  updateUserPassword,
  deleteUser,
  USER_ROLES
} from '../services/api';

export default function UserManagementView({ onToast, currentUser = null, onOpenLogin }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const isAdmin = currentUser?.role === 'ADMIN';

  // Modal: Registrar Usuario
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'OPERATOR'
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Modal: Cambiar Contraseña
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passSubmitting, setPassSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers();
      const list = Array.isArray(data) ? data : (data && Array.isArray(data.users) ? data.users : []);
      setUsers(list);
    } catch (err) {
      setError(err.message || 'No se pudo cargar la lista de usuarios. Asegúrate de tener permisos de ADMIN.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin, fetchUsers]);

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center space-y-4 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
        </div>
        <div>
          <h3 className="font-headline-sm text-lg font-bold text-slate-900">
            Acceso Restringido a Administradores TI
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            La gestión de cuentas, asignación de roles y contraseñas requiere privilegios de <strong>ADMIN</strong> según las políticas de seguridad del backend.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onOpenLogin && onOpenLogin('Inicia sesión con la cuenta de Administrador para gestionar usuarios.')}
            className="px-5 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#a60b24] text-white text-xs font-bold font-headline-sm transition cursor-pointer shadow-sm inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">login</span>
            <span>Iniciar Sesión como Administrador (ADMIN)</span>
          </button>
        </div>
      </div>
    );
  }

  // Cambiar rol de usuario en vivo
  const handleRoleChange = async (userId, targetRole) => {
    try {
      await updateUserRole(userId, targetRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: targetRole } : u));
      if (onToast) onToast("Rol Actualizado", `PATCH /api/users/${userId}/role -> ${targetRole}`, true);
    } catch (err) {
      if (onToast) onToast("Error", err.message || "No se pudo actualizar el rol.", false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(`¿Confirmas la eliminación del usuario @${user.username} (${user.name})?\n\nEndpoint: DELETE /api/users/${user.id}`);
    if (!confirmed) return;

    try {
      await deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      if (onToast) onToast("Usuario Eliminado", `DELETE /api/users/${user.id} completado (HTTP 204).`, false);
    } catch (err) {
      if (onToast) onToast("Error", err.message || "No se pudo eliminar el usuario.", false);
    }
  };

  // Crear usuario
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateSubmitting(true);
    try {
      const created = await registerUser(createForm);
      setUsers(prev => [...prev, created]);
      setIsCreateOpen(false);
      setCreateForm({ username: '', name: '', email: '', password: '', role: 'OPERATOR' });
      if (onToast) onToast("Usuario Creado", `POST /api/users exitoso: @${created.username} (${created.role})`, true);
    } catch (err) {
      if (onToast) onToast("Error", err.message || "No se pudo crear el usuario.", false);
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Cambiar contraseña
  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !newPassword.trim()) return;
    setPassSubmitting(true);
    try {
      await updateUserPassword(selectedUser.id, { newPassword });
      setIsPassOpen(false);
      setNewPassword('');
      if (onToast) onToast("Contraseña Actualizada", `PATCH /api/users/${selectedUser.id}/password ejecutado con éxito.`, true);
    } catch (err) {
      if (onToast) onToast("Error", err.message || "No se pudo cambiar la contraseña.", false);
    } finally {
      setPassSubmitting(false);
    }
  };

  // Filtrado de usuarios
  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase().trim();
    const matchQ = !q || (u.username && u.username.toLowerCase().includes(q)) || (u.name && u.name.toLowerCase().includes(q)) || (u.email && u.email.toLowerCase().includes(q));
    const matchRole = roleFilter === 'ALL' || String(u.role).toUpperCase() === roleFilter;
    return matchQ && matchRole;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-red-700 font-bold bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
              <span className="material-symbols-outlined text-sm">manage_accounts</span>
              <span>users-controller</span>
            </div>
            <span>/</span>
            <span className="text-slate-800 font-sans font-medium">Administración de Usuarios & Roles TI</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchUsers}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              <span>Recargar</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C8102E] hover:bg-[#a60b24] text-white text-xs font-bold font-headline-sm transition cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>+ Nuevo Usuario</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Buscar por usuario, nombre o correo institucional..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="ALL">Todos los roles</option>
            {USER_ROLES.map(r => (
              <option key={r} value={r}>Rol: {r}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Users Table */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-3xl animate-spin text-red-600">progress_activity</span>
            <span>Cargando cuentas desde /api/users...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600 space-y-2">
            <span className="material-symbols-outlined text-3xl text-red-500">lock</span>
            <p className="font-semibold">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No se encontraron usuarios que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-[11px] font-mono uppercase tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Usuario / Login</th>
                  <th className="py-3 px-4 font-semibold">Nombre Completo</th>
                  <th className="py-3 px-4 font-semibold">Correo Institucional</th>
                  <th className="py-3 px-4 font-semibold text-center">Rol Asignado (PATCH)</th>
                  <th className="py-3 px-4 font-semibold text-right">Comandos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((u, idx) => {
                  const rowBg = idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/40 hover:bg-slate-50';
                  return (
                    <tr key={u.id || idx} className={`${rowBg} transition-colors`}>
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">
                        #{u.id}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-red-700">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base text-slate-400">person</span>
                          <span>@{u.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {u.name || u.fullName || u.username}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {u.email || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <select
                          value={String(u.role || 'OPERATOR').toUpperCase()}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 border border-slate-200 focus:bg-white focus:outline-none cursor-pointer"
                        >
                          {USER_ROLES.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setIsPassOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 text-xs font-medium transition cursor-pointer"
                            title="Cambiar contraseña"
                          >
                            <span className="material-symbols-outlined text-sm">key</span>
                            <span className="hidden sm:inline">Clave</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-medium transition cursor-pointer"
                            title="Eliminar usuario"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            <span className="hidden sm:inline">Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono">Mostrando {filteredUsers.length} de {users.length} cuentas registradas</span>
          <span className="font-mono text-[11px] text-emerald-600">● Conectado a SQLite UTP Database</span>
        </div>
      </section>

      {/* Modal: Crear Usuario */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-headline-md font-bold text-base text-slate-900">Registrar Usuario TI</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre de Usuario *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. mjaeger"
                  value={createForm.username}
                  onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Ing. Miguel Jaeger"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correo Institucional *</label>
                <input
                  type="email"
                  required
                  placeholder="ej. C32007@utp.edu.pe"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contraseña Inicial *</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rol Operativo</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                >
                  {USER_ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#C8102E] text-white font-semibold shadow"
                >
                  {createSubmitting ? "Guardando..." : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cambiar Contraseña */}
      {isPassOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-headline-md font-bold text-base text-slate-900">Restablecer Contraseña</h3>
                <p className="text-[11px] font-mono text-slate-500">@{selectedUser.username}</p>
              </div>
              <button onClick={() => setIsPassOpen(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handlePassSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  required
                  placeholder="Ingresa la nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPassOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={passSubmitting}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow"
                >
                  {passSubmitting ? "Guardando..." : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

