export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/default',
        icon: 'ti ti-layout-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'admin',
    title: 'Menú',
    type: 'group',
    icon: 'icon-navigation',
    children: [

      {
        id: 'usuarios',
        title: 'Vendedores',
        type: 'item',
        classes: 'nav-item',
        url: '/usuarios',
        icon: 'ti ti-users',
        breadcrumbs: false
      },
     
      {
        id: 'app-listas-rutas',
        title: 'Lista de Rutas',
        type: 'item',
        classes: 'nav-item',
        url: '/lista-rutas',
        icon: 'ti ti-map',
        breadcrumbs: false
      },

      {
        id: 'app-solicitudes-facturas',
        title: 'Solicitudes de Facturas',
        type: 'item',
        classes: 'nav-item',
        url: '/solicitudes-facturas',
        icon: 'ti ti-file-invoice',
        breadcrumbs: false
      },

      /*
      {
        id: '',
        title: 'Órdenes Compra',
        type: 'item',
        classes: 'nav-item',
        url: '/ordenes-venta',
        icon: 'ti ti-receipt',
        breadcrumbs: false
      },

      {
        id: '',
        title: 'Tablero de Producción',
        type: 'item',
        classes: 'nav-item',
        url: '/tablero-produccion',
        icon: 'ti ti-shirt',
        breadcrumbs: false
      },

      {
        id: '',
        title: 'Turnos',
        type: 'item',
        classes: 'nav-item',
        url: '/tablero-produccion',
        icon: 'ti ti-cash',
        breadcrumbs: false
      }*/
    ]
  }
];
