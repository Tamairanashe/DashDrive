import { Module } from '@nestjs/common';
import { MobileAuthController } from './auth/mobile-auth.controller';
import { MobileDashboardController } from './dashboard/mobile-dashboard.controller';
import { MobileOrdersController } from './orders/mobile-orders.controller';
import { MobileProductsController } from './products/mobile-products.controller';
import { MobileWalletController } from './wallet/mobile-wallet.controller';
import { MobileSettingsController } from './settings/mobile-settings.controller';
import { MobileNotificationsController } from './notifications/mobile-notifications.controller';
import { BusinessHoursService } from './settings/business-hours.service';
import { MobileNotificationsService } from './notifications/mobile-notifications.service';
import { AuthModule } from '../../auth/auth.module';
import { AnalyticsModule } from '../../analytics/analytics.module';
import { OrdersModule } from '../../orders/orders.module';
import { ProductsModule } from '../../products/products.module';
import { WalletModule } from '../../wallet/wallet.module';
import { MerchantsModule } from '../../merchants/merchants.module';
import { StoresModule } from '../../stores/stores.module';

@Module({
    imports: [
        AuthModule,
        AnalyticsModule,
        OrdersModule,
        ProductsModule,
        WalletModule,
        MerchantsModule,
        StoresModule,
    ],
    controllers: [
        MobileAuthController,
        MobileDashboardController,
        MobileOrdersController,
        MobileProductsController,
        MobileWalletController,
        MobileSettingsController,
        MobileNotificationsController,
    ],
    providers: [
        BusinessHoursService,
        MobileNotificationsService,
    ],
})
export class MobileMerchantModule { }
