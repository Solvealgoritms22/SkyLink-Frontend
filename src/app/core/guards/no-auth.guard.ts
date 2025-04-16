// app/core/guards/no-auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn) {
      // Si ya está logueado, no permitimos navegar al login
      // Redirige, por ejemplo, al home, dashboard, etc.
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
