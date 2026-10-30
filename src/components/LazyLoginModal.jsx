import React, { useState } from 'react';
export default function LazyLoginModal({handleLoginSubmit, loginError, loginForm: initialValue, setLoginError, setShowLoginModal, setShowRegisterModal, showLoginModal}) {
  const [loginForm, setLoginForm] = useState(initialValue);
  return <>
      {/* Modal: Login */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl flex flex-col border border-surface-container">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary text-white">
                  <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-lg text-on-surface font-bold">Autenticación UTP TI</h2>
                  <p className="text-xs text-on-surface-variant">Mesa Operativa</p>
                </div>
              </div>
              <button onClick={() => setShowLoginModal(false)} className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={(event) => handleLoginSubmit(event, loginForm)} className="py-4 space-y-4">
              {loginError && (
                <div className="p-3 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">{loginError}</div>
              )}

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Usuario o Correo Institucional</label>
                <input
                  type="text"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface border border-surface-container focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low border border-surface-container">
                <span className="block text-[11px] font-semibold text-on-surface-variant mb-1.5 uppercase">Cuentas Pre-configuradas UTP:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" onClick={() => setLoginForm({ username: 'admin', password: 'admin123' })} className="px-2 py-1 rounded bg-white hover:bg-surface-container text-[11px] font-medium border border-surface-container text-on-surface">Admin (admin123)</button>
                  <button type="button" onClick={() => setLoginForm({ username: 'supervisor', password: 'utp2025' })} className="px-2 py-1 rounded bg-white hover:bg-surface-container text-[11px] font-medium border border-surface-container text-on-surface">Supervisor (utp2025)</button>
                  <button type="button" onClick={() => setLoginForm({ username: 'operador', password: 'operador123' })} className="px-2 py-1 rounded bg-white hover:bg-surface-container text-[11px] font-medium border border-surface-container text-on-surface">Operador (operador123)</button>
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-md transition">
                Iniciar Sesión
              </button>

              <button
                type="button"
                onClick={() => { setLoginError(''); setShowLoginModal(false); setShowRegisterModal(true); }}
                className="w-full py-2 rounded-lg border border-surface-container text-on-surface-variant hover:text-primary hover:border-primary text-xs font-semibold transition"
              >
                ¿No tienes cuenta? Registrar usuario
              </button>
            </form>
          </div>
        </div>
      )}


</>; }
