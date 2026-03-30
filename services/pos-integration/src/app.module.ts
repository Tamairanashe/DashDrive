import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.service';
import { DashDriveApiModule } from './dashdrive-api/dashdrive-api.module';
import { AuthModule } from './auth/auth.module';
import { WebhookModule } from './webhooks/webhook.module';
import { SyncModule } from './sync/sync.module';
import { QueueModule } from './queue/queue.module';
import { ProviderModule } from './providers/provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    DashDriveApiModule,
    AuthModule,
    WebhookModule,
    SyncModule,
    QueueModule,
    ProviderModule,
  ],
})
export class AppModule {}
