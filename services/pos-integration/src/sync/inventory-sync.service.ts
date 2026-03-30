import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashDriveApiService } from '../dashdrive-api/dashdrive-api.service';

@Injectable()
export class InventorySyncService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly api: DashDriveApiService,
    ) {}

    async processInventoryUpdate(merchantId: string, itemUpdates: any[]) {
        console.log(`[InventorySync] Processing updates for ${merchantId}`);
        
        const connection = await this.prisma.posConnection.findFirst({
            where: { merchantId, isActive: true }
        });

        if (!connection) return { error: 'No active connection' };

        try {
            await this.api.pushInventory(merchantId, itemUpdates);

            await this.prisma.posSyncLog.create({
                data: {
                    connectionId: connection.id,
                    syncType: 'INVENTORY',
                    status: 'SUCCESS',
                    payload: itemUpdates
                }
            });

            return { success: true };
        } catch (error) {
            console.error(`[InventorySync] Failed:`, error);
            return { error: error.message };
        }
    }
}
