import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Cliente' },
    children: [
      {
        path: '',
        redirectTo: 'list-cliente',
        pathMatch: 'full',
      },
      {
        path: 'list-cliente',
        loadComponent: () =>
          import('./list-cliente/list-cliente.component').then(
            (m) => m.ListClienteComponent
          ),
        data: { title: 'Gestión de Clientes' },
      },
      {
        path: 'crear-cliente',
        loadComponent: () =>
          import('./crear-cliente/crear-cliente.component').then(
            (m) => m.CrearClienteComponent
          ),
        data: { title: 'Crear Cliente' },
      },
      {
        path: 'editar-cliente/:id',
        loadComponent: () =>
          import('./edit-cliente/edit-cliente.component').then(
            (m) => m.EditClienteComponent
          ),
        data: { title: 'Editar Cliente' },
      },
    ],
  },
];