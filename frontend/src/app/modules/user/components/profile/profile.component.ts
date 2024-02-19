import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { UpdatedProfile } from '../../../../shared/models/updatedProfile.interface';

import { Profile } from '../../../../shared/models/profile.interface';
import { SnackbarService } from '../../../../core/services/snack-bar/snackbar.service';
import { environment } from '../../../../../environments/environment';
import { HeaderService } from '../../../../core/services/header/header.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  pictureFile!: File;
  hide: boolean = false;
  profilePictureUrl: string | ArrayBuffer = 'assets/images/profile.png';
  profileForm?: FormGroup;

  constructor(
    private userService: UserService,

    private snackBar: SnackbarService,
    private formBuilder: FormBuilder,
    private headerService: HeaderService
  ) {}
  ngOnInit(): void {
    this.profileForm = this.formBuilder.group(
      {
        profilePicture: [''],
        username: [''],
        email: [''],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
          ],
        ],
        originalPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
          ],
        ],
        confirmNewPassword: ['', [Validators.required]],
      },
      { validators: this.comparePasswordsValidator }
    );
    this.userService.getUserData().subscribe({
      next: (profile: Profile) => {
        this.profileForm?.patchValue({
          username: profile.username,
          email: profile.email,
          profilePicture: profile.profilePicture,
        });
        if (profile.profilePicture) {
          this.profilePictureUrl =
            environment.baseUrl + '/' + profile.profilePicture;
        } else {
          this.profilePictureUrl = environment.baseUrl + '/default.png';
        }
        this.headerService.profilePictureUrl.next(this.profilePictureUrl);
      },
    });
  }

  comparePasswordsValidator(
    form: AbstractControl
  ): { [key: string]: null | boolean } | null {
    const password = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;

    if (password !== confirmNewPassword && confirmNewPassword !== '') {
      form.get('confirmNewPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      form.get('confirmNewPassword')?.setErrors(null);
      return null;
    }
  }

  onSelect(event: any) {
    this.pictureFile = event.target.files[0];
    if (this.pictureFile) {
      const formData = new FormData();
      formData.append('profilePicture', this.pictureFile);
      const reader = new FileReader();
      reader.onload = (e) => (this.profilePictureUrl = reader.result!);
      reader.readAsDataURL(this.pictureFile);
    }
  }

  updateUserProfile(): void {
    if (this.profileForm?.invalid) return;

    const formData: UpdatedProfile = this.profileForm?.value;
    formData.profilePicture = this.pictureFile;
    this.userService.updateUser(formData);
  }
}
