import React from 'react';

export default function ToolbarFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  viewMode,
  onViewModeChange,
  onOpenCreate
}) {
  return (
    <div className="p-4 lg:p-5 border-b border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-50/50">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input with clear button */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
            search
          </span>
          <input 
            type="text"
            className="w-full pl-9 pr-9 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 shadow-sm transition" 
            id="searchInput" 
            placeholder="Filtrar por ticket, sede, motivo o aula..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600" 
              id="btnClearSearch"
              title="Limpiar búsqueda"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>

        {/* Status segmented buttons */}
        <div className="inline-flex rounded-lg bg-slate-200/70 p-1 border border-slate-200 shrink-0">
          <button 
            type="button"
            onClick={() => onStatusFilterChange('ALL')}
            className={`filter-status-btn px-3 py-1.5 rounded-md text-xs transition ${
              statusFilter === 'ALL'
                ? 'font-semibold bg-white text-slate-900 shadow-xs'
                : 'font-medium text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button 
            type="button"
            onClick={() => onStatusFilterChange('Active')}
            className={`filter-status-btn px-3 py-1.5 rounded-md text-xs transition ${
              statusFilter === 'Active'
                ? 'font-semibold bg-white text-slate-900 shadow-xs'
                : 'font-medium text-slate-600 hover:text-slate-900'
            }`}
          >
            Activos
          </button>
          <button 
            type="button"
            onClick={() => onStatusFilterChange('Inactive')}
            className={`filter-status-btn px-3 py-1.5 rounded-md text-xs transition ${
              statusFilter === 'Inactive'
                ? 'font-semibold bg-white text-slate-900 shadow-xs'
                : 'font-medium text-slate-600 hover:text-slate-900'
            }`}
          >
            Inactivos
          </button>
        </div>

        {/* Priority dropdown */}
        <select 
          id="priorityFilter"
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          className="bg-white border border-slate-200 text-xs font-medium text-slate-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 shadow-sm cursor-pointer"
        >
          <option value="ALL">Todas las prioridades</option>
          <option value="High">Prioridad Alta (High)</option>
          <option value="Medium">Prioridad Media (Medium)</option>
          <option value="Low">Prioridad Baja (Low)</option>
        </select>
      </div>

      <div className="flex items-center gap-2 justify-end shrink-0">
        {/* View toggle (Grid / Table) */}
        <div className="inline-flex rounded-lg bg-slate-200/70 p-1 border border-slate-200">
          <button 
            type="button"
            onClick={() => onViewModeChange('cards')}
            className={`view-toggle-btn p-1.5 rounded-md transition ${
              viewMode === 'cards' 
                ? 'bg-white text-red-700 font-semibold shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="btnViewCards" 
            title="Vista Tarjetas"
          >
            <span className="material-symbols-outlined text-base">grid_view</span>
          </button>
          <button 
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`view-toggle-btn p-1.5 rounded-md transition ${
              viewMode === 'table' 
                ? 'bg-white text-red-700 font-semibold shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="btnViewTable" 
            title="Vista Tabla Operacional"
          >
            <span className="material-symbols-outlined text-base">table_rows</span>
          </button>
        </div>

        {/* Create button */}
        <button 
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8102E] hover:bg-[#a60b24] active:bg-[#8e091e] text-white font-headline-sm text-xs font-bold tracking-wide shadow-sm hover:shadow transition cursor-pointer" 
          id="btnOpenCreate"
        >
          <span className="material-symbols-outlined text-lg leading-none">add_circle</span>
          <span>+ Nuevo Incidente</span>
        </button>
      </div>
    </div>
  );
}

