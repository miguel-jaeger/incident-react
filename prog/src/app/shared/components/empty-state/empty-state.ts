import { Component, Input } from '@angular/core';

/**
 * Estado vacío reutilizable. El botón de acción se proyecta desde el padre
 * mediante el slot `[empty-state-action]`.
 */
@Component({
  selector: 'app-empty-state',
  standalone: false,
  template: `
    <div class="py-16 flex flex-col items-center justify-center text-center">
      <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
        <span class="material-symbols-outlined text-3xl">{{ icon }}</span>
      </div>
      <h3 class="font-headline-md text-headline-md text-on-surface mb-1">{{ title }}</h3>
      <p class="font-body-md text-body-md text-on-surface-variant max-w-sm mb-4">{{ description }}</p>
      <ng-content select="[empty-state-action]"></ng-content>
    </div>
  `
})
export class EmptyState {
  @Input() icon = 'inbox';
  @Input() title = 'Sin resultados';
  @Input() description = 'No se hallaron registros que coincidan con los filtros aplicados.';
}
