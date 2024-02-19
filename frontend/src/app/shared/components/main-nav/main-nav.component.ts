import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { HeaderService } from '../../../core/services/header/header.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../../dialogs/logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit {
  isOpen: boolean = false;
  isAdmin: boolean = false;
  isAuthenticated: boolean = false;

  profilePictureUrl: string = 'assets/images/profile.png';

  constructor(
    private authenticationService: AuthenticationService,
    private headerService: HeaderService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authenticationService.isAuthenticatedSubject.subscribe({
      next: (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        if (!this.isAuthenticated) {
          this.authenticationService.usernameSubject.next('');
          this.authenticationService.clearLocalStorage();
        }
        this.getIsAdmin();
      },
    });

    this.headerService.profilePictureUrl.subscribe({
      next: (profilePictureUrl: string) => {
        this.profilePictureUrl = profilePictureUrl;
      },
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  displayUserProfileIcon(): boolean {
    if (
      this.authenticationService.getToken() &&
      this.authenticationService.getUsername()
    ) {
      return true;
    }
    return false;
  }
  private getIsAdmin() {
    this.authenticationService.isAdminSubject.subscribe({
      next: (isAdmin: boolean) => {
        this.isAdmin = this.isAuthenticated ? isAdmin : false;
        console.log(this.isAdmin);
      },
    });
  }

  logout() {
    const dialogRef = this.dialog.open(LogoutDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.authenticationService.clearLocalStorage();
        this.isAuthenticated = false;
      }
    });
  }
}
