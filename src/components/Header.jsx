import React from 'react';

const UTP_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/5/50/Utplogonuevo.svg";
const AVATAR_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuA7ri6QyBan5kvQoXffWSwQbWtpq11tvmL9zWOKsEQkkfkdPZwxVVTM4IzPpVO8K6BpVfiFy7U92VnmAFgdYzOIPGKO_0jbBBKQspQ2IG4TWidKi5N6JUAS-Uv7IY-M7_zGJk_FOkUQjC25vMRGtIRjcf31iInSNvU1RvJ5iBOI2M-59PvhTw26CeFGKhqXV438jppB75DcIFm781rkXvks3SERqXE1XaXHDh5ekp4";

export default function Header({ 
  onToggleSidebar,
  onOpenDocs, 
  onOpenProfile,
  onOpenLogin,
  onLogout,
  isOnline = true, 
  apiStatus = 'online',
  user = null,
  notificationsCount = 1
}) {
  const roleBadgeColors = {
    ADMIN: 'bg-red-600 text-white',
    SUPERVISOR: 'bg-amber-500 text-white',
    OPERATOR: 'bg-sky-600 text-white',
    SUPPORT: 'bg-purple-600 text-white'
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Campus context */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Sidebar Toggle Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            title="Abrir o colapsar navegación lateral"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>

          <div className="flex items-center gap-3 shrink-0">
            <div className="h-9 w-auto flex items-center">
              <img 
                src={UTP_LOGO_URL} 
                alt="Logo UTP" 
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/favicon.svg";
                }}
              />
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Mesa de Incidentes UTP
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-100 text-red-700 tracking-wider">
                  34998
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                Centro de Operaciones de Red & Campus TI
              </span>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-600 border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-700">Sede Central Lima</span>
            <span className="text-slate-400">•</span>
            <span className="font-mono text-slate-500 text-[11px]">NOC-CLUSTER-01</span>
          </div>
        </div>

        {/* Status indicators & Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Swagger / OAS 3.0 Live status indicator */}
          <div 
            className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              isOnline 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
            title={isOnline ? "Backend conectado y saludable" : "Servidor en espera o despertando..."}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOnline ? 'bg-emerald-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isOnline ? 'bg-emerald-500' : 'bg-amber-500'
              }`}></span>
            </span>
            <span className="font-mono tracking-tight font-semibold">
              Swagger OAS 3.0 • {isOnline ? 'Online' : 'Conectando'}
            </span>
            <span className={isOnline ? "text-emerald-300" : "text-amber-300"}>|</span>
            <span className={`text-[11px] ${isOnline ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isOnline ? '200 OK' : 'Waking...'}
            </span>
          </div>

          {/* Schemas & Docs button */}
          <button 
            type="button"
            onClick={onOpenDocs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200 cursor-pointer" 
            id="btnOpenDocs" 
            title="Documentación de la API"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-600">code</span>
            <span className="hidden md:inline">Schemas & Docs</span>
          </button>

          {/* Notifications button */}
          <button 
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition cursor-pointer" 
            title="Configuración & Telemetría" 
            type="button"
            onClick={onOpenProfile}
          >
            <span className="material-symbols-outlined text-xl">tune</span>
          </button>

          <div className="h-6 w-px bg-slate-200"></div>

          {/* User profile capsule OR Iniciar Sesión */}
          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <button 
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-2 text-left rounded-lg p-1 hover:bg-slate-50 transition cursor-pointer"
                title="Ver sesión y cambiar servidor"
              >
                <img 
                  alt="Avatar Usuario" 
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" 
                  src={AVATAR_URL}
                />
                <div className="hidden md:flex flex-col text-left leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-800">
                      {user.name || user.username}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${roleBadgeColors[user.role] || 'bg-slate-700 text-white'}`}>
                      {user.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    @{user.username}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                title="Cerrar sesión"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8102E] hover:bg-[#a60b24] text-white text-xs font-bold font-headline-sm transition shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
