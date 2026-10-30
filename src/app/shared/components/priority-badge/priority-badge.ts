import { Component, Input } from '@angular/core';

/**
 * Badge visual de la prioridad del ticket (High/Medium/Low).
 */
@Component({
  selector: 'app-priority-badge',
  standalone: false,
  template: `
    <span
      *ngIf="priority === 'High'"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm font-bold bg-primary-container text-on-primary"
    >
      High
    </span>
    <span
      *ngIf="priority === 'Medium'"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm font-bold bg-amber-500 text-white"
    >
      Medium
    </span>
    <span
      *ngIf="priority !== 'High' && priority !== 'Medium'"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm font-bold bg-sky-600 text-white"
    >
      {{ priority || 'Low' }}
    </span>
  `
})
export class PriorityBadge {
  @Input({ required: true }) priority!: string;
}
