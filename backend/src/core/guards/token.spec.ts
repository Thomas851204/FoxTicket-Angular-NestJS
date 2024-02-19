import { Test, TestingModule } from '@nestjs/testing';
import { TokenGuard } from './token.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';

describe('TokenGuard', () => {
  let tokenGuard: TokenGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenGuard,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenGuard = module.get<TokenGuard>(TokenGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(tokenGuard).toBeDefined();
  });

  it('should allow access with a valid token', async () => {
    (jwtService.verify as jest.Mock).mockReturnValueOnce({});

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer valid-token',
          },
        }),
      }),
    } as ExecutionContext;

    const canActivate = await tokenGuard.canActivate(context);
    expect(canActivate).toBe(true);
  });

  it('should block access with a missing token', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as ExecutionContext;

    try {
      await tokenGuard.canActivate(context);
    } catch (error) {
      expect(error.message).toBe('Unauthorized');
    }
  });

  it('should block access with an invalid token', async () => {
    (jwtService.verify as jest.Mock).mockRejectedValueOnce(
      new Error('Invalid token'),
    );

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalid-token',
          },
        }),
      }),
    } as ExecutionContext;

    try {
      await tokenGuard.canActivate(context);
    } catch (error) {
      expect(error.message).toBe('Unauthorized');
    }
  });
});
