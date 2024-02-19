import { UserService } from '../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { SnackbarService } from 'src/app/core/services/snack-bar/snackbar.service';
import { Register } from 'src/app/shared/models/register.interface';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  registrationForm?: FormGroup;
  hide: boolean = true;
  email: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.comparePasswordsValidator }
    );
  }

  comparePasswordsValidator(
    form: AbstractControl
  ): { [key: string]: null | boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword && confirmPassword !== '') {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      form.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  register(): void {
    if (this.registrationForm?.invalid) return;

    let formData: Register = this.registrationForm?.value;
    this.userService.register(formData).subscribe({
      next: (response: boolean) => {
        if (response) {
          this.email = formData.email;
          this.registrationForm?.reset();
          this.registrationForm?.get('username')?.setErrors(null);
          this.registrationForm?.get('email')?.setErrors(null);
          this.registrationForm?.get('password')?.setErrors(null);
          this.registrationForm?.get('confirmPassword')?.setErrors(null);
        } else {
          this.snackBar.showErrorMessage(
            'Username/email address already taken'
          );
        }
      },
      error: () => {
        this.snackBar.showErrorMessage('Error');
      },
    });
  }
}
