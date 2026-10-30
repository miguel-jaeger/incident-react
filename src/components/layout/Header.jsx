import { ROLE_LABELS } from '../../lib/labels';
export function Header({
    activeView,
    handleLogout,
    handleOpenProfile,
    isAdmin,
    isOnline,
    loadData,
    setActiveView,
    setShowDocsModal,
    setShowHostModal,
    user
}) {
  return (
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-3 shrink-0">
              <img alt="UTP" className="h-9 w-auto object-contain" src="https://upload.wikimedia.org/wikipedia/commons/5/50/Utplogonuevo.svg" />
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-sm sm:text-base font-bold text-slate-900 tracking-tight">Mesa de Incidentes UTP</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-100 text-red-700 tracking-wider">34998</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">Centro de Operaciones de Red & Campus TI</span>
              </div>
            </div>
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-600 border border-slate-200/80">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="font-medium text-slate-700">Sede Central Lima</span>
              <span className="text-slate-400">•</span>
              <span className="font-mono text-slate-500 text-[11px]">NOC-CLUSTER-01</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden md:flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setActiveView('incidents')}
                className={`px-2.5 py-1.5 rounded-md text-xs transition flex items-center gap-1 ${activeView === 'incidents' ? 'bg-white text-[#C8102E] font-semibold shadow-sm' : 'font-medium text-slate-600 hover:text-slate-900'}`}
              >
                <span className="material-symbols-outlined text-base">confirmation_number</span>
                Incidentes
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveView('users')}
                  className={`px-2.5 py-1.5 rounded-md text-xs transition flex items-center gap-1 ${activeView === 'users' ? 'bg-white text-[#C8102E] font-semibold shadow-sm' : 'font-medium text-slate-600 hover:text-slate-900'}`}
                >
                  <span className="material-symbols-outlined text-base">manage_accounts</span>
                  Usuarios
                </button>
              )}
            </nav>
            <button
              type="button"
              onClick={() => setShowDocsModal(true)}
              title="Documentación de la API"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200"
            >
              <span className="material-symbols-outlined text-[17px]">code</span>
              <span className="hidden lg:inline">Schemas & Docs</span>
            </button>
            <button onClick={loadData} title="Sincronizar" className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition">
              <span className="material-symbols-outlined text-xl">sync</span>
            </button>
            <button onClick={() => setShowHostModal(true)} title="Cambiar servidor" className="hidden sm:inline-flex p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition">
              <span className="material-symbols-outlined text-xl">dns</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <button
              type="button"
              onClick={handleOpenProfile}
              title={user ? 'Ver mi perfil' : 'Iniciar sesión'}
              className="flex items-center gap-2.5 bg-transparent"
            >
              <div className="w-8 h-8 rounded-lg bg-[#C8102E] text-white flex items-center justify-center font-bold text-sm ring-1 ring-slate-200">
                {user ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="hidden md:flex flex-col text-left leading-tight">
                <span className="text-xs font-semibold text-slate-800">{user ? user.name : 'Iniciar sesión'}</span>
                <span className="text-[10px] text-slate-400 font-mono">{user ? (ROLE_LABELS[String(user.role || '').toUpperCase()] || user.role) : 'No autenticado'}</span>
              </div>
            </button>
            {user && (
              <button onClick={handleLogout} title="Cerrar sesión" className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition">
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            )}
          </div>
        </div>
        <div className="md:hidden border-t border-slate-100 px-4 py-2 flex gap-2">
          <button onClick={() => setActiveView('incidents')} className={`flex-1 py-1.5 rounded-md text-xs font-semibold ${activeView === 'incidents' ? 'bg-red-50 text-[#C8102E]' : 'text-slate-600'}`}>Incidentes</button>
          {isAdmin && (
            <button onClick={() => setActiveView('users')} className={`flex-1 py-1.5 rounded-md text-xs font-semibold ${activeView === 'users' ? 'bg-red-50 text-[#C8102E]' : 'text-slate-600'}`}>Usuarios</button>
          )}
        </div>
      </header>
  );
}
