import { Pipe, PipeTransform } from '@angular/core';
import { Incident } from '../../core/models/incident.model';

/**
 * Genera el código visible del ticket: usa `ticketCode` del backend
 * o lo aproxima a partir del id (INC-1041, INC-1042, ...).
 */
@Pipe({ name: 'appTicketCode', standalone: false })
export class TicketCodePipe implements PipeTransform {
  transform(incident?: Incident | null): string {
    if (!incident) return 'INC-000';
    return incident.ticketCode || `INC-${1040 + (incident.id || 0)}`;
  }
}
