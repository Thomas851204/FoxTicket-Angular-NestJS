import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../core/services/authentication/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CarouselService } from '../services/carousel.service';
import { LoginResponse } from 'src/app/shared/models/loginResponse.interface';
import { SnackbarService } from 'src/app/core/services/snack-bar/snackbar.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  username: string = '';

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private carouselService: CarouselService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let code: string = '';
    this.route.params.subscribe({
      next: (param) => {
        code = param['code'];
      },
    });
    if (parseInt(code)) {
      this.carouselService.sendConfirmation(code).subscribe({
        next: (response: any) => {
          if (response !== false) {
            this.username = response.username;
            this.authenticationService.setToken(response.token);
            this.authenticationService.setUserName(response.username);
            this.router.navigate(['/']);
            this.snackbarService.showInfoMessage('Registration completed');
          } else {
            this.router.navigate(['/']);
            this.snackbarService.showInfoMessage('Invalid code');
          }
        },
      });
    }

    this.authenticationService.usernameSubject.subscribe(
      (username: string) => (this.username = username)
    );
  }
}
