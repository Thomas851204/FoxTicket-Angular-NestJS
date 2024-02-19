import { TestBed } from '@angular/core/testing';

import { TokenAuthGuard } from './token-auth-guard.guard';

describe('TokenAuthGuardGuard', () => {
  let guard: TokenAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TokenAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
