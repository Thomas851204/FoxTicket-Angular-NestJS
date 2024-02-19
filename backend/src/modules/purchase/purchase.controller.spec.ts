import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { JwtService } from '@nestjs/jwt';

describe('PurchaseController', () => {
  let controller: PurchaseController;
  let purchaseService: PurchaseService;

  const mockPurchaseService = {
    purchaseTickets: jest.fn((x) => x),
    getPurchaseByUserId: jest.fn((x) => x),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [PurchaseService, JwtService],
    })
      .overrideProvider(PurchaseService)
      .useValue(mockPurchaseService)
      .compile();

    controller = module.get<PurchaseController>(PurchaseController);
    purchaseService = module.get<PurchaseService>(PurchaseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should use purchase service', async () => {
    const mockPurchasedList = [
      { userId: 1, ticketId: 123, numberOfTickets: 2 },
      { userId: 1, ticketId: 345, numberOfTickets: 4 },
    ];
    const pS = jest.spyOn(purchaseService, 'purchaseTickets');

    const response = await controller.purchaseTickets(mockPurchasedList);
    expect(pS).toHaveBeenCalled();
  });
  it('should get all purchased tickets by user', async () => {
    const userId = 1;
    const mockReturnValue = [
      { movieId: 1, price: 10 },
      { movieId: 2, price: 10 },
    ];
    jest.spyOn(purchaseService, 'getPurchaseByUserId').mockResolvedValue([
      { movieId: 1, price: 10 },
      { movieId: 2, price: 10 },
    ]);
    const response = await controller.getPurchaseByUserId(userId);
    expect(response).toStrictEqual(mockReturnValue);
  });
});
