import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Incident } from '../../../../core/models/incident.model';

export interface StatusUpdatePayload {
  id: number;
  status: string;
  message: string;
}

/**
 * Modal de actualización de estado (PATCH /api/incidents/{id}/status).
 * Recibe el incidente seleccionado y emite el payload del cambio.
 */
@Component({
  selector: 'app-status-modal',
  standalone: false,
  template: `
    <app-modal
      icon="edit_note"
      iconClass="bg-amber-500/10 text-amber-600"
      title="Actualizar Estado"
      [subtitle]="'PATCH /api/incidents/' + (incident.id || 0) + '/status'"
      size="lg"
      (closed)="closed.emit()"
    >
      <div modal-body class="py-space-md space-y-space-md px-space-lg">
        <form id="patchStatusForm" (ngSubmit)="submit()" class="space-y-space-md">
          <div>
            <span class="block font-label-md text-label-md text-on-surface mb-2">Seleccionar Nuevo Estado</span>
            <div class="grid grid-cols-2 gap-space-sm">
              <label
                class="cursor-pointer flex items-center gap-2 p-3 rounded-xl bg-surface-container-low has-[:checked]:bg-emerald-500/10 has-[:checked]:text-emerald-700 transition"
              >
                <input
                  class="accent-emerald-600"
                  name="targetStatus"
                  type="radio"
                  value="Active"
                  [(ngModel)]="form.status"
                />
                <div class="flex flex-col">
                  <span class="font-label-lg text-label-lg font-semibold">Active</span>
                  <span class="font-body-sm text-body-sm text-on-surface-variant">En curso / Técnico asignado</span>
                </div>
              </label>
              <label
                class="cursor-pointer flex items-center gap-2 p-3 rounded-xl bg-surface-container-low has-[:checked]:bg-surface-container-highest has-[:checked]:text-on-surface transition"
              >
                <input
                  class="accent-slate-700"
                  name="targetStatus"
                  type="radio"
                  value="Inactive"
                  [(ngModel)]="form.status"
                />
                <div class="flex flex-col">
                  <span class="font-label-lg text-label-lg font-semibold">Inactive</span>
                  <span class="font-body-sm text-body-sm text-on-surface-variant">Solucionado / Cerrado</span>
                </div>
              </label>
            </div>
          </div>
          <div>
            <label class="block font-label-md text-label-md text-on-surface mb-1" for="patchReason">
              Razones del rechazo / Notas de resolución
            </label>
            <textarea
              class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-amber-500/20"
              id="patchReason"
              name="patchReason"
              rows="3"
              [(ngModel)]="form.message"
            ></textarea>
          </div>
        </form>
      </div>

      <div modal-footer class="pt-space-sm border-t border-surface-container flex items-center justify-end gap-space-sm px-space-lg py-space-md">
        <button
          (click)="closed.emit()"
          class="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition"
          type="button"
        >
          Cancelar
        </button>
        <button
          (click)="submit()"
          class="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-label-lg text-label-lg shadow-md transition active:scale-95"
          type="submit"
        >
          Ejecutar PATCH
        </button>
      </div>
    </app-modal>
  `
})
export class StatusModal implements OnChanges {
  @Input({ required: true }) incident!: Incident;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<StatusUpdatePayload>();

  form = { status: 'Active', message: '' };

  ngOnChanges(): void {
    this.form = {
      status: this.incident.status,
      message: this.incident.message || ''
    };
  }

  submit(): void {
    this.saved.emit({
      id: this.incident.id || 0,
      status: this.form.status,
      message: this.form.message
    });
  }
}
