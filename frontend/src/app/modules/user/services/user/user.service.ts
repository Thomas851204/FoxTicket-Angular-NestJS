import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { LoginResponse } from 'src/app/shared/models/loginResponse.interface';
import { Register } from 'src/app/shared/models/register.interface';
import { environment } from 'src/environments/environment';
import { UpdatedProfile } from '../../../../shared/models/updatedProfile.interface';
import { Profile } from '../../../../shared/models/profile.interface';
import { HeaderService } from 'src/app/core/services/header/header.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.baseUrl;
  uploadedImage: any;

  constructor(private http: HttpClient, private headerService: HeaderService) {}

  login(loginForm: FormGroup): Observable<LoginResponse> {
    const reqBody = {
      username: loginForm.value.username,
      password: loginForm.value.password,
    };
    return this.http.post<LoginResponse>(this.baseUrl + '/user/login', reqBody);
  }

  register(formData: Register): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + '/user/register', formData);
  }

  getUserData(): Observable<Profile> {
    return this.http
      .get<Profile>(this.baseUrl + '/user/getUser')
      .pipe(map((profile: Profile) => profile));
  }
  toBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result!.toString().split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  }

  async updateUser(formData: UpdatedProfile): Promise<any> {
    if (formData.profilePicture) {
      formData.profilePicture = await this.toBase64(formData.profilePicture);
    }
    this.http
      .put<string>(this.baseUrl + '/user/updateUser', formData)
      .subscribe({
        next: (response: any) => {
          console.log(response);

          console.log(environment.baseUrl + '/' + response.profilePicName);

          this.headerService.profilePictureUrl.next(
            environment.baseUrl + '/' + response.profilePicName
          );
        },
      });
    return '';
  }
}
