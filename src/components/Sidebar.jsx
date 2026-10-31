import React from 'react';

const UTP_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/5/50/Utplogonuevo.svg";

export default function Sidebar({
  currentView = 'incidents',
  onSelectView,
  isOpen = true,
  isMobileOpen = false,
  onCloseMobile,
  onToggleCollapse,
  user = null,
  onOpenLogin,
  onLogout,
  stats = { total: 0, active: 0, high: 0 }
}) {
  const roleBadgeColors = {
    ADMIN: 'bg-red-600 text-white',
    SUPERVISOR: 'bg-amber-500 text-white',
    OPERATOR: 'bg-sky-600 text-white',
    SUPPORT: 'bg-purple-600 text-white'
  };

  const navItems = [
    {
      id: 'incidents',
      label: 'Mesa de Incidentes',
      shortLabel: 'Incidentes',
      icon: 'confirmation_number',
      badge: stats.active > 0 ? stats.active : stats.total,
      badgeColor: 'bg-red-100 text-red-700 font-bold'
    },
    {
      id: 'metrics',
      label: 'Telemetría & KPIs',
      shortLabel: 'Métricas',
      icon: 'monitoring',
      badge: `${stats.high} crít`,
      badgeColor: stats.high > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
    },
    {
      id: 'users',
      label: 'Gestión de Usuarios',
      shortLabel: 'Usuarios',
      icon: 'manage_accounts',
      badge: user?.role === 'ADMIN' ? 'ADMIN' : 'Solo ADMIN',
      badgeColor: user?.role === 'ADMIN' ? 'bg-red-600 text-white font-mono text-[9px]' : 'bg-slate-200 text-slate-600 font-mono text-[9px]'
    },
    {
      id: 'docs',
      label: 'Contrato OpenAPI 3.0',
      shortLabel: 'Docs API',
      icon: 'code',
      badge: 'v1.0',
      badgeColor: 'bg-emerald-100 text-emerald-800 font-mono text-[10px]'
    },
    {
      id: 'settings',
      label: 'Configuración NOC',
      shortLabel: 'Ajustes',
      icon: 'tune'
    }
  ];

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="h-16 border-b border-slate-100 px-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <img 
                src={UTP_LOGO_URL} 
                alt="UTP" 
                className="h-7 w-auto object-contain shrink-0"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/favicon.svg";
                }}
              />
              {isOpen && (
                <div className="flex flex-col leading-tight truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-xs font-bold text-slate-900 tracking-tight truncate">
                      NOC Campus
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-red-100 text-red-700">
                      34998
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    Mesa TI • Sede Lima
                  </span>
                </div>
              )}
            </div>

            {/* Close button for mobile */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              title="Cerrar barra lateral"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-1">
            {isOpen && (
              <span className="px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Navegación del Sistema
              </span>
            )}

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectView(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    title={!isOpen ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition group cursor-pointer ${
                      isActive
                        ? 'bg-red-50 text-red-700 font-bold border-l-4 border-[#C8102E] shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`material-symbols-outlined text-xl shrink-0 transition ${
                        isActive ? 'text-[#C8102E]' : 'text-slate-400 group-hover:text-slate-600'
                      }`}>
                        {item.icon}
                      </span>
                      {isOpen && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {isOpen && item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] shrink-0 ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Dot indicator when collapsed */}
                    {!isOpen && isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] absolute right-2"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section: User status & collapse toggle */}
        <div className="border-t border-slate-100 p-3 space-y-2">
          {user ? (
            <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-2 ${!isOpen ? 'items-center' : ''}`}>
              <div className="flex items-center gap-2.5 w-full overflow-hidden">
                <div className="relative shrink-0">
                  <span className="material-symbols-outlined text-slate-600 text-2xl">
                    account_circle
                  </span>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>
                {isOpen && (
                  <div className="flex flex-col text-left leading-tight truncate flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {user.name || user.username}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${roleBadgeColors[user.role] || 'bg-slate-700 text-white'}`}>
                        {user.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono truncate">
                      @{user.username}
                    </span>
                  </div>
                )}
              </div>

              {isOpen && (
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200/50">
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="flex-1 py-1 px-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] text-slate-700 font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                    title="Cambiar de usuario o rol"
                  >
                    <span className="material-symbols-outlined text-sm">switch_account</span>
                    <span>Cambiar</span>
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="py-1 px-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                    title="Cerrar sesión"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span>Salir</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className={`w-full py-2.5 px-3 rounded-xl bg-[#C8102E] hover:bg-[#a60b24] text-white font-headline-sm text-xs font-bold shadow transition cursor-pointer flex items-center justify-center gap-2 ${
                !isOpen ? 'p-2' : ''
              }`}
              title="Iniciar Sesión"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              {isOpen && <span>Iniciar Sesión</span>}
            </button>
          )}

          {/* Collapse/Expand Toggle on Desktop */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-center gap-2 py-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs font-medium transition cursor-pointer"
            title={isOpen ? "Colapsar barra lateral" : "Expandir barra lateral"}
          >
            <span className="material-symbols-outlined text-lg">
              {isOpen ? 'first_page' : 'last_page'}
            </span>
            {isOpen && <span className="text-[11px] font-mono">Minimizar menú</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
