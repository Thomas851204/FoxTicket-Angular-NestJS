import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { of } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/core/services/snack-bar/snackbar.service';
import { HttpClientModule } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UserService;
  let snackbarService: SnackbarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NoopAnimationsModule,
      ],
      providers: [UserService, SnackbarService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    snackbarService = TestBed.inject(SnackbarService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showInfoMessage when login is successful', () => {
    jest.spyOn(userService, 'login').mockReturnValue(of(true));
    const showInfoMessageSpy = jest.spyOn(snackbarService, 'showInfoMessage');

    component.loginForm.setValue({
      username: 'testUser',
      password: 'testPassword',
    });
    component.loginSubmit();

    expect(showInfoMessageSpy).toHaveBeenCalledWith('Successful Login');
  });

  it('should call showErrorMessage when login is unsuccessful', () => {
    jest.spyOn(userService, 'login').mockReturnValue(of(false));
    const showErrorMessageSpy = jest.spyOn(snackbarService, 'showErrorMessage');

    component.loginForm.setValue({
      username: 'testUser',
      password: 'testPassword',
    });
    component.loginSubmit();

    expect(showErrorMessageSpy).toHaveBeenCalledWith(
      'Invalid username or password'
    );
  });
});
