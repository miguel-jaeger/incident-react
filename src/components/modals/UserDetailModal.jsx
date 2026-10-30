import { ROLE_STYLES, ROLE_LABELS } from '../../lib/labels';
export function UserDetailModal({
    selectedUser,
    setShowUserModal,
    showUserModal,
    userDetailError,
    userDetailLoading,
    users
}) {
  return (
    <>
      {/* Modal: Detalle de Usuario (GET /api/users/{id}) */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl flex flex-col border border-surface-container">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                  {String(selectedUser.username || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-headline-md text-base text-on-surface font-bold">{selectedUser.username}</h2>
                  <p className="text-xs text-on-surface-variant">Información del usuario</p>
                </div>
              </div>
              <button onClick={() => setShowUserModal(false)} className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3">
              {userDetailLoading && (
                <div className="p-3 rounded-lg bg-surface-container-low text-xs text-on-surface-variant">Cargando detalle...</div>
              )}
              {userDetailError && (
                <div className="p-3 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">{userDetailError}</div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] uppercase text-on-surface-variant font-semibold">ID</span>
                  <p className="text-sm text-on-surface font-mono mt-0.5">{selectedUser.id}</p>
                </div>
                <div>
                  <span className="text-[11px] uppercase text-on-surface-variant font-semibold">Rol</span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${ROLE_STYLES[selectedUser.role] || ROLE_STYLES.OPERATOR}`}>
                      {ROLE_LABELS[String(selectedUser.role || '').toUpperCase()] || selectedUser.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] uppercase text-on-surface-variant font-semibold">Nombre</span>
                  <p className="text-xs text-on-surface mt-0.5">{selectedUser.name || selectedUser.fullName || '—'}</p>
                </div>
                <div>
                  <span className="text-[11px] uppercase text-on-surface-variant font-semibold">Correo</span>
                  <p className="text-xs text-on-surface mt-0.5 break-all">{selectedUser.email || '—'}</p>
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase text-on-surface-variant font-semibold">Registrado</span>
                <p className="text-xs text-on-surface font-mono mt-0.5">{selectedUser.createdAt || '—'}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-container flex justify-end">
              <button onClick={() => setShowUserModal(false)} className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
