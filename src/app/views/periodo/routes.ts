import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Periodo',
    },
    children: [
      {
        path: '',
        redirectTo: 'list-periodo',
        pathMatch: 'full',
      },
      {
        path: 'list-periodo',
        loadComponent: () =>
          import('./list-periodo/list-periodo.component').then(
            (m) => m.ListPeriodoComponent
          ),
        data: {
          title: 'Aportes',
        },
      },
      {
        path: 'crear-periodo',
        loadComponent: () =>
          import('./crear-periodo/crear-periodo.component').then(
            (m) => m.CrearPeriodoComponent
          ),
        data: {
          title: 'Crear Periodo',
        },
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./edir-periodo/edir-periodo.component').then(
            (m) => m.EdirPeriodoComponent
          ),
        data: {
          title: 'Editar Periodo',
        },
      },
      {
        path: 'edir-periodo',
        loadComponent: () =>
          import('./edir-periodo/edir-periodo.component').then(
            (m) => m.EdirPeriodoComponent
          ),
        data: {
          title: 'Editar Periodo',
        },
      },
    ],
  },
];
