import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
          },
          ttl: 600, // 10 minutes default cache
        }),
      }),
    }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
