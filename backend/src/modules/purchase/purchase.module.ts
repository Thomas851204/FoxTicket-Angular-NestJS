import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../../database/entities/ticket.entity';
import { User } from '../../database/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Purchase } from '../../database/entities/purchase.entity';
import { TicketService } from '../ticket/ticket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, User, Purchase]),
    JwtModule.register({
      secret: 'secret_key',
    }),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, TicketService],
})
export class PurchaseModule {}
