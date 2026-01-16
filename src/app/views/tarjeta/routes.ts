import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tarjeta/tarjeta.component').then(m => m.TarjetaComponent),
    data: {
      title: 'Tarjeta'
    }
  }
];
