import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CountriesModule } from './modules/countries/countries.module';
import { MerchantsModule } from './modules/merchants/merchants.module';
import { StoresModule } from './modules/stores/stores.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { RidersModule } from './modules/riders/riders.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { GeoModule } from './modules/geo/geo.module';
import { ZonesModule } from './modules/zones/zones.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { CommissionModule } from './modules/commission/commission.module';
import { FraudModule } from './modules/fraud/fraud.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { EventBusModule } from './modules/event-bus/event-bus.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { DeveloperModule } from './modules/developer/developer.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { DirectModule } from './modules/direct/direct.module';
import { SupportModule } from './modules/support/support.module';
import { FinanceModule } from './modules/finance/finance.module';
import { EnterpriseModule } from './modules/enterprise/enterprise.module';
import { CmsModule } from './modules/cms/cms.module';
import { NegotiationModule } from './modules/negotiation/negotiation.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';

const useMockRedis = process.env.USE_MOCK_REDIS === 'true';

// Core modules — all modules included.
// DispatchModule and WebhooksModule internally handle mock mode.
const appModules = [
  ConfigModule.forRoot({ isGlobal: true }),
  CacheModule.registerAsync({
    isGlobal: true,
    useFactory: async (configService: ConfigService) => {
      if (useMockRedis) {
        console.warn('🚀 Cache: In-memory mode (no Redis)');
        return { ttl: 600 };
      }
      try {
        const { redisStore } = await import('cache-manager-redis-yet');
        return {
          store: await redisStore({
            socket: {
              host: configService.get('REDIS_HOST', 'localhost'),
              port: parseInt(configService.get('REDIS_PORT', '6379')),
            },
            ttl: 600,
          }),
        };
      } catch (error) {
        console.warn(
          '⚠️ Could not connect to Redis, falling back to in-memory cache',
        );
        return { ttl: 600 };
      }
    },
    inject: [ConfigService],
  }),
  // Only register BullMQ root if Redis is available
  ...(useMockRedis
    ? []
    : [
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            connection: {
              host: configService.get('REDIS_HOST', 'localhost'),
              port: configService.get<number>('REDIS_PORT', 6379),
              maxRetriesPerRequest: null,
            },
          }),
        }),
      ]),
  ScheduleModule.forRoot(),
  PrismaModule,
  AuthModule,
  CountriesModule,
  MerchantsModule,
  StoresModule,
  OrdersModule,
  ProductsModule,
  CategoriesModule,
  AnalyticsModule,
  PaymentsModule,
  RidersModule,
  ReviewsModule,
  DeliveryModule,
  MarketingModule,
  NotificationsModule,
  DispatchModule,
  PricingModule,
  GeoModule,
  ZonesModule,
  WalletModule,
  CommissionModule,
  FraudModule,
  MobileModule,
  EventBusModule,
  DeliveriesModule,
  DeveloperModule,
  WebhooksModule,
  DirectModule,
  SupportModule,
  FinanceModule,
  EnterpriseModule,
  CmsModule,
  NegotiationModule,
];

if (useMockRedis) {
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.warn(
    '🚀 MOCK MODE: Redis-dependent modules (Dispatch, Webhooks) are DISABLED.',
  );
  console.warn('   To enable them, set USE_MOCK_REDIS=false and start Redis.');
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

@Module({
  imports: appModules,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
