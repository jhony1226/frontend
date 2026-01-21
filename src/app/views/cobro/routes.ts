import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'seleccionar-ruta',
        pathMatch: 'full'
    },
    {
        path: 'seleccionar-ruta',
        loadComponent: () => import('./seleccionar-ruta-cobros/seleccionar-ruta-cobros.component').then(m => m.SeleccionarRutaCobrosComponent),
        data: { title: 'Seleccionar Ruta para Cobros' }
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
