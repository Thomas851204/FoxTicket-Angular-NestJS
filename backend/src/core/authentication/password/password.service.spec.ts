import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword()', () => {
    it('should return hashed password', async () => {
      let password: string = 'aaaaaapw';
      const hash = await service.hashPassword(password);
      expect(hash).toHaveLength(60);
    });
  });

  describe('comparePasswords()', () => {
    it('should compare password and hashed password', async () => {
      let password: string = 'aaaaaapw';
      let hashedPassword: string = await service.hashPassword(password);
      let result = await bcrypt.compare(password, hashedPassword);
      expect(result).toBe(true);
    });
  });
});
