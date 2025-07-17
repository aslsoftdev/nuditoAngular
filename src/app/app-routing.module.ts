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
        path: 'roles',
        loadComponent: () =>
          import('./pages/roles-usuarios/roles-usuarios.component').then(m => m.RolesUsuariosComponent)
      },
      {
        path: 'roles/nuevo',
        loadComponent: () =>
          import('./pages/roles-usuarios/rol-usuario-form/rol-usuario-form.component').then(m => m.RolUsuarioFormComponent)
      },
      {
        path: 'roles/editar/:id',
        loadComponent: () =>
          import('./pages/roles-usuarios/rol-usuario-form/rol-usuario-form.component').then(m => m.RolUsuarioFormComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent)
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
