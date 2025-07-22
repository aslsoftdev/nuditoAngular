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
        id: 'roles',
        title: 'Roles',
        type: 'item',
        classes: 'nav-item',
        url: '/roles',
        icon: 'ti ti-accessible',
        breadcrumbs: false
      },
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
        id: 'productos',
        title: 'Productos',
        type: 'item',
        classes: 'nav-item',
        url: '/productos',
        icon: 'ti ti-box',
        breadcrumbs: false
      },
      
      {
        id: 'tipos-clientes',
        title: 'Tipos de Cliente',
        type: 'item',
        classes: 'nav-item',
        url: '/tipos-clientes',
        icon: 'ti ti-list-check',
        breadcrumbs: false
      },

      {
        id: 'clientes',
        title: 'Clientes',
        type: 'item',
        classes: 'nav-item',
        url: '/clientes',
        icon: 'ti ti-user',
        breadcrumbs: false
      },

      {
        id: 'tipos-proveedores',
        title: 'Tipos de Proveedor',
        type: 'item',
        classes: 'nav-item',
        url: '/tipos-proveedores',
        icon: 'ti ti-truck',
        breadcrumbs: false
      },

      {
        id: 'proveedores',
        title: 'Proveedores',
        type: 'item',
        classes: 'nav-item',
        url: '/proveedores',
        icon: 'ti ti-truck',
        breadcrumbs: false
      },

      {
        id: 'cotizaciones',
        title: 'Cotizaciones',
        type: 'item',
        classes: 'nav-item',
        url: '/cotizaciones',
        icon: 'ti ti-file-report',
        breadcrumbs: false
      },

      {
        id: 'ordenes-venta',
        title: 'Órdenes Venta',
        type: 'item',
        classes: 'nav-item',
        url: '/ordenes-venta',
        icon: 'ti ti-credit-card',
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
