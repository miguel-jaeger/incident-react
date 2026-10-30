import React from 'react';
export default function LazyPasswordModal({handlePasswordSubmit, isSelf, label, passwordError, passwordForm, passwordInfo, passwordSaving, passwordTarget, setPasswordForm, setShowPasswordModal, showPasswordModal, username, users, value}) { return <>
      {/* Modal: Cambio de Contraseña (PATCH /api/users/{id}/password) */}
      {showPasswordModal && passwordTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl flex flex-col border border-surface-container">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary text-white">
                  <span className="material-symbols-outlined text-2xl">key</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-lg text-on-surface font-bold">Cambiar contraseña</h2>
                  <p className="text-xs text-on-surface-variant">
                    {passwordTarget.isSelf ? 'Mi cuenta' : passwordTarget.username}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="py-4 space-y-3">
              {passwordInfo && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  {passwordInfo}
                </div>
              )}
              {passwordError && (
                <div className="p-3 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">{passwordError}</div>
              )}

              <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-[11px] text-on-surface-variant">
                {passwordTarget.isSelf
                  ? 'Para tu propia cuenta se exige la contraseña actual.'
                  : `Como administrador puedes asignar una nueva contraseña a ${passwordTarget.username} sin conocer la actual.`}
              </div>

              {passwordTarget.isSelf && !passwordTarget.id && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">ID de usuario <span className="text-primary">*</span></label>
                  <input
                    type="number"
                    min={1}
                    placeholder="ej. 3"
                    value={passwordForm.userId}
                    onChange={(e) => setPasswordForm({ ...passwordForm, userId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1">Pídelo al administrador o consúltalo en la vista Usuarios.</p>
                </div>
              )}

              {passwordTarget.isSelf && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Contraseña actual <span className="text-primary">*</span></label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Nueva contraseña <span className="text-primary">*</span></label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
                <p className="text-[11px] text-on-surface-variant mt-1">Mínimo 6 caracteres.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Confirmar nueva contraseña <span className="text-primary">*</span></label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={passwordSaving || (!passwordTarget.id && !passwordForm.userId)}
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {passwordSaving ? 'Guardando...' : 'Guardar contraseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


</>; }
