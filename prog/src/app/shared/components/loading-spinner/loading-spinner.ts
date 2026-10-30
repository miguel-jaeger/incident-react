import { Component, Input } from '@angular/core';

/**
 * Indicador de carga reutilizable con spinner Material y texto descriptivo.
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  template: `
    <div class="flex flex-col items-center justify-center py-16 text-on-surface-variant">
      <span class="material-symbols-outlined text-4xl animate-spin text-primary mb-2">sync</span>
      <span class="font-body-md" *ngIf="label">{{ label }}</span>
      <ng-content></ng-content>
    </div>
  `
})
export class LoadingSpinner {
  @Input() label = 'Cargando...';
}
