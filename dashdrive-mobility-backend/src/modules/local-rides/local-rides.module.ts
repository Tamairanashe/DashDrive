import { Module } from '@nestjs/common';
import { LocalRidesService } from './local-rides.service';
import { LocalRidesGateway } from './local-rides.gateway';
import { LocalRidesController } from './local-rides.controller';
import { CancellationService } from './cancellation.service';
import { FraudService } from './fraud.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LocalRidesController],
  providers: [LocalRidesService, LocalRidesGateway, CancellationService, FraudService],
  exports: [LocalRidesService],
})
export class LocalRidesModule {}
