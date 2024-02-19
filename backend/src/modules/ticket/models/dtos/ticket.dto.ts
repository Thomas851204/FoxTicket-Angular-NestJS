import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TicketDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'movie id' })
  movieId: number;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'title' })
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'price' })
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'number of tickets' })
  numOfTickets: number;

  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'screening time' })
  screeningTimes: string[];
}
