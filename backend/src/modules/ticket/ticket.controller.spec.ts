import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { JwtService } from '@nestjs/jwt';

describe('TicketController', () => {
  let controller: TicketController;
  let ticketService: TicketService;

  const mockTicketService = {
    addMovieTickets: jest.fn((x) => x),
    availableMovies: jest.fn((x) => x),
    adminGetAllTickets: jest.fn((x) => x),
    updateTicketById: jest.fn((x) => x),
    deleteTicketById: jest.fn((x) => x),
    serveAvailableTicketById: jest.fn((x) => x),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [TicketService, JwtService],
    })
      .overrideProvider(TicketService)
      .useValue(mockTicketService)
      .compile();

    controller = module.get<TicketController>(TicketController);
    ticketService = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should be defined', () => {
    expect(ticketService).toBeDefined();
  });
  it('should get tickets for admin', async () => {
    const mockAdminTicket = [
      {
        id: 1,
        movieId: 12,
        price: 10,
        numOfTickets: 100,
      },
    ];
    jest
      .spyOn(ticketService, 'adminGetAllTickets')
      .mockResolvedValue(mockAdminTicket);
    const response = await controller.getTickets();
    expect(response).toStrictEqual(mockAdminTicket);
  });
  it('should update ticket by id', async () => {
    const id = 1;
    const mockTicketDto = {
      movieId: 1,
      title: 'r',
      price: 10,
      numOfTickets: 100,
      screeningTimes: [],
    };
    const mockUpdatedticket = {
      id: 1,
      movieId: 1,
      price: 10,
      numOfTickets: 100,
    };
    jest
      .spyOn(ticketService, 'updateTicketById')
      .mockResolvedValue(mockUpdatedticket);
    const response = await controller.updateTicketById(id, mockTicketDto);
    expect(response).toStrictEqual(mockUpdatedticket);
  });
  it('should delete ticket by id', async () => {
    const id = 1;
    const tService = jest.spyOn(ticketService, 'deleteTicketById');
    await controller.deleteTicketById(id);
    expect(tService).toHaveBeenCalled();
  });
  it('should get ticket by movie id', async () => {
    const movieId = 1;
    const mockAvailiableTicket = {
      movieId: 1,
      price: 10,
      numOfTickets: 100,
      screeningTimes: 'string',
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    await controller.getTicketByMovieId(movieId, res);
    expect(res.send).toHaveBeenCalled();
  });
});
