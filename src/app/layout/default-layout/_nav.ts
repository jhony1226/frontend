import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Home',
    title: true,
  },
  {
    name: 'Sucursales',
    url: '/sucursal',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'List Sucursal',
        url: '/sucursal/list-sucursal',
        icon: 'nav-icon-bullet',
      },

      {
        name: 'Cambio de Sucursal',
        url: '/sucursal/cambio-sucursal',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Periodo',
    url: '/periodo',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'Crear',
        url: '/periodo/crear-periodo',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Aportes',
        url: '/periodo/list-periodo',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Rutas',
    url: '/ruta',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'List Ruta',
        url: '/ruta/list-ruta',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Crear Ruta',
        url: '/ruta/crear-ruta',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Clientes',
    url: '/cliente',
    iconComponent: { name: 'cil-people' },
    children: [
      {
        name: 'Gestión de Clientes',
        url: '/cliente/list-cliente',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Crear Cliente',
        url: '/cliente/crear-cliente',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Préstamos',
    url: '/prestamo',
    iconComponent: { name: 'cil-chart-pie' },
    children: [
      {
        name: 'Gestión de Préstamos',
        url: '/prestamo',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Crear Préstamo',
        url: '/prestamo/crear-prestamo',
        icon: 'nav-icon-bullet',
      },
    ],
  },
    
  {
    name: 'Cobros',
    url: '/cobro',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Gestión de Cobros',
        url: '/cobro/list-cobro',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Crear Cobro',
        url: '/cobro/crear-cobro',
        icon: 'nav-icon-bullet',
      },

       {
        name: 'tarjeta',
        url: '/tarjeta',
        icon: 'nav-icon-bullet',
      },
      
    ],
  },
  
  {
    name: 'Gastos',
    url: '/gasto',
    iconComponent: { name: 'cil-calculator' },
    children: [
      {
        name: 'Gestión de Gastos',
        url: '/gasto/list-gasto',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Crear Gasto',
        url: '/gasto/crear-gasto',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    title: true,
    name: 'Configuración',
  },
  {
    name: 'Usuarios',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'nav-icon-bullet',
      },
    ],
  },

  {
    name: 'Sesión',
    url: 'https://coreui.io/angular/docs/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' },
  },
];
