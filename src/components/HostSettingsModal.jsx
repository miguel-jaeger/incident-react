import React, { useState } from 'react';
import { DEFAULT_RENDER_URL, DEFAULT_LOCAL_URL } from '../services/api';

export default function HostSettingsModal({
  isOpen,
  onClose,
  currentHost,
  onChangeHost,
  user,
  onLogin,
  onLogout,
  isLoggingIn = false,
  loginError = ''
}) {
  const [selectedHost, setSelectedHost] = useState(currentHost);
  const [customHost, setCustomHost] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  if (!isOpen) return null;

  const handleSaveHost = (e) => {
    e.preventDefault();
    const finalHost = selectedHost === 'custom' ? customHost.trim() : selectedHost;
    if (finalHost) {
      onChangeHost(finalHost);
    }
  };

  const handleDoLogin = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <span className="material-symbols-outlined text-xl">tune</span>
            </div>
            <div>
              <h2 className="font-headline-md text-base font-bold text-slate-900">
                Conexión & Supervisión NOC
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Ajustes de endpoint API y credenciales UTP
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* 1. Endpoint selector */}
        <form onSubmit={handleSaveHost} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Servidor Backend Activo:
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedHost(DEFAULT_RENDER_URL)}
              className={`p-2.5 rounded-lg border text-left transition flex flex-col gap-0.5 cursor-pointer ${
                selectedHost === DEFAULT_RENDER_URL
                  ? 'border-red-600 bg-red-50 text-red-900 font-semibold'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Cloud Render (Producción)</span>
              <span className="text-[10px] text-slate-500 truncate font-mono">api-incident.onrender.com</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedHost(DEFAULT_LOCAL_URL)}
              className={`p-2.5 rounded-lg border text-left transition flex flex-col gap-0.5 cursor-pointer ${
                selectedHost === DEFAULT_LOCAL_URL
                  ? 'border-red-600 bg-red-50 text-red-900 font-semibold'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Servidor Local (Spring Boot)</span>
              <span className="text-[10px] text-slate-500 truncate font-mono">localhost:8081</span>
            </button>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer transition"
            >
              Aplicar Servidor
            </button>
          </div>
        </form>

        <div className="border-t border-slate-100 pt-3">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Sesión de Operador / Admin:
          </label>
          {user ? (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{user.name || user.username}</p>
                <p className="text-[11px] font-mono text-slate-500">
                  Usuario: {user.username} | Rol: <span className="text-red-700 font-bold">{user.role || 'ADMIN'}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold cursor-pointer transition"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <form onSubmit={handleDoLogin} className="space-y-2.5 text-xs">
              {loginError && (
                <div className="p-2 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
                  {loginError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Usuario (ej. admin)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Por defecto: admin / admin123</span>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold cursor-pointer transition"
                >
                  {isLoggingIn ? "Autenticando..." : "Iniciar Sesión"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-end">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

