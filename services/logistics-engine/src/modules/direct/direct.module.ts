import { Module } from '@nestjs/common';
import { DirectController } from './direct.controller';
import { DirectService } from './direct.service';
import { DispatchModule } from '../dispatch/dispatch.module';

@Module({
  imports: [DispatchModule],
  controllers: [DirectController],
  providers: [DirectService],
  exports: [DirectService],
})
export class DirectModule {}
