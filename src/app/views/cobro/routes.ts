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
]
