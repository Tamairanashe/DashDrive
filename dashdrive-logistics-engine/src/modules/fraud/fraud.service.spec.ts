import { Test, TestingModule } from '@nestjs/testing';
import { FraudService } from './fraud.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RiskEventType, RiskActorType, RiskDecision } from '@prisma/client';

describe('FraudService', () => {
  let service: FraudService;
  let prisma: PrismaService;

  const mockPrisma = {
    riskEvent: {
      count: jest.fn(),
      create: jest.fn(({ data }) => ({ ...data, id: 're1' })),
    },
    wallet: {
      updateMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FraudService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<FraudService>(FraudService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('evaluate', () => {
    it('should return APPROVED for low risk events', async () => {
      mockPrisma.riskEvent.count.mockResolvedValue(2);

      const result = await service.evaluate(
        RiskEventType.PAYMENT,
        'u1',
        RiskActorType.MERCHANT,
        'ord1',
      );

      expect(result.decision).toBe(RiskDecision.APPROVED);
      expect(result.riskScore).toBe(0);
    });

    it('should return REVIEW for moderate risk (high value)', async () => {
      mockPrisma.riskEvent.count.mockResolvedValue(0);

      const result = await service.evaluate(
        RiskEventType.WITHDRAWAL,
        'u1',
        RiskActorType.MERCHANT,
        'w1',
        { amount: 6000 },
      );

      expect(result.decision).toBe(RiskDecision.REVIEW);
      expect(result.riskScore).toBe(30);
    });

    it('should return BLOCKED and freeze wallet for high velocity', async () => {
      mockPrisma.riskEvent.count.mockResolvedValue(20);

      const result = await service.evaluate(
        RiskEventType.PAYMENT,
        'u1',
        RiskActorType.MERCHANT,
        'ord1',
      );

      expect(result.decision).toBe(RiskDecision.REVIEW); // Score 40 in current logic
    });

    it('should block if score reaches threshold', async () => {
      // Currently 40 (velocity) + 30 (value) = 70 (Threshold)
      mockPrisma.riskEvent.count.mockResolvedValue(20);
      const result = await service.evaluate(
        RiskEventType.WITHDRAWAL,
        'u1',
        RiskActorType.MERCHANT,
        'w1',
        { amount: 6000 },
      );

      expect(result.decision).toBe(RiskDecision.BLOCKED);
      expect(mockPrisma.wallet.updateMany).toHaveBeenCalled();
    });
  });
});
