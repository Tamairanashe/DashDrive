import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersGateway } from '../orders/orders.gateway';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
    constructor(
        private prisma: PrismaService,
        private ordersGateway: OrdersGateway,
        private paymentsService: PaymentsService,
    ) { }

    @Post('payment')
    @ApiOperation({ summary: 'Standardized internal webhook for payment confirmations' })
    async handlePaymentWebhook(@Body() body: any) {
        const { transactionId, status, gatewayTransactionId } = body;

        if (!transactionId || !status) {
            throw new BadRequestException('Invalid webhook payload');
        }

        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
        });

        if (!transaction) {
            throw new BadRequestException('Transaction not found');
        }

        if (transaction.status !== PaymentStatus.PENDING) {
            return { message: 'Transaction already processed', status: transaction.status };
        }

        let updatedTransaction;
        if (status === 'success') {
            updatedTransaction = await this.paymentsService.completePayment(transactionId, gatewayTransactionId);
            
            const updatedOrder = await this.prisma.order.update({
                where: { id: transaction.orderId },
                data: { status: OrderStatus.CONFIRMED },
                include: { items: true },
            });

            // Notify merchant in real-time
            this.ordersGateway.emitStatusUpdate(updatedOrder.storeId, updatedOrder);

            // Log history
            await this.prisma.orderStatusHistory.create({
                data: {
                    orderId: updatedOrder.id,
                    status: OrderStatus.CONFIRMED,
                    note: `Payment confirmed via ${transaction.gateway}`,
                }
            });
        } else {
            updatedTransaction = await this.prisma.transaction.update({
                where: { id: transactionId },
                data: {
                    status: PaymentStatus.FAILED,
                    gatewayTransactionId,
                },
            });
        }

        return { received: true, status: updatedTransaction.status };
    }

    @Post('topup')
    @ApiOperation({ summary: 'Standardized internal webhook for topup confirmations' })
    async handleTopupWebhook(@Body() body: any) {
        const { walletId, amount, gatewayTransactionId } = body;
        if (!walletId || !amount || !gatewayTransactionId) {
            throw new BadRequestException('Invalid topup webhook payload');
        }
        await this.paymentsService.completeTopUp(walletId, amount, gatewayTransactionId);
        return { received: true, status: 'SUCCESS' };
    }
}
