import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlatformConfigModule } from './platform-config/platform-config.module';
import { ManagementModule } from './management/management.module';
import { EventBusModule } from './modules/event-bus/event-bus.module';
import { RealTimeModule } from './modules/real-time/real-time.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { OperationsModule } from './modules/operations/operations.module';
import { RidersModule } from './modules/riders/riders.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { FintechModule } from './modules/fintech/fintech.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, 
    AuthModule, 
    UsersModule, 
    DashboardModule,
    OperationsModule,
    RidersModule,
    AlertsModule,
    FintechModule,
    // EventBusModule,
    // RealTimeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
