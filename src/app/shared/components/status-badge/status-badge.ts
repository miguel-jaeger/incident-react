import { Component, Input } from '@angular/core';

/**
 * Badge visual del estado del ticket (Active = verde pulsante, Inactive = neutro).
 */
@Component({
  selector: 'app-status-badge',
  standalone: false,
  template: `
    <span
      *ngIf="status === 'Active'"
      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-label-sm font-semibold bg-emerald-100 text-emerald-800"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
      Active
    </span>
    <span
      *ngIf="status !== 'Active'"
      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-label-sm font-semibold bg-surface-container text-on-surface-variant"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-outline"></span>
      {{ status }}
    </span>
  `
})
export class StatusBadge {
  @Input({ required: true }) status!: string;
}
