import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get token', () => {
    const testToken = 'test-token';
    service.setToken(testToken);
    expect(service.getToken()).toEqual(testToken);
  });

  it('should set and get username', () => {
    const testUsername = 'test-username';
    service.setUserName(testUsername);
    expect(service.getUsername()).toEqual(testUsername);
  });

  it('should clear local storage', () => {
    service.setToken('test-token');
    service.setUserName('test-username');
    service.clearLocalStorage();
    expect(service.getToken()).toEqual('');
    expect(service.getUsername()).toEqual('');
  });
});
