import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Incident } from '../../../../core/models/incident.model';

/**
 * Tarjeta individual de incidente para la vista "cards".
 * Presentacional: muestra datos y emite acciones hacia arriba (input/output).
 */
@Component({
  selector: 'app-incident-card',
  standalone: false,
  templateUrl: './incident-card.html'
})
export class IncidentCard {
  @Input({ required: true }) incident!: Incident;

  @Output() viewDetail = new EventEmitter<Incident>();
  @Output() editStatus = new EventEmitter<Incident>();
  @Output() delete = new EventEmitter<Incident>();
}
