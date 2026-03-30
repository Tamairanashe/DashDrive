import { Module } from '@nestjs/common';
import { HostingService } from './hosting.service';
import { HostingController } from './hosting.controller';

@Module({
  providers: [HostingService],
  controllers: [HostingController]
})
export class HostingModule {}
