import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./list-usuario/list-usuario.component').then(
        (m) => m.ListUsuarioComponent
      ),
    data: {
      title: 'Listado de Usuarios',
    },
  },
  {
    path: 'crear',
    loadComponent: () =>
      import('./crear-usuario/crear-usuario.component').then(
        (m) => m.CrearUsuarioComponent
      ),
    data: {
      title: 'Crear Usuario',
    },
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./editar-usuario/editar-usuario.component').then(
        (m) => m.EditarUsuarioComponent
      ),
    data: {
      title: 'Editar Usuario',
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
