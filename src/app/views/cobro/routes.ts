import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'list-cobro',
        pathMatch: 'full'
    },
    {
        path: 'list-cobro',
        loadComponent: () => import('./list-cobro/list-cobro.component').then(m => m.ListCobroComponent),
        data: { title: 'Lista de Cobros' }
    },
    {
        path: 'crear-cobro',
        loadComponent: () => import('./crear-cobro/crear-cobro.component').then(m => m.CrearCobroComponent),
        data: { title: 'Crear Cobro' }
    },
    {
        path: 'prestamos-cliente/:id',
        loadComponent: () => import('./prestamos-cliente/prestamos-cliente.component').then(m => m.PrestamosClienteComponent),
        data: { title: 'Préstamos del Cliente' }
    },
    {
        path: 'edit-cobro',
        loadComponent: () => import('./edit-cobro/edit-cobro.component').then(m => m.EditCobroComponent),
        data: { title: 'Editar Cobro' }
    },
    {
        path: 'ruta/:rutaId/cobros',
        loadComponent: () =>
          import('./list-cobro/list-cobro.component')
            .then(m => m.ListCobroComponent),
        data: { title: 'Cobros por Ruta' }
    }
]
