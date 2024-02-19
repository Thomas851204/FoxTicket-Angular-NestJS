import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../shared/services/email/email.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    createUser: jest.fn((x) => x),
    getUser: jest.fn((x) => x),
    login: jest.fn((x) => x),
    storeProfilePicture: jest.fn((x) => x),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, JwtService, EmailService, MailerService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create user', async () => {
    const mockUserData = {
      username: 'test',
      email: 'test@file.com',
      password: 'codefellas1',
      confirmPassword: 'codefellas1',
    };
    const response = await controller.createUser(mockUserData);
    expect(response).toBeTruthy();
  });
  it('should login user', async () => {
    const mockLoginDto = {
      username: 'test',
      password: 'codefellas1',
    };
    const mockReturnValue = {
      username: 'test',
      isAdmin: false,
      token: 'logged',
    };
    jest.spyOn(userService, 'login').mockResolvedValue('logged');
    const response = await controller.login(mockLoginDto);
    expect(response).toStrictEqual(mockReturnValue);
  });
  it('should update user password hash', async () => {
    const mockUpdateUserData = {
      username: 'otamas',
      newPassword: '3333eeee',
      originalPassword: '1111qqqq',
      confirmNewPassword: '3333qqqq',
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    await controller.updateUser(mockUpdateUserData, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
  });
  it('should get userdata', async () => {
    const mockToken = 'valid-jwt-token';
    const expectedUserData = {
      username: 'q',
      profilePicture: 'q.png',
      email: 'q@gmail.com',
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    jest.spyOn(controller as any, 'decode').mockReturnValue({ username: 'q' });

    jest.spyOn(userService, 'getUser').mockResolvedValue(expectedUserData);

    await controller.getUser({ authorization: `Bearer ${mockToken}` }, res);

    expect(res.send).toHaveBeenCalledWith(expectedUserData);
  });
});
