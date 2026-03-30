import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlatformBridgeService } from './platform-bridge.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PlatformBridgeService],
  exports: [PlatformBridgeService],
})
export class IntegrationsModule {}
