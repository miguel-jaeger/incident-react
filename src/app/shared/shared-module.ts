import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Modal } from './components/modal/modal';
import { StatusBadge } from './components/status-badge/status-badge';
import { PriorityBadge } from './components/priority-badge/priority-badge';
import { KpiCard } from './components/kpi-card/kpi-card';
import { EmptyState } from './components/empty-state/empty-state';
import { LoadingSpinner } from './components/loading-spinner/loading-spinner';
import { TicketCodePipe } from './pipes/ticket-code.pipe';
import { AppDatePipe } from './pipes/app-date.pipe';

/**
 * Módulo de UI compartida: componentes presentacionales sin lógica de negocio
 * + pipes de formato. Importable desde cualquier feature module.
 */
@NgModule({
  declarations: [
    Modal,
    StatusBadge,
    PriorityBadge,
    KpiCard,
    EmptyState,
    LoadingSpinner,
    TicketCodePipe,
    AppDatePipe
  ],
  imports: [CommonModule],
  exports: [
    Modal,
    StatusBadge,
    PriorityBadge,
    KpiCard,
    EmptyState,
    LoadingSpinner,
    TicketCodePipe,
    AppDatePipe
  ]
})
export class SharedModule {}
