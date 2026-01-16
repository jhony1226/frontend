import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

export type RolUsuario = 'admin' | 'cobrador';

@Injectable({ providedIn: 'root' })
export class AuthMockService {
  private authService = inject(AuthService);

  getRol(): RolUsuario {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return 'admin'; // Default si no hay usuario logueado
    }
    
    // tipoUsuarioId: 1 = admin, 2 = cobrador
    return user.tipoUsuarioId === 1 ? 'admin' : 'cobrador';
  }

  setRol(rol: RolUsuario): void {
    // Este método ya no es necesario pero lo mantenemos por compatibilidad
    console.warn('setRol() está deprecated. El rol se obtiene automáticamente del usuario logueado.');
  }

  isAdmin(): boolean {
    return this.getRol() === 'admin';
  }

  isCobrador(): boolean {
    return this.getRol() === 'cobrador';
  }
}
