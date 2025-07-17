// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  UrlTree
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  private isLoggedIn(): boolean {
    // Comprueba si existe el id en localStorage
    return !!localStorage.getItem('id_usuario');
  }

  canActivate(): boolean | UrlTree {
    if (this.isLoggedIn()) {
      return true;
    }
    return this.router.parseUrl('/login');
  }

  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}
