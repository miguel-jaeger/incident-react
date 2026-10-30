import { ROLE_STYLES, ROLE_LABELS } from '../../lib/labels';
import { USER_ROLES } from '../../services/api';
export function UsersPanel({
    activeView,
    badge,
    currentRole,
    filteredUsers,
    handleDeleteUser,
    handleOpenPasswordModal,
    handleOpenUserDetail,
    handleRoleChange,
    isAdmin,
    isSelf,
    label,
    loadUsers,
    savingRoleId,
    setRegisterError,
    setShowRegisterModal,
    setUserRoleFilter,
    setUsersSearch,
    user,
    userRoleFilter,
    users,
    usersAvailable,
    usersError,
    usersLoading,
    usersSearch,
    value
}) {
  return (
    <>
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
                    <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
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
                            <td colSpan={6} className="py-8 px-4 text-center text-xs text-on-surface-variant">Cargando usuarios...</td>
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
    </>
  );
}
