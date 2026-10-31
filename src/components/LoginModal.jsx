import React, { useState } from 'react';

export const PREDEFINED_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Admin TI UTP',
    role: 'ADMIN',
    badgeColor: 'bg-red-600 text-white',
    description: 'Control total: Crear, Cambiar estado/prioridad, Eliminar incidentes y Administrar usuarios.',
    icon: 'admin_panel_settings',
    permissions: ['Crear Tickets', 'Cambiar Estado', 'Eliminar', 'Gestión Usuarios']
  },
  {
    username: 'supervisor',
    password: 'utp2025',
    name: 'Docente Miguel Jaeger',
    role: 'SUPERVISOR',
    badgeColor: 'bg-amber-500 text-white',
    description: 'Supervisión NOC: Crear tickets, Supervisión de red, Telemetría y Métricas.',
    icon: 'visibility',
    permissions: ['Crear Tickets', 'Telemetría', 'Métricas NOC']
  },
  {
    username: 'operador',
    password: 'operador123',
    name: 'Operador NOC Campus',
    role: 'OPERATOR',
    badgeColor: 'bg-sky-600 text-white',
    description: 'Operación campus: Registro de incidencias, seguimiento de fallas y aulas.',
    icon: 'support_agent',
    permissions: ['Crear Tickets', 'Reportes de Fallas']
  },
  {
    username: 'utp',
    password: 'utp2025',
    name: 'Mesa de Ayuda UTP',
    role: 'SUPPORT',
    badgeColor: 'bg-purple-600 text-white',
    description: 'Soporte TI: Atención a usuarios, recepción de requerimientos técnicos.',
    icon: 'help_center',
    permissions: ['Crear Tickets', 'Consultas']
  }
];

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
  isLoggingIn = false,
  error = '',
  initialMessage = ''
}) {
  const [selectedUser, setSelectedUser] = useState(PREDEFINED_USERS[0]);
  const [username, setUsername] = useState(PREDEFINED_USERS[0].username);
  const [password, setPassword] = useState(PREDEFINED_USERS[0].password);
  const [isManual, setIsManual] = useState(false);

  if (!isOpen) return null;

  const handleSelectRole = (userOption) => {
    setSelectedUser(userOption);
    setUsername(userOption.username);
    setPassword(userOption.password);
    setIsManual(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    onLogin(username.trim(), password);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C8102E] text-white">
              <span className="material-symbols-outlined text-xl">vpn_key</span>
            </div>
            <div>
              <h2 className="font-headline-md text-base font-bold text-slate-900">
                Iniciar Sesión por Roles TI
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Autenticación UTP contra SQLite (POST /api/auth/login)
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

        {/* Initial info message if any */}
        {initialMessage && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-amber-600">info</span>
            <span>{initialMessage}</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-red-600">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* 1. Selector de usuario / rol rápido */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Selecciona un Usuario y Rol para ingresar rápidamente:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PREDEFINED_USERS.map((item) => {
              const isChosen = !isManual && selectedUser.username === item.username;

              return (
                <div
                  key={item.username}
                  onClick={() => handleSelectRole(item)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isChosen
                      ? 'border-[#C8102E] bg-red-50/60 shadow-xs ring-1 ring-[#C8102E]/30'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-lg ${isChosen ? 'text-[#C8102E]' : 'text-slate-500'}`}>
                        {item.icon}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{item.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${item.badgeColor}`}>
                      {item.role}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-tight">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[10px] font-mono text-slate-400">
                    <span>user: <strong className="text-slate-700">{item.username}</strong></span>
                    <span>pass: <strong className="text-slate-700">{item.password}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Formulario de credenciales editable */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Credenciales del formulario</span>
            <button
              type="button"
              onClick={() => setIsManual(true)}
              className="text-[11px] text-slate-500 hover:text-red-700 underline cursor-pointer"
            >
              Ingresar credenciales personalizadas
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Usuario o Correo
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setIsManual(true);
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                placeholder="ej. admin"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIsManual(true);
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                placeholder="Contraseña"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer transition text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="px-5 py-2 rounded-lg bg-[#C8102E] hover:bg-[#a60b24] text-white font-headline-sm font-bold shadow transition cursor-pointer text-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>{isLoggingIn ? "Autenticando..." : `Ingresar como ${!isManual ? selectedUser.role : username}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
