import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MenuSyncService } from '../sync/menu-sync.service';
import { OrderSyncService } from '../sync/order-sync.service';
import { InventorySyncService } from '../sync/inventory-sync.service';

@Processor('pos-sync-queue')
export class PosSyncProcessor extends WorkerHost {
  constructor(
    private readonly menuSync: MenuSyncService,
    private readonly orderSync: OrderSyncService,
    private readonly inventorySync: InventorySyncService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { connectionId, merchantId, provider, eventType, data } = job.data;
    console.log(`[Queue Processor] Processing job ${job.id} - ${eventType}`);

    try {
        switch (eventType) {
            case 'MENU_UPDATE':
                return await this.menuSync.pullMenuFromPos(merchantId, provider);
            
            case 'ORDER_CREATED':
                // Note: Logic for orders usually goes the other way (DashDrive -> POS)
                // but some POS systems push incoming orders too.
                return { skipped: 'Order ingress not yet implemented' };

            case 'INVENTORY_UPDATE':
                return await this.inventorySync.processInventoryUpdate(merchantId, [data]);

            default:
                console.log(`[Queue Processor] Unhandled event type: ${eventType}`);
                return { status: 'unhandled' };
        }
    } catch (error) {
        console.error(`[Queue Processor] Error processing job ${job.id}:`, error);
        throw error;
    }
  }
}
