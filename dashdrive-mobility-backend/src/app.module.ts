import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './providers/firebase/firebase.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { TripsModule } from './modules/trips/trips.module';
import { AuthModule } from './modules/auth/auth.module';
import { HostingModule } from './modules/hosting/hosting.module';
import { InspectionsModule } from './modules/inspections/inspections.module';
import { FinancialsModule } from './modules/financials/financials.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { MessagesModule } from './modules/messages/messages.module';
import { CityToCityModule } from './modules/city-to-city/city-to-city.module';
import { LocalRidesModule } from './modules/local-rides/local-rides.module';
import { TrustModule } from './modules/trust/trust.module';
import { OrdersModule } from './modules/orders/orders.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { GoogleMapsModule } from './providers/google-maps/google-maps.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    FirebaseModule,
    GoogleMapsModule,
    AuthModule,
    VehiclesModule,
    TripsModule,
    HostingModule,
    InspectionsModule,
    FinancialsModule,
    FavoritesModule,
    MessagesModule,
    CityToCityModule,
    LocalRidesModule,
    TrustModule,
    OrdersModule,
    DispatchModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
