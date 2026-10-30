import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'https://api-incident.onrender.com';
  private readonly tokenKey = 'token';
  private readonly userKey = 'auth_user';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          this.setToken(response.token);
          this.setUser(response);
        }
      })
    );
  }

  logout(): Observable<Record<string, any>> {
    return this.http.post<Record<string, any>>(`${this.baseUrl}/api/auth/logout`, {}).pipe(
      tap({
        next: () => this.clearStorage(),
        error: () => this.clearStorage()
      })
    );
  }

  getCurrentUser(): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`${this.baseUrl}/api/auth/me`);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getUser(): LoginResponse | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  setUser(user: LoginResponse): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  clearStorage(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
