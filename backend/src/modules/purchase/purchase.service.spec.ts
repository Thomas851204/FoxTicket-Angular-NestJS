import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Purchase } from '../../database/entities/purchase.entity';
import { TicketService } from '../ticket/ticket.service';
import { Ticket } from '../../database/entities/ticket.entity';
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};
export const purchaseRepositoryMockFactory: () => MockType<
  Repository<Purchase>
> = jest.fn(() => ({
  create: jest.fn((entity) => entity),
  save: jest.fn((entity) => entity),
  find: jest.fn((entity) => entity),
}));

export const ticketRepositoryMockFactory: () => MockType<Repository<Ticket>> =
  jest.fn(() => ({
    find: jest.fn((entity) => entity),
  }));

describe('PurchaseService', () => {
  let service: PurchaseService;
  let ticketService: TicketService;
  let purchaseRepoMock: MockType<Repository<Purchase>>;
  let ticketRepoMock: MockType<Repository<Ticket>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        {
          provide: getRepositoryToken(Purchase),
          useFactory: purchaseRepositoryMockFactory,
        },
        TicketService,
        {
          provide: getRepositoryToken(Ticket),
          useFactory: ticketRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
    ticketService = module.get<TicketService>(TicketService);
    purchaseRepoMock = module.get(getRepositoryToken(Purchase));
    ticketRepoMock = module.get(getRepositoryToken(Ticket));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be defined', () => {
    expect(purchaseRepoMock).toBeDefined();
  });
  describe('purchaseTickets', () => {
    const purchaseDto = [
      {
        userId: 1,
        ticketId: 2,
        numberOfTickets: 3,
      },
    ];
    it('should call create and save typeorm methods', async () => {
      const purchasedTicket = purchaseRepoMock.create(purchaseDto);
      purchaseRepoMock.save(purchasedTicket);
      const result = await service.purchaseTickets(purchaseDto);
      expect(purchaseRepoMock.create).toHaveBeenCalled();
      expect(purchaseRepoMock.save).toHaveBeenCalled();
    });
  });
  describe('getPurchaseByUserId', () => {
    const userId = 1;
    it('should call purchase find typeorm methods', async () => {
      purchaseRepoMock.find.mockReturnValue([1, 2, 3]);
      ticketRepoMock.find.mockReturnValue([4, 5]);
      ticketService.getTicketListByIds([1, 2, 3]);
      const result = await service.getPurchaseByUserId(userId);
      expect(purchaseRepoMock.find).toHaveBeenCalled();
    });
    it('should call ticket find typeorm method', async () => {
      purchaseRepoMock.find.mockReturnValue([1, 2, 3]);
      ticketRepoMock.find.mockReturnValue([4, 5]);
      ticketService.getTicketListByIds([1, 2, 3]);
      const result = await service.getPurchaseByUserId(userId);
      expect(ticketRepoMock.find).toHaveBeenCalled();
    });
    it('should return list', async () => {
      const mockViewModel = [
        {
          movieId: 987,
          price: 10,
        },
      ];
      purchaseRepoMock.find.mockReturnValue([1, 2, 3]);
      ticketRepoMock.find.mockReturnValue([4, 5]);
      jest
        .spyOn(ticketService, 'getTicketListByIds')
        .mockResolvedValue([{ movieId: 987, price: 10 }]);
      const result = await service.getPurchaseByUserId(userId);
      expect(result).toEqual(mockViewModel);
    });
  });
});
