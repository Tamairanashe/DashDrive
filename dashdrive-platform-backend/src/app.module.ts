import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/core/auth/auth.module';
import { UserModule } from './modules/core/users/user.module';
import { DocumentModule } from './modules/core/documents/document.module';
import { NotificationModule } from './modules/core/notifications/notification.module';
import { LoanModule } from './modules/finance/loans/loan.module';
import { BnplModule } from './modules/finance/bnpl/bnpl.module';
import { VehicleModule } from './modules/finance/vehicles/vehicle.module';
import { PolicyModule } from './modules/insurance/policies/policy.module';
import { ClaimModule } from './modules/insurance/claims/claim.module';
import { BillingModule } from './modules/billing/billing.module';
import { EventBusModule } from './modules/core/event-bus/event-bus.module';
import { PartnerGatewayModule } from './modules/core/partner-gateway/partner-gateway.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { ApplicationsModule } from './modules/core/applications/applications.module';
import { FintechModule } from './modules/fintech/fintech.module';
import { SchoolModule } from './modules/core/schools/school.module';
import { StudentModule } from './modules/core/students/student.module';

// Super-App Service Modules
import { RideModule } from './modules/rides/ride.module';
import { HotelModule } from './modules/hotels/hotel.module';
import { EventBookingModule } from './modules/events/event.module';
import { RentalModule } from './modules/rentals/rental.module';
import { TransitModule } from './modules/transit/transit.module';
import { FuelModule } from './modules/fuel/fuel.module';

import { MarketplaceModule } from './modules/marketplace/marketplace.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EventBusModule,
    PartnerGatewayModule,
    IntegrationsModule,
    ApplicationsModule,
    FintechModule,
    SchoolModule,
    StudentModule,

    // Core & Finance (Adding missing modules)
    AuthModule,
    UserModule,
    DocumentModule,
    NotificationModule,
    LoanModule,
    BnplModule,
    VehicleModule,
    PolicyModule,
    ClaimModule,
    BillingModule,

    // Super-App Services
    RideModule,
    HotelModule,
    EventBookingModule,
    RentalModule,
    TransitModule,
    FuelModule,
    MarketplaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
