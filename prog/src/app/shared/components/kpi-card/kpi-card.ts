import { Component, Input } from '@angular/core';

/**
 * Tarjeta KPI genérica del "bento grid": etiqueta, icono, valor grande,
 * chip opcional, fila de detalle inferior y barra de acento.
 */
@Component({
  selector: 'app-kpi-card',
  standalone: false,
  template: `
    <div
      class="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      <div class="flex items-center justify-between mb-space-xs">
        <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{{ label }}</span>
        <span class="p-1.5 rounded-lg material-symbols-outlined text-base" [ngClass]="iconBgClass">{{ icon }}</span>
      </div>
      <div class="flex items-baseline gap-space-xs">
        <span class="font-display text-display font-bold" [ngClass]="valueClass">{{ value }}</span>
        <span *ngIf="unit" class="font-headline-md text-headline-md font-normal">{{ unit }}</span>
        <span *ngIf="chip" class="font-label-sm text-label-sm font-semibold" [ngClass]="chipClass">{{ chip }}</span>
        <span
          *ngIf="badge"
          class="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm font-semibold"
          [ngClass]="badgeClass"
        >
          {{ badge }}
        </span>
      </div>
      <div class="mt-2 text-body-sm font-body-sm text-on-surface-variant flex items-center justify-between">
        <span>{{ footer }}</span>
        <span *ngIf="footerValue" class="font-semibold" [ngClass]="footerValueClass">{{ footerValue }}</span>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-1" [ngClass]="accentClass"></div>
    </div>
  `
})
export class KpiCard {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) value!: string | number;
  @Input() iconBgClass = 'bg-surface-container text-tertiary';
  @Input() valueClass = 'text-on-surface';
  @Input() unit = '';
  @Input() chip = '';
  @Input() chipClass = '';
  @Input() badge = '';
  @Input() badgeClass = '';
  @Input() footer = '';
  @Input() footerValue = '';
  @Input() footerValueClass = 'text-on-surface';
  @Input() accentClass = 'bg-tertiary';
}
