import { Controller, Post, Body, Param, Headers, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MockPosProvider } from '../providers/mock-pos.provider';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { MenuSyncService } from '../sync/menu-sync.service';
import { InventorySyncService } from '../sync/inventory-sync.service';

@Controller('webhooks')
export class WebbookController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mockProvider: MockPosProvider,
    private readonly configService: ConfigService,
    private readonly menuSync: MenuSyncService,
    private readonly inventorySync: InventorySyncService,
    @InjectQueue('pos-sync-queue') private readonly syncQueue: Queue,
  ) {}

  @Post(':provider')
  async handleWebhook(
    @Param('provider') provider: string,
    @Headers('x-signature') signature: string,
    @Body() payload: any,
  ) {
    console.log(`[Webhook Ingress] Received payload from ${provider}`);
    
    // 1. Identify Connection
    const connection = await this.prisma.posConnection.findFirst({
        where: { isActive: true } // Simplified for mock
    });

    if (!connection) {
        throw new BadRequestException('No active POS connection found');
    }

    // 2. Parse Webhook via Provider
    const { isValid, eventType, normalizedData } = this.mockProvider.parseWebhook(
        payload, 
        signature, 
        connection.webhookSecret || ''
    );

    if (!isValid) {
        throw new BadRequestException('Invalid webhook signature');
    }

    // 3. Dispatch Job (Queue or Sync Bypass)
    const useBypass = this.configService.get('MOCK_REDIS') === 'true';

    if (useBypass) {
        console.log(`[Webhook Ingress] Bypassing queue for sync: ${eventType}`);
        // Mimic background processing
        this.processDirectly(connection, eventType, normalizedData);
    } else {
        await this.syncQueue.add('process-sync', {
            connectionId: connection.id,
            merchantId: connection.merchantId,
            provider: connection.provider,
            eventType,
            data: normalizedData
        });
    }

    return { received: true, jobDispatch: useBypass ? 'sync-bypass' : 'queue-success', timestamp: new Date().toISOString() };
  }

  private async processDirectly(connection: any, eventType: string, data: any) {
    try {
        if (eventType === 'MENU_UPDATE') {
            await this.menuSync.pullMenuFromPos(connection.merchantId, connection.provider);
        } else if (eventType === 'INVENTORY_UPDATE') {
            await this.inventorySync.processInventoryUpdate(connection.merchantId, [data]);
        }
    } catch (err) {
        console.error(`[Sync Bypass] Failed to process ${eventType}:`, err);
    }
  }
}
