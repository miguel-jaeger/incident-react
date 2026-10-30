import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared-module';

import { IncidentDashboardPage } from './pages/incident-dashboard/incident-dashboard';
import { KpiDeck } from './components/kpi-deck/kpi-deck';
import { IncidentFilters } from './components/incident-filters/incident-filters';
import { IncidentCard } from './components/incident-card/incident-card';
import { IncidentTable } from './components/incident-table/incident-table';
import { CreateIncidentModal } from './components/create-incident-modal/create-incident-modal';
import { StatusModal } from './components/status-modal/status-modal';
import { IncidentDetailModal } from './components/incident-detail-modal/incident-detail-modal';
import { ApiDocsModal } from './components/api-docs-modal/api-docs-modal';

const routes: Routes = [{ path: '', component: IncidentDashboardPage }];

/**
 * Feature module del dominio "Incidentes". Se carga de forma diferida
 * (lazy) desde el AppRoutingModule. Solo conoce: su página, sus
 * componentes de presentación y la UI compartida.
 */
@NgModule({
  declarations: [
    IncidentDashboardPage,
    KpiDeck,
    IncidentFilters,
    IncidentCard,
    IncidentTable,
    CreateIncidentModal,
    StatusModal,
    IncidentDetailModal,
    ApiDocsModal
  ],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedModule]
})
export class IncidentsModule {}
