import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CommissionService } from './commission.service';
import { LeadService } from './lead.service';
import { FintechStatus, PaymentStatus } from '@prisma/client';
import { PaynowProvider } from './providers/paynow.provider';
import { PaymentService } from './payment.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private prisma: PrismaService,
    private leadService: LeadService,
    private commissionService: CommissionService,
    private paynow: PaynowProvider,
    private paymentService: PaymentService,
  ) {}

  async handlePaynowWebhook(payload: any) {
    this.logger.log(`Received Paynow webhook for reference: ${payload.reference}`);

    const transaction = await this.prisma.transaction.findUnique({
      where: { id: payload.reference },
    });

    if (!transaction) {
      this.logger.error(`Transaction ${payload.reference} not found for Paynow webhook`);
      throw new BadRequestException('Transaction not found');
    }

    if (!this.paynow.verifyHash(payload, transaction.currency)) {
      this.logger.error('Invalid Paynow webhook hash');
      throw new BadRequestException('Security validation failed');
    }

    if (payload.status === 'Paid' || payload.status === 'Awaiting Delivery') {
      return this.paymentService.fulfillTransaction(transaction.id, payload);
    } else if (payload.status === 'Cancelled' || payload.status === 'Refused') {
      return (this.prisma.transaction as any).update({
        where: { id: transaction.id },
        data: {
          status: PaymentStatus.FAILED,
          gatewayTransactionId: payload.paynowreference,
          updatedAt: new Date(),
        },
      });
    }

    return transaction;
  }

  async handlePostback(payload: {
    event: string;
    leadUuid: string;
    transactionId: string;
    payoutAmount: number;
    currency?: string;
    metadata?: any;
  }) {
    this.logger.log(`Received webhook postback: ${payload.event} for lead ${payload.leadUuid}`);

    const lead = await this.leadService.getLeadByUuid(payload.leadUuid);
    if (!lead) {
      throw new BadRequestException(`Lead with UUID ${payload.leadUuid} not found`);
    }

    // 1. Transactional Integrity
    return this.prisma.$transaction(async (tx) => {
      let status: FintechStatus;

      switch (payload.event) {
        case 'converted':
          status = FintechStatus.CONVERTED;
          break;
        case 'funded':
          status = FintechStatus.FUNDED;
          break;
        case 'invalidated':
          status = FintechStatus.INVALIDATED;
          break;
        case 'reversed':
          status = FintechStatus.REVERSED;
          break;
        default:
          status = FintechStatus.APPLICATION_COMPLETED;
      }

      // 2. Update Lead Status
      await tx.fintechLead.update({
        where: { id: lead.id },
        data: { status },
      });

      // 3. Record Payout
      const payout = await tx.fintechPayout.upsert({
        where: { transactionId: payload.transactionId },
        update: {
          status,
          metadata: payload.metadata,
        },
        create: {
          transactionId: payload.transactionId,
          leadId: lead.id,
          amount: payload.payoutAmount,
          currency: payload.currency || 'USD',
          eventType: payload.event,
          status,
          metadata: payload.metadata,
        },
      });

      // 4. Record Commission if it's a positive payout
      if (payload.payoutAmount > 0 && (status === FintechStatus.CONVERTED || status === FintechStatus.FUNDED)) {
        await this.commissionService.recordCommission(tx, {
          payoutId: payout.id,
          provider: lead.provider,
          amount: payload.payoutAmount, // In real world, may be a percentage
        });
      }

      return { leadId: lead.id, status };
    });
  }

  async handlePOSTerminalWebhook(payload: {
    terminal_id: string;
    store_id: string;
    amount: number;
    currency: string;
    external_reference: string;
    timestamp: string;
    metadata?: any;
  }) {
    this.logger.log(`POS Sync: Terminal ${payload.terminal_id} | Amount: ${payload.amount}`);
    
    return this.paymentService.createPOSTransaction({
      terminalId: payload.terminal_id,
      storeId: payload.store_id,
      amount: payload.amount,
      currency: payload.currency,
      externalRef: payload.external_reference,
      metadata: payload.metadata
    });
  }
}
