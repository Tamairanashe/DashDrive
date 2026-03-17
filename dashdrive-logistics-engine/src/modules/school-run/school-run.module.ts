import { Module } from '@nestjs/common';
import { SchoolRunController } from './school-run.controller';
import { SchoolRunService } from './school-run.service';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { DispatchModule } from '../dispatch/dispatch.module';

@Module({
  imports: [DeliveriesModule, DispatchModule],
  controllers: [SchoolRunController],
  providers: [SchoolRunService],
  exports: [SchoolRunService],
})
export class SchoolRunModule {}
