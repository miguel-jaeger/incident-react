import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Incident } from '../../../../core/models/incident.model';

/**
 * Vista tabular compacta de incidentes (alternativa a las cards).
 * Presentacional: recibe la lista y emite acciones.
 */
@Component({
  selector: 'app-incident-table',
  standalone: false,
  templateUrl: './incident-table.html'
})
export class IncidentTable {
  @Input({ required: true }) incidents!: Incident[];

  @Output() viewDetail = new EventEmitter<Incident>();
  @Output() editStatus = new EventEmitter<Incident>();
  @Output() delete = new EventEmitter<Incident>();
}
