import { Injectable } from '@angular/core';

export type RolUsuario = 'admin' | 'cobrador';

@Injectable({ providedIn: 'root' })
export class AuthMockService {

  private rol: RolUsuario = 'cobrador'; // cambiar aquí para probar

  getRol(): RolUsuario {
    return this.rol;
  }

  setRol(rol: RolUsuario): void {
    this.rol = rol;
  }

  isAdmin(): boolean {
    return this.rol === 'admin';
  }

  isCobrador(): boolean {
    return this.rol === 'cobrador';
  }
}
