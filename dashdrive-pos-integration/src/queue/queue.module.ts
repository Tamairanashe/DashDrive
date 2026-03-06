import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PosSyncProcessor } from './pos-sync.processor';
import { SyncModule } from '../sync/sync.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
const RedisMock = require('ioredis-mock');

@Module({
  imports: [
    SyncModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const useMock = config.get('MOCK_REDIS') === 'true';
        if (useMock) {
          console.log('[Queue] Using ioredis-mock for local development');
          return {
            connection: new RedisMock(),
          };
        }
        return {
          connection: {
            host: config.get('REDIS_HOST') || 'localhost',
            port: parseInt(config.get('REDIS_PORT') || '6379', 10),
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'pos-sync-queue',
    }),
  ],
  providers: [PosSyncProcessor],
  exports: [BullModule],
})
export class QueueModule {}
