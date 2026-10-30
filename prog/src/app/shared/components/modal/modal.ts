import { Component, EventEmitter, Input, Output } from '@angular/core';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

/**
 * Modal genérico y reutilizable: encabezado con icono, cuerpo y pie proyectados.
 * Se cierra con el botón (o clic en el backdrop) y emite `closed`.
 */
@Component({
  selector: 'app-modal',
  standalone: false,
  styleUrl: './modal.css',
  template: `
    <div
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      (click)="onBackdropClick($event)"
    >
      <div
        class="relative w-full max-w-xl rounded-2xl bg-surface-container-lowest shadow-2xl flex flex-col overflow-hidden animate-scale-in"
        [ngClass]="sizeClass"
      >
        <div class="flex items-center justify-between pb-space-sm border-b border-surface-container px-space-lg pt-space-lg">
          <div class="flex items-center gap-space-sm">
            <div class="p-2 rounded-lg" [ngClass]="iconClass">
              <span class="material-symbols-outlined text-xl">{{ icon }}</span>
            </div>
            <div>
              <h2 class="font-headline-md text-headline-md text-on-surface">{{ title }}</h2>
              <p *ngIf="subtitle" class="font-body-sm text-body-sm text-on-surface-variant">{{ subtitle }}</p>
            </div>
          </div>
          <button
            (click)="closed.emit()"
            class="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface transition"
            aria-label="Cerrar ventana"
            type="button"
          >
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <ng-content select="[modal-body]"></ng-content>
        <ng-content select="[modal-footer]"></ng-content>
      </div>
    </div>
  `
})
export class Modal {
  @Input() icon = 'info';
  @Input() iconClass = 'bg-primary-container text-on-primary';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() size: ModalSize = 'xl';
  @Input() closeOnBackdrop = true;

  @Output() closed = new EventEmitter<void>();

  get sizeClass(): string {
    const sizes: Record<ModalSize, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl'
    };
    return sizes[this.size];
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
