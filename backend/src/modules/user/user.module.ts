import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PasswordService } from 'src/core/authentication/password/password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from 'src/database/entities/user.entity';
import { Confirmation } from 'src/database/entities/confirmations.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from 'src/shared/services/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Confirmation]),
    JwtModule.register({
      secret: 'secret_key',
      signOptions: { expiresIn: '1 days' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PasswordService, EmailService],
})
export class UserModule {}
