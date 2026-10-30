import { Component, EventEmitter, Output } from '@angular/core';
import { Incident } from '../../../../core/models/incident.model';
import { createIncidentDraft } from '../../utils/incident-calculations';

/**
 * Modal de registro de incidente (POST /api/incidents).
 * Valida sus propios campos y emite el payload listo para el servicio.
 */
@Component({
  selector: 'app-create-incident-modal',
  standalone: false,
  template: `
    <app-modal
      icon="add_alert"
      iconClass="bg-primary-container text-on-primary"
      title="Registrar Incidente TI"
      subtitle="POST /api/incidents • Mesa de Servicio UTP"
      size="xl"
      (closed)="closed.emit()"
    >
      <div modal-body class="py-space-md space-y-space-md px-space-lg">
        <div *ngIf="formError" class="rounded-lg bg-error-container text-on-error-container px-3 py-2 text-body-sm font-body-sm flex items-center gap-2">
          <span class="material-symbols-outlined text-base">error</span>
          {{ formError }}
        </div>

        <form (ngSubmit)="submit()" class="space-y-space-md" novalidate>
          <div>
            <label class="block font-label-md text-label-md text-on-surface mb-1" for="newTitle">
              Título del Incidente <span class="text-primary">*</span>
            </label>
            <input
              class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
              id="newTitle"
              name="newTitle"
              [(ngModel)]="form.title"
              placeholder="ej. Caída de Access Point - Piso 4 Torre Arequipa"
              required
              type="text"
            />
          </div>

          <div>
            <label class="block font-label-md text-label-md text-on-surface mb-1" for="newDescription">
              Descripción Técnica <span class="text-primary">*</span>
            </label>
            <textarea
              class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
              id="newDescription"
              name="newDescription"
              [(ngModel)]="form.description"
              placeholder="Detalles del fallo de conectividad, equipos afectados o usuarios impactados..."
              required
              rows="3"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label class="block font-label-md text-label-md text-on-surface mb-1" for="newPriority">Nivel de Prioridad</label>
              <select
                class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-body-md font-body-md text-on-surface focus:outline-none cursor-pointer"
                id="newPriority"
                name="newPriority"
                [(ngModel)]="form.priority"
              >
                <option value="High">High (Crítico - Afecta Clases)</option>
                <option value="Medium">Medium (Parcial / En espera)</option>
                <option value="Low">Low (Consulta / Mantenimiento)</option>
              </select>
            </div>
            <div>
              <label class="block font-label-md text-label-md text-on-surface mb-1" for="newStatus">Estado Inicial</label>
              <select
                class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-body-md font-body-md text-on-surface focus:outline-none cursor-pointer"
                id="newStatus"
                name="newStatus"
                [(ngModel)]="form.status"
              >
                <option value="Active">Active (En atención)</option>
                <option value="Inactive">Inactive (Resuelto / Cerrado)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-label-md text-label-md text-on-surface mb-1" for="newLocation">Sede / Ubicación UTP</label>
            <input
              class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
              id="newLocation"
              name="newLocation"
              [(ngModel)]="form.location"
              placeholder="ej. Lima Centro - Pabellón B, Aula 502"
              type="text"
            />
          </div>

          <div class="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant">
            <span>Payload JSON validado con Schema Incident</span>
            <span class="font-mono text-tertiary">Content-Type: application/json</span>
          </div>
        </form>
      </div>

      <div
        modal-footer
        class="pt-space-sm border-t border-surface-container flex items-center justify-end gap-space-sm px-space-lg py-space-md"
      >
        <button
          (click)="closed.emit()"
          class="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition"
          type="button"
        >
          Cancelar
        </button>
        <button
          (click)="submit()"
          class="px-5 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-md transition active:scale-95"
          type="submit"
        >
          Enviar POST Ticket
        </button>
      </div>
    </app-modal>
  `
})
export class CreateIncidentModal {
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Partial<Incident>>();

  form: Partial<Incident> = createIncidentDraft();
  formError = '';

  submit(): void {
    if (!this.form.title?.trim() || !this.form.description?.trim()) {
      this.formError = 'Complete los campos obligatorios: Título y Descripción.';
      return;
    }
    this.formError = '';
    this.saved.emit(this.form);
  }
}
