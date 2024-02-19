import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminGuard,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AdminGuard>(AdminGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access for admin user', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'Bearer valid-token-here',
        },
      }),
    } as unknown as ExecutionContext;

    const decodedToken = { isAdmin: true };
    jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should block access for non-admin user', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'Bearer valid-token-here',
        },
      }),
    } as unknown as ExecutionContext;

    const decodedToken = { isAdmin: false };
    jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should block access for missing token', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {},
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should block access for invalid token', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'Bearer invalid-token-here',
        },
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error();
    });

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrowError(
      UnauthorizedException,
    );
  });
});
