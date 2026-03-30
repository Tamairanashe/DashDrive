import { Module } from '@nestjs/common';
import { MenuSyncService } from './menu-sync.service';
import { OrderSyncService } from './order-sync.service';
import { InventorySyncService } from './inventory-sync.service';
import { DashDriveApiModule } from '../dashdrive-api/dashdrive-api.module';
import { ProviderModule } from '../providers/provider.module';

@Module({
    imports: [DashDriveApiModule, ProviderModule],
    providers: [MenuSyncService, OrderSyncService, InventorySyncService],
    exports: [MenuSyncService, OrderSyncService, InventorySyncService]
})
export class SyncModule {}
