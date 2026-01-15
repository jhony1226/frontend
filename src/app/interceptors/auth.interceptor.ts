import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SucursalContextService } from '../services/sucursal-context.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const sucursalContextService = inject(SucursalContextService);
  const router = inject(Router);
  const token = authService.getToken();
  const sucursalId = sucursalContextService.getSucursalId();

  // Preparar headers
  const headers: { [key: string]: string } = {};

  // Agregar token si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Agregar sucursal si existe
  if (sucursalId) {
    headers['X-Sucursal-Id'] = sucursalId.toString();
  }

  // Clonar la petición con los headers
  if (Object.keys(headers).length > 0) {
    req = req.clone({ setHeaders: headers });
  }

  return next(req).pipe(
    catchError(error => {
      // Si el error es 401 (no autorizado), hacer logout
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
