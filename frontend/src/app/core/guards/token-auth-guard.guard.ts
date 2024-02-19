import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { TokenDialogComponent } from 'src/app/shared/dialogs/token-dialog/token-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class TokenAuthGuard {
  jwtHelper = new JwtHelperService();
  token = this.authService.getToken();
  constructor(
    public authService: AuthenticationService,
    public router: Router,
    public dialog: MatDialog
  ) {}

  canActivate(): boolean {
    if (
      !this.authService.isAuthenticated() ||
      this.token === '' ||
      this.token === undefined
    ) {
      const dialogRef = this.dialog.open(TokenDialogComponent, {
        disableClose: true,
        autoFocus: false,
      });

      return false;
    }

    return true;
  }
}
