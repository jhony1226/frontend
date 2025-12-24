import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Homes',
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
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Gestión de Rutas',
        url: '/ruta',
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
    name: 'Préstamos',
    url: '/prestamo',
    iconComponent: { name: 'cil-chart-pie' },
    children: [
      {        name: 'Gestión de Préstamos',
        url: '/prestamo',
        icon: 'nav-icon-bullet',
      },
      {        name: 'Crear Préstamo',
        url: '/prestamo/crear-prestamo',
        icon: 'nav-icon-bullet',
      },
    ],
  },
    
  {
    name: 'Clientes',
    url: '/notifications',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Alerts',
        url: '/notifications/alerts',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Badges',
        url: '/notifications/badges',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Modal',
        url: '/notifications/modal',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Toast',
        url: '/notifications/toasts',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Cobros',
    url: '/widgets',
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    name: 'Gastos',
    url: '/widgets',
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    title: true,
    name: 'Configuracion',
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
    name: 'Sesion',
    url: 'https://coreui.io/angular/docs/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' },
  },
];
