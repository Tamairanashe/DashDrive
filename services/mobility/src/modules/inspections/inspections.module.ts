import { Module } from '@nestjs/common';
import { InspectionsService } from './inspections.service';
import { InspectionsController } from './inspections.controller';
import { TripsModule } from '../trips/trips.module';

@Module({
  imports: [TripsModule],
  providers: [InspectionsService],
  controllers: [InspectionsController],
})
export class InspectionsModule {}
