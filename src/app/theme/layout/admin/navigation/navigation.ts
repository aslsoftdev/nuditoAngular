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

      {
        id: 'tablero-clientes',
        title: 'Tablero de clientes',
        type: 'item',
        classes: 'nav-item',
        url: '/tablero-clientes',
        icon: 'ti ti-users',
        breadcrumbs: false
      },

      {
        id: 'ventas-problemas',
        title: 'Ventas con Problemas',
        type: 'item',
        classes: 'nav-item',
        url: '/ventas-problemas',
        icon: 'ti ti-alert-triangle',
        breadcrumbs: false
      }
    ]
  }
];
