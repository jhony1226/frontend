import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Préstamo' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./list-prestamo/list-prestamo.component').then(
            (m) => m.ListPrestamoComponent
          ),
        data: { title: 'Gestión de Préstamos' },
      },
      {
        path: 'crear-prestamo',
        loadComponent: () =>
          import('./crear-prestamo/crear-prestamo.component').then(
            (m) => m.CrearPrestamoComponent
          ),
        data: { title: 'Crear Préstamo' },
      },
    ],
  },
];