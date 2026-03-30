import { Injectable } from '@nestjs/common';
import { DashDriveApiService } from '../dashdrive-api/dashdrive-api.service';
import { PrismaService } from '../prisma/prisma.service';
import { MockPosProvider } from '../providers/mock-pos.provider';

@Injectable()
export class MenuSyncService {
    constructor(
        private readonly api: DashDriveApiService,
        private readonly prisma: PrismaService,
        private readonly mockProvider: MockPosProvider,
    ) {}

    async pullMenuFromPos(merchantId: string, provider: string) {
        console.log(`[MenuSync] Starting sync for ${merchantId} (${provider})`);
        
        // 1. Get Connection
        const connection = await this.prisma.posConnection.findUnique({
            where: { merchantId_provider: { merchantId, provider: provider as any } }
        });

        if (!connection) return { error: 'Connection not found' };

        try {
            // 2. Fetch from POS
            const posResult = await this.mockProvider.fetchMenu(merchantId, connection.accessToken || '');
            if (!posResult.success) throw new Error(posResult.error);

            // 3. Normalization is handled by the provider in this mock
            const menuData = posResult.data;

            // 4. Push to DashDrive API
            await this.api.pushMenu(merchantId, menuData);

            // 5. Log Success
            await this.prisma.posSyncLog.create({
                data: {
                    connectionId: connection.id,
                    syncType: 'MENU',
                    status: 'SUCCESS',
                    payload: menuData
                }
            });

            return { success: true };
        } catch (error) {
            console.error(`[MenuSync] Failed:`, error);
            await this.prisma.posSyncLog.create({
                data: {
                    connectionId: connection.id,
                    syncType: 'MENU',
                    status: 'FAILED',
                    errorMessage: error.message
                }
            });
            throw error;
        }
    }
}
