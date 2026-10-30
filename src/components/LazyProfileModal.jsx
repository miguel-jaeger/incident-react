import React from 'react';
export default function LazyProfileModal({ContentSkeleton, ROLE_LABELS, ROLE_STYLES, base, currentHost, handleLogout, handleOpenPasswordModal, isAdmin, profileError, profileLoading, profileUser, setActiveView, setShowProfileModal, showProfileModal, username, users}) { return <>
      {/* Modal: Mi Perfil */}
      {showProfileModal && profileUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl flex flex-col border border-surface-container">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  {String(profileUser.name || profileUser.username || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-headline-md text-lg text-on-surface font-bold">Mi Perfil</h2>
                  <p className="text-xs text-on-surface-variant">Sesión activa</p>
                </div>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3">
              {profileLoading && (
                <ContentSkeleton />
              )}
              {profileError && (
                <div className="p-3 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">{profileError}</div>
              )}

              <div className={profileLoading ? 'hidden' : 'space-y-3'}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] uppercase text-on-surface-variant font-semibold">Usuario</span>
                  <p className="text-sm text-on-surface font-semibold mt-0.5">{profileUser.username || '—'}</p>
                </div>
                <div>
                  <span className="text-[11px] uppercase text-on-surface-variant font-semibold">Rol</span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${ROLE_STYLES[String(profileUser.role || '').toUpperCase()] || ROLE_STYLES.OPERATOR}`}>
                      {ROLE_LABELS[String(profileUser.role || '').toUpperCase()] || profileUser.role || '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase text-on-surface-variant font-semibold">Nombre completo</span>
                <p className="text-sm text-on-surface mt-0.5">{profileUser.name || profileUser.fullName || '—'}</p>
              </div>

              <div>
                <span className="text-[11px] uppercase text-on-surface-variant font-semibold">Correo institucional</span>
                <p className="text-sm text-on-surface mt-0.5 break-all">{profileUser.email || 'No registrado'}</p>
              </div>

              </div>
              <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container flex items-center gap-2 text-[11px] text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Token de sesión activo · {currentHost.replace(/^https?:\/\//, '')}
              </div>

              <button
                onClick={() => { setShowProfileModal(false); handleOpenPasswordModal(null); }}
                className="w-full py-2.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span className="material-symbols-outlined text-base">key</span>
                Cambiar mi contraseña
              </button>
            </div>

            <div className="pt-3 border-t border-surface-container flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => { setShowProfileModal(false); setActiveView('users'); }}
                    className="px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">manage_accounts</span>
                    Usuarios
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-error hover:bg-error/10 text-xs font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Cerrar sesión
                </button>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold">Cerrar</button>
            </div>
          </div>
        </div>
      )}


</>; }
