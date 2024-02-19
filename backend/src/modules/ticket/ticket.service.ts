import { HttpCode, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../../database/entities/ticket.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { TicketDto } from './models/dtos/ticket.dto';
import { TicketViewModel } from './models/viewModels/ticketViewModel';
import { UpdatedViewModel } from './models/viewModels/updatedViewModel';
import { AdminTicketViewModel } from './models/viewModels/adminTicketViewModel';
import { AvailableTicket } from './models/viewModels/availableTicketViewModel';
import { UserTicketViewModel } from './models/viewModels/userTicketViewModel';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
  ) {}

  async addMovieTickets(movieTickets: TicketDto[]) {
    const movieIds = movieTickets.map((ticket) => ticket.movieId);

    const existingTickets = await this.ticketRepository.find({
      where: { movieId: In(movieIds) },
    });

    let existingTicketList: TicketViewModel = new TicketViewModel();

    existingTicketList.movieId.push(
      ...existingTickets.map((ticket) => ticket.movieId),
    );

    const newTickets: Ticket[] = movieTickets
      .filter(
        (ticket) =>
          !existingTickets.some(
            (existing) => existing.movieId === ticket.movieId,
          ),
      )
      .map((ticket) =>
        this.ticketRepository.create({
          movieId: ticket.movieId,
          title: ticket.title,
          price: ticket.price,
          numOfTickets: ticket.numOfTickets,
          screeningTimes: ticket.screeningTimes.join(','),
        }),
      );
    await this.ticketRepository.save(newTickets);

    return existingTicketList;
  }

  async availableMovies(movieIDs: number[]) {
    let availableMovieList: TicketViewModel = new TicketViewModel();

    const runningMovies = await this.ticketRepository.find({
      where: {
        movieId: In(movieIDs),
        numOfTickets: MoreThan(0),
      },
    });

    availableMovieList.movieId.push(
      ...runningMovies.map((ticket) => ticket.movieId),
    );
    return availableMovieList;
  }

  async adminGetAllTickets(): Promise<AdminTicketViewModel[]> {
    return await this.ticketRepository.find();
  }

  async updateTicketById(
    ticketDto: TicketDto,
    id: number,
  ): Promise<UpdatedViewModel> {
    let modifiedTicket: UpdatedViewModel = new UpdatedViewModel();

    await this.ticketRepository.update(
      { movieId: id },
      {
        movieId: ticketDto.movieId,
        price: ticketDto.price,
        numOfTickets: ticketDto.numOfTickets,
        screeningTimes: ticketDto.screeningTimes.join(','),
      },
    );
    modifiedTicket = await this.ticketRepository.findOne({ where: { id } });
    return modifiedTicket;
  }

  async deleteTicketById(id: number): Promise<void> {
    await this.ticketRepository.delete({ movieId: id });
  }

  async serveAvailableTicketById(movieId: number): Promise<AvailableTicket> {
    const movieTickets = await this.ticketRepository.find({
      where: {
        movieId: movieId,
        numOfTickets: MoreThan(0),
      },
    });
    return movieTickets[0];
  }

  async getTicketListByIds(
    ticketIDs: number[],
  ): Promise<UserTicketViewModel[]> {
    const ticketList = await this.ticketRepository.find({
      where: { id: In(ticketIDs) },
    });
    return ticketList.map((ticket: Ticket) => {
      return {
        movieId: ticket.movieId,
        price: ticket.price,
      };
    });
  }
}
