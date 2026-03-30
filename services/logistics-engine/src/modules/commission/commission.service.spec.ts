import { Test, TestingModule } from '@nestjs/testing';
import { CommissionService } from './commission.service';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { OrderStatus, WalletOwnerType } from '@prisma/client';

describe('CommissionService', () => {
  let service: CommissionService;
  let walletService: WalletService;

  const mockPrisma = {
    order: {
      findUnique: jest.fn(),
    },
  };

  const mockWalletService = {
    getWallet: jest.fn(),
    transfer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommissionService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: WalletService, useValue: mockWalletService },
      ],
    }).compile();

    service = module.get<CommissionService>(CommissionService);
    walletService = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processOrderSettlement', () => {
    it('should calculate and transfer correct amounts', async () => {
      const mockOrder = {
        id: 'ord1',
        orderNumber: 'DD-1',
        subtotal: 100,
        deliveryFee: 15,
        currency: 'USD',
        merchantId: 'm1',
        status: OrderStatus.DELIVERED,
        store: { commissionRate: 0.1 },
        delivery: { riderId: 'r1' },
      };

      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);
      mockWalletService.getWallet.mockImplementation((type, id) => ({
        id: `${type}_${id}`,
      }));

      await service.processOrderSettlement(mockOrder.id);

      // Platform: 100 * 0.1 = 10
      // Merchant: 100 - 10 = 90
      // Rider: 15

      expect(mockWalletService.transfer).toHaveBeenCalledWith(
        expect.any(String), // From Escrow
        'MERCHANT_m1',
        90,
        'ord1',
        'Payout for Order #DD-1',
      );

      expect(mockWalletService.transfer).toHaveBeenCalledWith(
        expect.any(String), // From Escrow
        'RIDER_r1',
        15,
        'ord1',
        'Delivery fee for Order #DD-1',
      );

      expect(mockWalletService.transfer).toHaveBeenCalledWith(
        expect.any(String), // From Escrow
        'PLATFORM_PLATFORM_REVENUE',
        10,
        'ord1',
        'Commission for Order #DD-1',
      );
    });
  });
});
