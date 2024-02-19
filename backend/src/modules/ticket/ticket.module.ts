import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/database/entities/ticket.entity';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from '../../core/authentication/password/password.service';
import { User } from '../../database/entities/user.entity';
import { Confirmation } from 'src/database/entities/confirmations.entity';
import { EmailService } from 'src/shared/services/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, User, Confirmation]),
    JwtModule.register({
      secret: 'secret_key',
    }),
  ],
  providers: [TicketService, UserService, PasswordService, EmailService],
  controllers: [TicketController],
})
export class TicketModule {}
