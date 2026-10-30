import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class ApiIncidentService {
  private readonly baseUrl = 'https://api-incident.onrender.com';

  constructor(private http: HttpClient) {}

  // Incidents Endpoints
  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.baseUrl}/api/incidents`);
  }

  createIncident(incident: Partial<Incident>): Observable<Incident> {
    return this.http.post<Incident>(`${this.baseUrl}/api/incidents`, incident);
  }

  getIncidentById(id: number | string): Observable<Incident> {
    return this.http.get<Incident>(`${this.baseUrl}/api/incidents/${id}`);
  }

  updateIncidentStatus(id: number | string, data: { status: string; message?: string } | Record<string, string>): Observable<Incident> {
    return this.http.patch<Incident>(`${this.baseUrl}/api/incidents/${id}/status`, data);
  }

  deleteIncident(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/incidents/${id}`);
  }

  // Statistics Endpoints
  getStats(): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`${this.baseUrl}/api/incidents/stats`);
  }

  getTotalStats(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/api/incidents/stats/total`);
  }

  getStatsByStatus(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/api/incidents/stats/by-status`);
  }

  getStatsBySeverity(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/api/incidents/stats/by-severity`);
  }

  getStatsByCategory(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/api/incidents/stats/by-category`);
  }

  getCount(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/api/incidents/count`);
  }
}
