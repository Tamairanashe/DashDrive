import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

    async initiatePayment(orderId: string, merchantId: string) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, merchantId },
            include: {
                store: {
                    include: {
                        merchant: {
                            include: { country: true },
                        },
                    },
                },
            },
        });

        if (!order) throw new NotFoundException('Order not found or unauthorized');

        const countryCode = order.store.merchant.country.code;
        const gateway = this.resolveGateway(countryCode);

        const transaction = await this.prisma.transaction.create({
            data: {
                orderId: order.id,
                storeId: order.storeId,
                merchantId: order.merchantId,
                gateway,
                currency: order.currency,
                amount: order.totalAmount,
                status: PaymentStatus.PENDING,
            },
        });

        // Route to appropriate gateway (Mock integration)
        const paymentUrl = await this.processGatewayPayment(
            gateway,
            transaction,
            order,
        );

        return {
            transactionId: transaction.id,
            gateway,
            paymentUrl,
            amount: order.totalAmount,
            currency: order.currency,
        };
    }

    private resolveGateway(countryCode: string): string {
        switch (countryCode) {
            case 'ZW':
                return 'paynow';
            case 'NG':
                return 'paystack';
            case 'KE':
                return 'flutterwave';
            case 'ZA':
                return 'yoco';
            default:
                return 'stripe';
        }
    }

    private async processGatewayPayment(
        gateway: string,
        transaction: any,
        order: any,
    ) {
        // Placeholder URLs (In production, this would call the gateway's API to create a session)
        if (gateway === 'stripe') {
            return `https://checkout.stripe.com/pay/${transaction.id}?order=${order.orderNumber}`;
        }

        if (gateway === 'paystack') {
            return `https://paystack.com/pay/${transaction.id}?ref=${order.orderNumber}`;
        }

        if (gateway === 'paynow') {
            return `https://paynow.co.zw/payment/${transaction.id}`;
        }

        if (gateway === 'flutterwave') {
            return `https://checkout.flutterwave.com/pay/${transaction.id}`;
        }

        return `https://dashdrive.mart/checkout/mock/${transaction.id}`;
    }
}
