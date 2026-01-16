import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SucursalContextService } from '../services/sucursal-context.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const sucursalContextService = inject(SucursalContextService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    // No autenticado - redirigir a login
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Autenticado - si no es la ruta de cambio-sucursal y no tiene sucursal seleccionada, redirigir
  if (state.url !== '/cambio-sucursal' && !sucursalContextService.hasSucursalSeleccionada()) {
    router.navigate(['/cambio-sucursal']);
    return false;
  }

  return true;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
