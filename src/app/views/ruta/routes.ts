import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Ruta' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./list-ruta/list-ruta.component').then(
            (m) => m.ListRutaComponent
          ),
        data: { title: 'Gestión de Rutas' },
      },
      {
        path: 'crear-ruta',
        loadComponent: () =>
          import('./crear-ruta/crear-ruta.component').then(
            (m) => m.CrearRutaComponent
          ),
        data: { title: 'Crear Ruta' },
      },
      {
        path: 'edit-ruta/:id',
        loadComponent: () =>
          import('./edit-ruta/edit-ruta.component').then(
            (m) => m.EditRutaComponent
          ),
        data: { title: 'Editar Ruta' },
      },
    ],
  },
];
