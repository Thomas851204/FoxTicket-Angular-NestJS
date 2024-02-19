import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from '../../database/entities/purchase.entity';
import { Repository } from 'typeorm';
import { PurchaseDto } from './models/dtos/purchase.dto';
import { TicketService } from '../ticket/ticket.service';
import { UserTicketViewModel } from '../ticket/models/viewModels/userTicketViewModel';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    private ticketService: TicketService,
  ) {}

  async purchaseTickets(purchaseTickets: PurchaseDto[]): Promise<void> {
    const purchasedTickets = purchaseTickets.map((ticket) =>
      this.purchaseRepository.create({
        userId: ticket.userId,
        ticketId: ticket.ticketId,
        numOfTickets: ticket.numberOfTickets,
      }),
    );
    await this.purchaseRepository.save(purchasedTickets);
  }
  async getPurchaseByUserId(userId: number): Promise<UserTicketViewModel[]> {
    const purchase = await this.purchaseRepository.find({
      where: {
        userId,
      },
    });
    const ticketIds = purchase.map((purchase) => purchase.ticketId);
    return await this.ticketService.getTicketListByIds(ticketIds);
  }
}
