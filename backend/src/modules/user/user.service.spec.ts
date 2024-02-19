import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PasswordService } from '../../core/authentication/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Confirmation } from '../../database/entities/confirmations.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from '../../database/entities/ticket.entity';
import { EmailService } from '../../shared/services/email/email.service';
import { LoginViewModel } from './models/viewModels/loginViewModel';
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};
export const repositoryMockFactory: () => MockType<Repository<User>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
  }),
);
export const ticketMockFactory: () => MockType<Repository<Ticket>> = jest.fn(
  () => ({
    find: jest.fn((entity) => entity),
  }),
);
export const confirmationMockFactory: () => MockType<Repository<Confirmation>> =
  jest.fn(() => ({
    findOne: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
  }));
describe('UserService', () => {
  let service: UserService;
  let repositoryMock: MockType<Repository<User>>;
  let confirmatinMock: MockType<Repository<Confirmation>>;
  let jwtService: JwtService;
  let passwordService: PasswordService;

  const mockPasswordService = {
    comparePasswords: jest.fn((x) => x),
    hashPassword: jest.fn((x) => x),
  };
  const mockJwtService = {
    sign: jest.fn((x) => x),
  };
  const mockEmailService = {
    confirmationEmail: jest.fn((x) => x),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Confirmation),
          useFactory: confirmationMockFactory,
        },

        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    repositoryMock = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });
  it('should be defined', () => {
    expect(passwordService).toBeDefined();
  });
  it('should be defined', () => {
    expect(repositoryMock).toBeDefined();
  });
  describe('createUser', () => {
    const user = {
      username: 'test',
      email: 'test@com.com',
      password: '1234',
      confirmPassword: '1234',
    };

    it('should call repository create method', async () => {
      const hashedPassword = jest
        .spyOn(passwordService, 'hashPassword')
        .mockResolvedValue('hashedPassword' as never);
      const mockCreateUser = {
        email: user.email,
        username: user.username,
        password: hashedPassword,
      };
      repositoryMock.create.mockReturnValue(mockCreateUser);
      await service.createUser(user);
      expect(repositoryMock.create).toHaveBeenCalled();
    });
    it('should save the user', async () => {
      const saveUser = await service.createUser(user);
      const hashedPassword = jest
        .spyOn(passwordService, 'hashPassword')
        .mockResolvedValue('hashedPassword' as never);
      const mockCreateUser = {
        email: user.email,
        username: user.username,
        password: hashedPassword,
      };
      repositoryMock.save.mockReturnValue(mockCreateUser);
      expect(repositoryMock.save).toHaveBeenCalled();
      expect(saveUser).toBeTruthy();
    });
  });
  describe('login', () => {
    it('should call repository find method', async () => {
      const user = { username: 'test', password: '1234' };
      await service.login(user);

      repositoryMock.findOne.mockReturnValue(user);
      expect(repositoryMock.findOne).toHaveBeenCalled();
    });
    it('should return token', async () => {
      const user = { username: 'test', password: '1234' };
      repositoryMock.findOne.mockReturnValue(user);
      jest
        .spyOn(passwordService, 'comparePasswords')
        .mockResolvedValue(true as never);
      jest.spyOn(jwtService, 'sign').mockReturnValue(user.username);
      const result = await service.login(user);
      expect(result).toEqual(user.username);
    });
  });
  describe('User Confirmation', () => {
    const user = {
      username: 'testUser',
      email: 'admin@foxticket.coom',
      password: 'testPassword123',
      confirmPassword: 'testPassword123',
    };
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.69;
    global.Math = mockMath;
    const expectedCode = Math.floor(
      100000 + Math.random() * 900000,
    ) as unknown as string;

    it('should create user and put into Confirmation repo', async () => {
      await service.createUser(user);

      expect(confirmatinMock.create).toHaveBeenCalledWith({
        email: user.email,
        username: user.username,
        password: expect.any(String),
        confirmationCode: expectedCode,
      });
      expect(confirmatinMock.save).toHaveBeenCalled();
    });

    it('should send email with correct username and email', async () => {
      await service.createUser(user);

      expect(mockEmailService.confirmationEmail).toHaveBeenCalledWith(
        user.email,
        user.username,
        expectedCode,
      );
    });

    it('should be able to respond to confirmation code', async () => {
      await service.createUser(user);
      const response = (await service.confirmUser(
        expectedCode,
      )) as LoginViewModel;

      expect(response.username).toBe(user.username);
      expect(typeof response.token).toBe('string');
    });
  });
});
