import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { LoginResponse } from './core/models/auth.model';

/**
 * Shell de la aplicación: encabezado institucional, router-outlet,
 * pie y host del toast global. Solo orquesta la sesión (AuthService),
 * sin lógica de dominio (eso vive en cada feature).
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  readonly user: LoginResponse | null;

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => window.location.reload(),
      error: () => window.location.reload()
    });
  }
}
