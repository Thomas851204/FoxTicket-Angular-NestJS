import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { UserService } from '../../services/user/user.service';
import { SnackbarService } from '../../../../core/services/snack-bar/snackbar.service';
import { HeaderService } from '../../../../core/services/header/header.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;
  let snackBar: SnackbarService;
  let headerService: HeaderService;
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
      declarations: [ProfileComponent],
      providers: [UserService, SnackbarService, HeaderService, FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    snackBar = TestBed.inject(SnackbarService);
    headerService = TestBed.inject(HeaderService);
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();

    component.profileForm = formBuilder.group({
      profilePicture: '',
      username: '',
      email: '',
      newPassword: '',
      originalPassword: '',
      confirmNewPassword: '',
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display info info message', () => {
    const snackbarServiceSpy = jest.spyOn(snackBar, 'showInfoMessage');
    const mockFormData = {
      newPassword: 'username123',
      originalPassword: 'username1',
      confirmNewPassword: 'username123',
      profilePicture: {},
    };
    jest.spyOn(userService, 'updateUser').mockReturnValue(of(mockFormData));

    component.updateUserProfile();

    expect(snackbarServiceSpy).toHaveBeenCalledWith('Your profile was updated');
  });
});
