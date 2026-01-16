import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SucursalContextService } from '../services/sucursal-context.service';

export const sucursalGuard: CanActivateFn = (route, state) => {
  const sucursalContextService = inject(SucursalContextService);
  const router = inject(Router);

  // Verificar si hay una sucursal seleccionada
  if (sucursalContextService.hasSucursalSeleccionada()) {
    return true;
  }

  // Si no hay sucursal seleccionada, redirigir a cambio-sucursal
  router.navigate(['/cambio-sucursal']);
  return false;
};
