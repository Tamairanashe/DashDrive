import { Module } from '@nestjs/common';
import { SchoolRunController } from './school-run.controller';
import { SchoolRunService } from './school-run.service';
import { DeliveriesModule } from '../deliveries/deliveries.module';

@Module({
  imports: [DeliveriesModule],
  controllers: [SchoolRunController],
  providers: [SchoolRunService],
  exports: [SchoolRunService],
})
export class SchoolRunModule {}
