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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    FirebaseModule,
    VehiclesModule,
    TripsModule,
    AuthModule,
    HostingModule,
    InspectionsModule,
    FinancialsModule,
    FavoritesModule,
    MessagesModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
