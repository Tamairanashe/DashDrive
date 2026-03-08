import { Module } from '@nestjs/common';
import { StoresService } from './stores/stores.service';
import { StoresController } from './stores/stores.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class ManagementModule {}
