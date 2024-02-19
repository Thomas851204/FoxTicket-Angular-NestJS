import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { SnackbarService } from 'src/app/core/services/snack-bar/snackbar.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { LoginResponse } from 'src/app/shared/models/loginResponse.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  returnMessage: string = '';

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  loginSubmit(): void {
    this.userService.login(this.loginForm).subscribe({
      next: (response: LoginResponse) => {
        this.authenticationService.setToken(response.token);
        this.authenticationService.setUserName(response.username);
        this.snackbarService.showInfoMessage('Successful Login');
        this.router.navigate(['/']);
      },
      error: () => {
        this.snackbarService.showErrorMessage('Invalid username or password');
      },
    });
  }
}
