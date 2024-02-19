import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { customJwtPayload } from 'src/app/shared/models/customJwtPayload.type';

@Injectable({
  providedIn: 'root',
})
export class RoleAuthGuard {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isAdmin = this.authService.isAdmin();
    if (!isAdmin) {
      this.router.navigate(['user/login']);
      return false;
    }
    return true;
  }
}
