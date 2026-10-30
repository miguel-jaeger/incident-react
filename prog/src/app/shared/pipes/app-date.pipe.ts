import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea fechas en español (Perú) para toda la app.
 */
@Pipe({ name: 'appDate', standalone: false })
export class AppDatePipe implements PipeTransform {
  transform(value?: string | number | Date | null): string {
    if (value === null || value === undefined || value === '') {
      return 'Fecha no registrada';
    }
    try {
      const date = new Date(value);
      return date.toLocaleString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return String(value);
    }
  }
}
