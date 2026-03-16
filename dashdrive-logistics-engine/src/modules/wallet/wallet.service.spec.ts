import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { PrismaService } from '../../prisma/prisma.service';
import { FraudService } from '../fraud/fraud.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  WalletOwnerType,
  LedgerType,
  RiskDecision,
  RiskEventType,
  RiskActorType,
} from '@prisma/client';

describe('WalletService', () => {
  let service: WalletService;
  let prisma: PrismaService;
  let fraud: FraudService;

  const mockPrisma = {
    wallet: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    ledgerEntry: {
      create: jest.fn(),
    },
    withdrawalRequest: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrisma)),
  };

  const mockFraud = {
    evaluate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: FraudService, useValue: mockFraud },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    prisma = module.get<PrismaService>(PrismaService);
    fraud = module.get<FraudService>(FraudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('credit', () => {
    it('should credit funds and create ledger entry', async () => {
      const walletId = 'w1';
      mockPrisma.wallet.findUnique.mockResolvedValue({
        id: walletId,
        balance: 100,
        isFrozen: false,
      });

      await service.credit(walletId, 50, 'ref1', 'Initial deposit');

      expect(mockPrisma.ledgerEntry.create).toHaveBeenCalledWith({
        data: {
          walletId,
          amount: 50,
          type: LedgerType.CREDIT,
          referenceId: 'ref1',
          description: 'Initial deposit',
        },
      });
      expect(mockPrisma.wallet.update).toHaveBeenCalled();
    });

    it('should throw if wallet is frozen', async () => {
      mockPrisma.wallet.findUnique.mockResolvedValue({
        id: 'w1',
        isFrozen: true,
      });
      await expect(service.credit('w1', 50)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('requestWithdrawal', () => {
    it('should block withdrawal if fraud engine decides BLOCKED', async () => {
      mockPrisma.wallet.findUnique.mockResolvedValue({
        id: 'w1',
        ownerId: 'u1',
        ownerType: WalletOwnerType.MERCHANT,
        balance: 1000,
      });

      mockFraud.evaluate.mockResolvedValue({ decision: RiskDecision.BLOCKED });

      await expect(service.requestWithdrawal('w1', 500)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create withdrawal request if risk is approved', async () => {
      mockPrisma.wallet.findUnique.mockResolvedValue({
        id: 'w1',
        ownerId: 'u1',
        ownerType: WalletOwnerType.MERCHANT,
        balance: 1000,
      });

      mockFraud.evaluate.mockResolvedValue({ decision: RiskDecision.APPROVED });

      await service.requestWithdrawal('w1', 100);
      expect(mockPrisma.withdrawalRequest.create).toHaveBeenCalled();
    });
  });
});
