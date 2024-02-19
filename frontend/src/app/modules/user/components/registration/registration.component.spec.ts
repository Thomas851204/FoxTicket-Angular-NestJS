import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration.component';
import { SnackbarService } from 'src/app/core/services/snack-bar/snackbar.service';
import { of } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let userService: UserService;
  let snackbarService: SnackbarService;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        NoopAnimationsModule,
        MatSnackBarModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
      ],
      declarations: [RegistrationComponent],
      providers: [FormBuilder, UserService, SnackbarService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    snackbarService = TestBed.inject(SnackbarService);
    formBuilder = TestBed.inject(FormBuilder);

    component.registrationForm = formBuilder.group({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call userService.register on valid form submission', () => {
    const mockFormData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword123',
      confirmPassword: 'testpassword123',
    };

    const userServiceSpy = jest
      .spyOn(userService, 'register')
      .mockReturnValue(of(true));

    component.registrationForm?.patchValue(mockFormData);

    component.register();

    expect(userServiceSpy).toHaveBeenCalledWith(mockFormData);
  });

  it('should display info message on successful registration', () => {
    const snackbarServiceSpy = jest.spyOn(snackbarService, 'showInfoMessage');

    jest.spyOn(userService, 'register').mockReturnValue(of(true));

    component.register();

    expect(snackbarServiceSpy).toHaveBeenCalledWith('Registration successful');
  });
});
