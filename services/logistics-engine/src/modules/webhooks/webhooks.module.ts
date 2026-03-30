import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { BullModule } from '@nestjs/bullmq';
import { WebhookProcessor } from './webhook.processor';

const useMockRedis = process.env.USE_MOCK_REDIS === 'true';

@Module({
  imports: [
    ...(useMockRedis ? [] : [BullModule.registerQueue({ name: 'webhooks' })]),
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService, ...(useMockRedis ? [] : [WebhookProcessor])],
  exports: [WebhooksService],
})
export class WebhooksModule {}
