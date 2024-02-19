import { Injectable, OnInit } from '@angular/core';
import { customJwtPayload } from 'src/app/shared/models/customJwtPayload.type';
import jwt_decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  jwtHelper = new JwtHelperService();

  isAdminSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  usernameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
    this.isAdminSubject.next(this.isAdmin());
    this.isAuthenticatedSubject.next(this.isAuthenticated());
    this.usernameSubject.next(this.getUsername());
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (token) {
      const tokenPayload: customJwtPayload = jwt_decode(token);
      if (tokenPayload.isAdmin) {
        return true;
      } else {
        false;
      }
    }
    return false;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string {
    let token = localStorage.getItem('token');
    return token ? token : '';
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.isAdminSubject.next(this.isAdmin());
    this.isAuthenticatedSubject.next(this.isAuthenticated());
  }

  getUsername(): string {
    let username = localStorage.getItem('username');
    return username ? username : '';
  }

  setUserName(username: string): void {
    localStorage.setItem('username', username);
    this.usernameSubject.next(username);
  }

  getUserId(): number {
    const userId = localStorage.getItem('userId');
    return parseInt(userId!) ?? null;
  }

  setUserId(userId: number): void {
    localStorage.setItem('userId', userId.toString());
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }
}
