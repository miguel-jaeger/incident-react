import { Component } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

/**
 * Notificación flotante global (toast). Se alimenta de ToastService, por lo que
 * puede vivir en el shell y servir a toda la aplicación.
 */
@Component({
  selector: 'app-toast',
  standalone: false,
  template: `
    <div
      class="fixed top-20 right-6 z-[60] transform transition-all duration-300 pointer-events-none flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-lowest shadow-xl max-w-md ring-1 ring-surface-container-high"
      [class.translate-x-0]="toastService.state().show"
      [class.opacity-100]="toastService.state().show"
      [class.translate-x-full]="!toastService.state().show"
      [class.opacity-0]="!toastService.state().show"
      role="status"
      aria-live="polite"
    >
      <div
        class="p-2 rounded-lg flex items-center justify-center"
        [ngClass]="toastService.state().isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
      >
        <span class="material-symbols-outlined text-xl">
          {{ toastService.state().isSuccess ? 'check_circle' : 'cancel' }}
        </span>
      </div>
      <div class="flex flex-col">
        <span class="font-headline-sm text-headline-sm text-on-surface">{{ toastService.state().title }}</span>
        <span class="font-body-sm text-body-sm text-on-surface-variant">{{ toastService.state().message }}</span>
      </div>
    </div>
  `
})
export class Toast {
  constructor(protected readonly toastService: ToastService) {}
}
