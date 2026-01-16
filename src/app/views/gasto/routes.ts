import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'list-gasto',
        pathMatch: 'full'
    },
    {
        path: 'list-gasto',
        loadComponent: () => import('./list-gasto/list-gasto.component').then(m => m.ListGastoComponent),
        data: { title: 'Lista de Gastos' }
    },
    {
        path: 'crear-gasto',
        loadComponent: () => import('./crear-gasto/crear-gasto.component').then(m => m.CrearGastoComponent),
        data: { title: 'Crear Gasto' }
    },
]



