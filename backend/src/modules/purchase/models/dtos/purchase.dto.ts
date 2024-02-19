import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PurchaseDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'user id' })
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'ticket id' })
  ticketId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'number of tickets purchased by user',
  })
  numberOfTickets: number;
}
