import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IncidentView, PriorityFilter, StatusFilter } from '../../utils/incident-calculations';

/**
 * Barra de filtros y controles del dashboard: búsqueda, estado, prioridad,
 * alternador de vista y acción de creación. Todo comunica por eventos;
 * no conoce el servicio de datos.
 */
@Component({
  selector: 'app-incident-filters',
  standalone: false,
  templateUrl: './incident-filters.html'
})
export class IncidentFilters {
  @Input() searchQuery = '';
  @Input() statusFilter: StatusFilter = 'ALL';
  @Input() priorityFilter: PriorityFilter = 'ALL';
  @Input() currentView: IncidentView = 'cards';

  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<StatusFilter>();
  @Output() priorityChange = new EventEmitter<PriorityFilter>();
  @Output() viewChange = new EventEmitter<IncidentView>();
  @Output() resetFilters = new EventEmitter<void>();
  @Output() createClick = new EventEmitter<void>();
}
