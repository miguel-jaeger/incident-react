import { Component, OnInit } from '@angular/core';
import { Incident } from '../../../../core/models/incident.model';
import { ApiIncidentService } from '../../../../core/services/api-incident.service';
import { ToastService } from '../../../../core/services/toast.service';
import {
  filterIncidents,
  computeStats,
  IncidentStats,
  IncidentView,
  PriorityFilter,
  StatusFilter
} from '../../utils/incident-calculations';
import { StatusUpdatePayload } from '../../components/status-modal/status-modal';

const API_HOST = 'api-incident.onrender.com';

/**
 * Página del dashboard operativo. Único responsable de:
 *  - hablar con el API (ApiIncidentService),
 *  - orquestar los componentes presentacionales (input/output),
 *  - notificar al usuario vía ToastService.
 * La lógica de estadísticas/filtrado vive en utils (funciones puras testables).
 */
@Component({
  selector: 'app-incident-dashboard',
  standalone: false,
  templateUrl: './incident-dashboard.html',
  styleUrl: './incident-dashboard.css'
})
export class IncidentDashboardPage implements OnInit {
  isLoading = false;

  // Listado sincronizado con el backend
  incidents: Incident[] = [];

  // Estado de filtros / vista
  searchQuery = '';
  statusFilter: StatusFilter = 'ALL';
  priorityFilter: PriorityFilter = 'ALL';
  currentView: IncidentView = 'cards';

  // Modales
  isCreateModalOpen = false;
  isStatusModalOpen = false;
  isDetailModalOpen = false;
  isDocsModalOpen = false;

  // Selección para modales
  selectedIncident: Incident | null = null;
  detailedIncident: Incident | null = null;
  isLoadingDetail = false;

  constructor(
    private apiIncidentService: ApiIncidentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  get stats(): IncidentStats {
    return computeStats(this.incidents);
  }

  get filteredIncidents(): Incident[] {
    return filterIncidents(this.incidents, this.searchQuery, this.statusFilter, this.priorityFilter);
  }

  loadIncidents(): void {
    this.isLoading = true;
    this.apiIncidentService.getIncidents().subscribe({
      next: (data) => {
        this.incidents = Array.isArray(data) ? data : [];
        this.isLoading = false;
        this.toastService.success(
          'GET /api/incidents sincronizado',
          `${this.incidents.length} registros validados contra ${API_HOST}`
        );
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error(
          'Error de conexión API',
          `No se pudo conectar con ${API_HOST}. Verifique conectividad.`
        );
      }
    });
  }

  // --- Handlers de filtros ---
  onStatusFilter(status: StatusFilter): void {
    this.statusFilter = status;
  }

  resetAllFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'ALL';
    this.priorityFilter = 'ALL';
  }

  // --- Modal: Crear (POST) ---
  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  submitCreateIncident(payload: Partial<Incident>): void {
    this.apiIncidentService.createIncident(payload).subscribe({
      next: () => {
        this.isCreateModalOpen = false;
        this.toastService.success('POST /api/incidents exitoso', `Nuevo ticket creado con éxito en ${API_HOST}`);
        this.loadIncidents();
      },
      error: () => {
        this.isCreateModalOpen = false;
        this.toastService.error('Error al crear ticket', `No se pudo registrar el incidente en ${API_HOST}.`);
      }
    });
  }

  // --- Modal: Actualizar estado (PATCH) ---
  openStatusModal(incident: Incident): void {
    this.selectedIncident = incident;
    this.isStatusModalOpen = true;
  }

  submitStatusUpdate(payload: StatusUpdatePayload): void {
    this.apiIncidentService.updateIncidentStatus(payload.id, { status: payload.status, message: payload.message }).subscribe({
      next: () => {
        this.isStatusModalOpen = false;
        this.toastService.success(
          'PATCH /api/incidents/{id}/status exitoso',
          'Estado y notas de resolución actualizados en el servidor.'
        );
        this.loadIncidents();
      },
      error: () => {
        this.isStatusModalOpen = false;
        this.toastService.error('Error al actualizar estado', `No se pudo actualizar el ticket en ${API_HOST}.`);
      }
    });
  }

  // --- Modal: Detalle (GET por id) ---
  openDetailModal(incident: Incident): void {
    this.isDetailModalOpen = true;
    this.detailedIncident = incident;

    if (incident.id === undefined) return;

    this.isLoadingDetail = true;
    this.apiIncidentService.getIncidentById(incident.id).subscribe({
      next: (data) => {
        this.detailedIncident = data;
        this.isLoadingDetail = false;
      },
      error: () => {
        this.isLoadingDetail = false;
      }
    });
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.detailedIncident = null;
    this.isLoadingDetail = false;
  }

  // --- Eliminar (DELETE) ---
  deleteIncident(incident: Incident): void {
    if (incident.id === undefined) return;

    const ticket = incident.ticketCode || `INC-${1040 + incident.id}`;
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el ticket ${ticket}? Esta acción ejecutará DELETE /api/incidents/${incident.id}`
    );
    if (!confirmed) return;

    this.apiIncidentService.deleteIncident(incident.id).subscribe({
      next: () => {
        this.toastService.success('DELETE /api/incidents/{id} exitoso', `Ticket ${ticket} eliminado correctamente del backend.`);
        this.loadIncidents();
      },
      error: () => {
        this.toastService.error('Error al eliminar', `No se pudo eliminar el ticket ${ticket} de ${API_HOST}.`);
      }
    });
  }
}
