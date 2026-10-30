export function IncidentFilters({
    canCreateIncident,
    categoryFilter,
    priorityFilter,
    searchQuery,
    setCategoryFilter,
    setPriorityFilter,
    setSearchQuery,
    setShowCreateModal,
    setShowLoginModal,
    setStatusFilter,
    setView,
    statusFilter,
    value,
    view
}) {
  return (
    <>
          {/* Controls & Filters Bar */}
          <section className="w-full mb-4">
            <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:max-w-xs">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">search</span>
                  <input
                    type="text"
                    placeholder="Buscar por ID, título, aula..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-surface-container"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-on-surface-variant hover:text-on-surface">
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  )}
                </div>

                {/* Status Toggle */}
                <div className="w-full sm:w-auto flex items-center bg-surface-container-low rounded-lg p-1 border border-surface-container">
                  {['ALL', 'Active', 'Inactive'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-md text-xs transition ${
                        statusFilter === s
                          ? 'font-semibold bg-surface-container-lowest text-on-surface shadow-sm'
                          : 'font-medium text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {s === 'ALL' ? 'Todos' : s === 'Active' ? 'Activos' : 'Inactivos'}
                    </button>
                  ))}
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto bg-surface-container-low text-xs text-on-surface px-3 py-2 rounded-lg focus:outline-none cursor-pointer border border-surface-container"
                >
                  <option value="ALL">Todas las Categorías</option>
                  <option value="Redes">Redes</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Infraestructura">Infraestructura</option>
                  <option value="General">General</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full sm:w-auto bg-surface-container-low text-xs text-on-surface px-3 py-2 rounded-lg focus:outline-none cursor-pointer border border-surface-container"
                >
                  <option value="ALL">Todas las Prioridades</option>
                  <option value="High">Alta</option>
                  <option value="Medium">Media</option>
                  <option value="Low">Baja</option>
                </select>
              </div>

              {/* View Toggles & Add Button */}
              <div className="flex items-center gap-2 justify-end">
                <div className="flex items-center bg-surface-container-low rounded-lg p-1 border border-surface-container">
                  <button
                    onClick={() => setView('cards')}
                    title="Vista Tarjetas"
                    className={`p-1.5 rounded-md transition ${view === 'cards' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    <span className="material-symbols-outlined text-base">grid_view</span>
                  </button>
                  <button
                    onClick={() => setView('table')}
                    title="Vista Tabla"
                    className={`p-1.5 rounded-md transition ${view === 'table' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    <span className="material-symbols-outlined text-base">format_list_bulleted</span>
                  </button>
                </div>

                {canCreateIncident ? (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-semibold text-sm transition shadow-sm"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    <span>Nuevo Incidente</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-semibold text-sm transition shadow-sm"
                    title="Inicia sesión para registrar incidentes"
                  >
                    <span className="material-symbols-outlined text-lg">login</span>
                    <span>Iniciar sesión</span>
                  </button>
                )}
              </div>
            </div>
          </section>
    </>
  );
}
