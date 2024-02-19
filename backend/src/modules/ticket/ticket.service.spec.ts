import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { Repository } from 'typeorm';
import { Ticket } from '../../database/entities/ticket.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};
export const tickeRepositoryMockFactory: () => MockType<Repository<Ticket>> =
  jest.fn(() => ({
    update: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
  }));
describe('TicketService', () => {
  let service: TicketService;
  let ticketRepoMock: MockType<Repository<Ticket>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: getRepositoryToken(Ticket),
          useFactory: tickeRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
    ticketRepoMock = module.get(getRepositoryToken(Ticket));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be defined', () => {
    expect(ticketRepoMock).toBeDefined();
  });
  describe('updateTicketById', () => {
    const ticketDto = {
      movieId: 1,
      title: 'RUR',
      price: 1,
      numOfTickets: 2,
      screeningTimes: [],
    };
    it('should call update, findOne and return modified ticket', async () => {
      const mockModifiedTicket = {
        id: 1,
        movieId: 1,
        price: 1,
        numOfTickets: 2,
      };
      ticketRepoMock.update(1, ticketDto);
      ticketRepoMock.findOne.mockReturnValue(mockModifiedTicket);
      const result = await service.updateTicketById(ticketDto, 1);
      expect(ticketRepoMock.update).toHaveBeenCalled();
      expect(ticketRepoMock.findOne).toHaveBeenCalled();

      expect(result).toEqual(mockModifiedTicket);
    });
  });
  describe('delete', () => {
    it('should call delete method', async () => {
      const id = 1;
      ticketRepoMock.delete(id);
      await service.deleteTicketById(id);
      expect(ticketRepoMock.delete).toHaveBeenCalled();
    });
  });
  describe('adminGetAllTickets', () => {
    const ticketDB = [{ id: 1, movieId: 1, price: 10, numOfTickets: 10 }];
    it('should call repository find method', async () => {
      ticketRepoMock.find.mockReturnValue(ticketDB);
      await service.adminGetAllTickets();
      expect(ticketRepoMock.find).toHaveBeenCalled();
    });
    it('should return ticket(s) []', async () => {
      ticketRepoMock.find.mockReturnValue(ticketDB);
      const result = await service.adminGetAllTickets();
      expect(result).toEqual(ticketDB);
    });
  });
});
