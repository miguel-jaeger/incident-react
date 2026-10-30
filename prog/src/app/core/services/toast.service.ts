import { Injectable, signal } from '@angular/core';

export interface ToastState {
  show: boolean;
  title: string;
  message: string;
  isSuccess: boolean;
}

const TOAST_DURATION_MS = 3500;

/**
 * Estado global de notificaciones (toast).
 * Cualquier componente puede disparar un aviso sin acoplarse a la vista.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private timer: ReturnType<typeof setTimeout> | null = null;

  readonly state = signal<ToastState>({ show: false, title: '', message: '', isSuccess: true });

  success(title: string, message: string): void {
    this.show({ show: true, title, message, isSuccess: true });
  }

  error(title: string, message: string): void {
    this.show({ show: true, title, message, isSuccess: false });
  }

  dismiss(): void {
    this.clearTimer();
    this.state.update((current) => ({ ...current, show: false }));
  }

  private show(next: ToastState): void {
    this.clearTimer();
    this.state.set(next);
    this.timer = setTimeout(() => {
      this.state.update((current) => ({ ...current, show: false }));
    }, TOAST_DURATION_MS);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
