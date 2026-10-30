import React from 'react';
export default function LazyRegisterModal({handleRegisterSubmit, label, registerError, registerForm, setRegisterForm, setShowLoginModal, setShowRegisterModal, showRegisterModal, username, users, value}) { return <>
      {/* Modal: Registro de Usuario (POST /api/users) */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl flex flex-col border border-surface-container">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary text-white">
                  <span className="material-symbols-outlined text-2xl">person_add</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-lg text-on-surface font-bold">Registrar Usuario TI</h2>
                  <p className="text-xs text-on-surface-variant">Mesa Operativa</p>
                </div>
              </div>
              <button onClick={() => setShowRegisterModal(false)} className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="py-4 space-y-3">
              {registerError && (
                <div className="p-3 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">{registerError}</div>
              )}

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Usuario <span className="text-primary">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="ej. operador.noc"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Nombre completo</label>
                <input
                  type="text"
                  placeholder="ej. Operador NOC Campus"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Correo institucional</label>
                <input
                  type="email"
                  placeholder="ej. usuario@utp.edu.pe"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Contraseña <span className="text-primary">*</span></label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
                <p className="text-[11px] text-on-surface-variant mt-1">
                  La cuenta se crea con rol <span className="font-semibold text-on-surface">Operador</span>. Solo un administrador puede asignar otro rol desde la página de Usuarios.
                </p>
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowRegisterModal(false); setShowLoginModal(true); }}
                  className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold"
                >
                  Volver
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-md transition">
                  Registrar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


</>; }
