import { Module } from '@nestjs/common';
import { WebbookController } from './webhook.controller';
import { ProviderModule } from '../providers/provider.module';
import { QueueModule } from '../queue/queue.module';
import { SyncModule } from '../sync/sync.module';

@Module({
  imports: [ProviderModule, QueueModule, SyncModule],
  controllers: [WebbookController],
})
export class WebhookModule {}
