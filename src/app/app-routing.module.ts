// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // Ruta pública de login (sin menú)
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  // Rutas protegidas bajo AdminComponent (con menú)
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'default', pathMatch: 'full' },

      {
        path: 'default',
        loadComponent: () =>
          import('./pages/dashboard/default/default.component').then(m => m.DefaultComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent)
      },
      {
        path: 'lista-rutas',
        loadComponent: () => import('./pages/lista-rutas/lista-rutas.component').then(m => m.ListarutasComponent)
      },
      {
        path: 'solicitudes-facturas',
        loadComponent: () => import('./pages/solicitudes-facturas/solicitudes-facturas.component').then(m => m.SolicitudesFacturasComponent)
      },
      {
        path: 'usuarios/nuevo',
        loadComponent: () =>
          import('./pages/usuarios/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
      },
      {
        path: 'usuarios/editar/:id',
        loadComponent: () =>
          import('./pages/usuarios/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
      },
      {
        path: 'lista-rutas/nuevo',
        loadComponent: () => import('./pages/lista-rutas/ruta/ruta.component').then(m => m.ListaRutasFormComponent)
      },
      {
        path: 'lista-rutas/editar/:id',
        loadComponent: () => import('./pages/lista-rutas/ruta/ruta.component').then(m => m.ListaRutasFormComponent)
      },
      {
        path: 'solicitudes-facturas/nuevo',
        loadComponent: () => import('./pages/solicitudes-facturas/solicitues-facturas-form/solicitues-facturas-form.component').then(m => m.SolicituesFacturasFormComponent)
      },
      {
        path: 'solicitudes-facturas/editar/:id',
        loadComponent: () => import('./pages/solicitudes-facturas/solicitues-facturas-form/solicitues-facturas-form.component').then(m => m.SolicituesFacturasFormComponent)
      },
      {
        path: 'tablero-clientes',
        loadComponent: () => import('./pages/tablero-clientes/tablero-clientes.component').then(m => m.TableroClientesComponent)
      },

      {
        path: 'ventas-problemas',
        loadComponent: () => import('./pages/ventas-problemas/ventas-problemas.component').then(m => m.VentasProblemasComponent)
      },

    ]
  },

  // Wildcard: redirige a login si no coincide ninguna ruta
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
