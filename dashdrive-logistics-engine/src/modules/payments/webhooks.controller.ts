import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersGateway } from '../orders/orders.gateway';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
    constructor(
        private prisma: PrismaService,
        private ordersGateway: OrdersGateway,
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

        const updatedTransaction = await this.prisma.transaction.update({
            where: { id: transactionId },
            data: {
                status: status === 'success' ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
                gatewayTransactionId,
            },
        });

        if (status === 'success') {
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
        }

        return { received: true, status: updatedTransaction.status };
    }
}
