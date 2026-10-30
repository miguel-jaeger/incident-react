import { Component, Input } from '@angular/core';
import { IncidentStats } from '../../utils/incident-calculations';

/**
 * Deck de KPIs del dashboard: compone cinco tarjetas métricas.
 * Componente presentacional: recibe `stats` y no conoce el API.
 */
@Component({
  selector: 'app-kpi-deck',
  standalone: false,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
      <!-- Total Tickets -->
      <app-kpi-card
        label="Total Incidentes"
        icon="dataset"
        [value]="stats.total"
        chip="GET /api/incidents"
        chipClass="text-emerald-600 font-medium"
        footer="Sincronizados en memoria"
        footerValue="100%"
        accentClass="bg-gradient-to-r from-tertiary to-tertiary-container"
      ></app-kpi-card>

      <!-- Active / Attention -->
      <app-kpi-card
        label="Activos / En Atención"
        icon="radio_button_checked"
        iconBgClass="bg-emerald-100 text-emerald-700"
        [value]="stats.active"
        badge="Active"
        badgeClass="bg-emerald-50 text-emerald-700"
        footer="Requieren acción técnica"
        [footerValue]="stats.activePercentage + '%'"
        footerValueClass="text-emerald-700"
        accentClass="bg-emerald-500"
      ></app-kpi-card>

      <!-- Inactive / Closed -->
      <app-kpi-card
        label="Inactivos / Resueltos"
        icon="task_alt"
        iconBgClass="bg-surface-container text-outline"
        [value]="stats.inactive"
        badge="Inactive"
        badgeClass="bg-surface-container text-on-surface-variant"
        footer="Tickets archivados"
        [footerValue]="stats.inactivePercentage + '%'"
        footerValueClass="text-on-surface"
        accentClass="bg-outline"
      ></app-kpi-card>

      <!-- Critical / High Priority -->
      <app-kpi-card
        label="Prioridad Alta (High)"
        icon="warning"
        iconBgClass="bg-red-100 text-primary"
        [value]="stats.high"
        valueClass="text-primary"
        badge="Críticos"
        badgeClass="bg-primary-container text-on-primary"
        footer="SLA Campus < 2h"
        footerValue="Atención UTP"
        footerValueClass="text-primary"
        accentClass="bg-primary-container"
      ></app-kpi-card>

      <!-- Campus SLA Performance (métrica fija institucional) -->
      <app-kpi-card
        label="Tiempo Promedio UTP"
        icon="timer"
        iconBgClass="bg-tertiary-fixed text-on-tertiary-fixed-variant"
        value="1.4"
        unit="h"
        chip="-22% vs meta"
        chipClass="text-emerald-600 font-medium"
        footer="Resolución de incidentes"
        footerValue="Óptimo"
        footerValueClass="text-tertiary"
        accentClass="bg-tertiary"
      ></app-kpi-card>
    </div>
  `
})
export class KpiDeck {
  @Input({ required: true }) stats!: IncidentStats;
}
