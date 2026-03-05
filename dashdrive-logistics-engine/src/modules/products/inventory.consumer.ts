import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PlatformEvent } from '../../common/events/platform-events';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

@Controller()
export class InventoryConsumer {
    private readonly logger = new Logger(InventoryConsumer.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly eventBusService: EventBusService,
    ) { }

    @EventPattern(PlatformEvent.ORDER_CREATED)
    async handleOrderCreated(@Payload() data: any) {
        this.logger.log(`Received ${PlatformEvent.ORDER_CREATED} event for order ${data.orderNumber}`);

        for (const item of data.items) {
            try {
                const product = await this.prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });

                if (product.stock <= product.lowStockThreshold) {
                    this.logger.warn(`Low stock alert for product ${product.name}: ${product.stock}`);

                    // Create inventory alert log
                    await this.prisma.inventoryAlert.create({
                        data: {
                            merchantId: data.merchantId,
                            storeId: data.storeId,
                            productId: product.id,
                            stockLevel: product.stock,
                        }
                    });

                    // Publish Low Stock Event
                    await this.eventBusService.publish(PlatformEvent.LOW_STOCK_ALERT, {
                        merchantId: data.merchantId,
                        storeId: data.storeId,
                        productId: product.id,
                        productName: product.name,
                        stockLevel: product.stock,
                    });
                }
            } catch (error) {
                this.logger.error(`Failed to deduct stock for product ${item.productId}: ${error.message}`);
                // In a real system, we might trigger a compensating action (rollback order) or notify admin
            }
        }
    }
}
