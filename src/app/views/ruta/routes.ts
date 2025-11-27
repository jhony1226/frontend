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
    ],
  },
];
