import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Sucursal',
    },
    children: [
      {
        path: '',
        redirectTo: 'list-sucursal',
        pathMatch: 'full',
      },
      {
        path: 'list-sucursal',
        loadComponent: () =>
          import('./list-sucursal/list-sucursal.component').then(
            (m) => m.ListSucursalComponent
          ),
        data: {
          title: 'Lista de Sucursales',
        },
      },
      {
        path: 'cambio-sucursal',
        loadComponent: () =>
          import('./cambio-sucursal/cambio-sucursal.component').then(
            (m) => m.CambioSucursalComponent
          ),
        data: {
          title: 'Cambio de Sucursal',
        },
      },
      {
        path: 'crear-sucursal',
        loadComponent: () =>
          import('./crear-sucursal/crear-sucursal.component').then(
            (m) => m.CrearSucursalComponent
          ),
        data: {
          title: 'Crear Sucursal',
        },
      },
      {
        path: 'edit-sucursal',
        loadComponent: () =>
          import('./edit-sucursal/edit-sucursal.component').then(
            (m) => m.EditSucursalComponent
          ),
        data: {
          title: 'Editar Sucursal',
        },
      },
    ],
  },
];
