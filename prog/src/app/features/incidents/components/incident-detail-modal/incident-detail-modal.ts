import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Incident } from '../../../../core/models/incident.model';

/**
 * Modal de detalle extendido (GET /api/incidents/{id}).
 * La página realiza el fetch y expone el incidente fresco como input.
 */
@Component({
  selector: 'app-incident-detail-modal',
  standalone: false,
  template: `
    <app-modal
      icon="info"
      iconClass="bg-tertiary-fixed text-on-tertiary-fixed-variant"
      [title]="'Ticket #' + (incident | appTicketCode)"
      [subtitle]="
        'Detalle inspeccionado vía GET /api/incidents/' + (incident?.id ?? '')
      "
      size="xl"
      (closed)="closed.emit()"
    >
      <div modal-body class="py-space-md space-y-space-md overflow-y-auto max-h-[70vh] px-space-lg">
        <div *ngIf="isLoading" class="flex items-center justify-center py-4 text-primary">
          <span class="material-symbols-outlined animate-spin text-2xl mr-2">sync</span>
          <span class="text-body-sm">Obteniendo metadatos completos del servidor...</span>
        </div>

        <div>
          <span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Título</span>
          <h3 class="font-headline-sm text-headline-sm text-on-surface mt-0.5">{{ incident?.title }}</h3>
        </div>

        <div>
          <span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Descripción</span>
          <p class="font-body-md text-body-md text-on-surface mt-0.5 p-3 rounded-lg bg-surface-container-low">
            {{ incident?.description }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-space-md">
          <div>
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Estado Actual</span>
            <div class="mt-1">
              <app-status-badge [status]="incident?.status || 'Unknown'"></app-status-badge>
            </div>
          </div>
          <div>
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Nivel de Prioridad</span>
            <div class="mt-1">
              <app-priority-badge [priority]="incident?.priority || 'Low'"></app-priority-badge>
            </div>
          </div>
        </div>

        <div>
          <span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Razones del rechazo / Notas</span>
          <p class="font-body-md text-body-md text-on-surface mt-0.5 p-3 rounded-lg bg-surface-container-low">
            {{ incident?.message || 'Ninguna registrada' }}
          </p>
        </div>

        <div class="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 text-label-sm font-label-sm text-on-surface-variant">
          <span>Created: {{ incident?.createdAt | appDate }}</span>
          <span>Ubicación: {{ incident?.location || 'Sede Campus UTP' }}</span>
          <span *ngIf="incident?.category">Categoría: {{ incident?.category }}</span>
          <span *ngIf="incident?.severity">Severidad: {{ incident?.severity }}</span>
        </div>
      </div>

      <div modal-footer class="pt-space-sm border-t border-surface-container flex justify-end px-space-lg py-space-md">
        <button
          (click)="closed.emit()"
          class="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition"
          type="button"
        >
          Cerrar Detalle
        </button>
      </div>
    </app-modal>
  `
})
export class IncidentDetailModal {
  @Input() incident: Incident | null = null;
  @Input() isLoading = false;

  @Output() closed = new EventEmitter<void>();
}
