import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TicketDto } from './models/dtos/ticket.dto';
import { TicketService } from './ticket.service';
import { ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { HttpCode } from '@nestjs/common';
import { AdminTicketViewModel } from './models/viewModels/adminTicketViewModel';
import { UpdatedViewModel } from './models/viewModels/updatedViewModel';
import { AdminGuard } from '../../core/guards/admin.guard';
import { TokenGuard } from '../../core/guards/token.guard';
import { AvailableTicket } from './models/viewModels/availableTicketViewModel';

@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Post()
  async ticket(
    @Body(new ParseArrayPipe({ items: TicketDto }))
    ticketDtos: TicketDto[],
    @Res() res,
  ): Promise<void> {
    const moviesAlreadyInDB = await this.ticketService.addMovieTickets(
      ticketDtos,
    );
    return res.json({ moviesAlreadyInDB });
  }

  @Post('getTicketIdsByMovieIds')
  async getTicketIdsByMovieIds(
    @Body(new ParseArrayPipe({ items: Number })) movieIds: number[],
    @Res() res,
  ): Promise<void> {
    console.log(movieIds);
    const availableMovies = await this.ticketService.availableMovies(movieIds);
    return res.json(availableMovies);
  }

  @Get('admin')
  @UseGuards(AdminGuard)
  @UseGuards(TokenGuard)
  @ApiOkResponse({ description: 'Get all tickets - admin' })
  async getTickets(): Promise<AdminTicketViewModel[]> {
    const allMovies = await this.ticketService.adminGetAllTickets();
    return allMovies;
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @UseGuards(TokenGuard)
  @ApiOkResponse({ description: 'Modify ticket record in db' })
  async updateTicketById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() ticketDto: TicketDto,
  ): Promise<UpdatedViewModel> {
    const updatedMovie = await this.ticketService.updateTicketById(
      ticketDto,
      id,
    );
    return updatedMovie;
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @UseGuards(TokenGuard)
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Ticket deleted' })
  async deleteTicketById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<void> {
    await this.ticketService.deleteTicketById(id);
  }

  @Get('getTicketByMovieId')
  async getTicketByMovieId(
    @Headers('movieId') movieId: number,
    @Res() res,
  ): Promise<AvailableTicket> {
    const availableTickets: AvailableTicket =
      await this.ticketService.serveAvailableTicketById(movieId * 1);

    if (!availableTickets) {
      res.status(404);
      return res.send();
    } else {
      return res.send(availableTickets);
    }
  }
}
