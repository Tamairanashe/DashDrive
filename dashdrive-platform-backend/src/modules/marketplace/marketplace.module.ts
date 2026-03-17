import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MerchantController } from './merchant.controller';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceGateway } from './marketplace.gateway';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../core/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MarketplaceController, MerchantController],
  providers: [MarketplaceService, MarketplaceGateway],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
