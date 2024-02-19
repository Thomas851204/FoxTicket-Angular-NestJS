import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PurchaseDto } from './models/dtos/purchase.dto';
import { PurchaseService } from './purchase.service';
import { ApiResponse } from '@nestjs/swagger';
import { TokenGuard } from '../../core/guards/token.guard';
import { UserTicketViewModel } from '../ticket/models/viewModels/userTicketViewModel';

@Controller('purchase')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @Post()
  @ApiResponse({ description: 'purchased tickets saved in db' })
  async purchaseTickets(
    @Body(new ParseArrayPipe({ items: PurchaseDto }))
    purchasedDtos: PurchaseDto[],
  ): Promise<void> {
    await this.purchaseService.purchaseTickets(purchasedDtos);
  }

  @Get(':userId')
  @UseGuards(TokenGuard)
  @ApiResponse({ description: 'get all tickets by user ID' })
  async getPurchaseByUserId(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<UserTicketViewModel[]> {
    const ticketsByUserId = await this.purchaseService.getPurchaseByUserId(
      userId,
    );
    return ticketsByUserId;
  }
}
