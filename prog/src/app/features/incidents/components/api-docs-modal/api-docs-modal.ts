import { Component, EventEmitter, Output } from '@angular/core';

interface ApiEndpointDoc {
  method: string;
  methodClass: string;
  path: string;
  response: string;
  description: string;
  example?: string;
}

const API_ENDPOINTS: ApiEndpointDoc[] = [
  {
    method: 'GET',
    methodClass: 'bg-sky-600 text-white',
    path: '/api/incidents',
    response: '200 OK Array<Incident>',
    description: 'Obtiene el listado completo de incidencias reportadas en sedes UTP.'
  },
  {
    method: 'POST',
    methodClass: 'bg-emerald-600 text-white',
    path: '/api/incidents',
    response: '201 Created',
    description: 'Crea un nuevo ticket asignando título, descripción, prioridad y estado inicial.',
    example: `{
  "title": "Falla Switch Core Pabellón C",
  "description": "Pérdida de conectividad intermitente",
  "priority": "High",
  "status": "Active"
}`
  },
  {
    method: 'PATCH',
    methodClass: 'bg-amber-500 text-white',
    path: '/api/incidents/{id}/status',
    response: '200 OK',
    description: 'Alterna o actualiza el estado (Active / Inactive) e incluye motivo de resolución o rechazo.'
  },
  {
    method: 'GET',
    methodClass: 'bg-sky-600 text-white',
    path: '/api/incidents/{id}',
    response: '200 OK Incident',
    description: 'Obtiene el objeto detallado del incidente por su identificador numérico.'
  },
  {
    method: 'DELETE',
    methodClass: 'bg-red-600 text-white',
    path: '/api/incidents/{id}',
    response: '204 No Content',
    description: 'Elimina permanentemente el registro del servidor central.'
  }
];

/**
 * Documentación visual de endpoints del backend (Swagger/OpenAPI).
 * 100% presentacional: los datos viven en esta constante.
 */
@Component({
  selector: 'app-api-docs-modal',
  standalone: false,
  template: `
    <app-modal
      icon="api"
      iconClass="bg-primary-container text-on-primary"
      title="Endpoints UTP incident-controller"
      subtitle="Host: https://api-incident.onrender.com | OpenAPI Specification 3.0"
      size="3xl"
      [closeOnBackdrop]="false"
      (closed)="closed.emit()"
    >
      <div modal-body class="flex-1 overflow-y-auto py-space-md space-y-3 px-space-lg">
        <div *ngFor="let endpoint of endpoints" class="rounded-xl bg-surface-container-low p-space-md flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded font-label-sm text-label-sm font-bold" [ngClass]="endpoint.methodClass">
                {{ endpoint.method }}
              </span>
              <code class="font-mono text-body-sm text-on-surface font-semibold">{{ endpoint.path }}</code>
            </div>
            <span class="font-label-sm text-label-sm text-emerald-600 font-medium">{{ endpoint.response }}</span>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant">{{ endpoint.description }}</p>
          <pre *ngIf="endpoint.example" class="bg-surface-container-highest p-2 rounded-lg text-label-sm font-mono text-on-surface overflow-x-auto">{{ endpoint.example }}</pre>
        </div>
      </div>

      <div modal-footer class="pt-space-md border-t border-surface-container flex justify-end px-space-lg py-space-md">
        <button
          (click)="closed.emit()"
          class="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition"
          type="button"
        >
          Entendido
        </button>
      </div>
    </app-modal>
  `
})
export class ApiDocsModal {
  readonly endpoints = API_ENDPOINTS;

  @Output() closed = new EventEmitter<void>();
}
