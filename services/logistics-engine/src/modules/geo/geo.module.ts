import { Module, Global } from '@nestjs/common';
import { GeoService } from './geo.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [GeoService],
  exports: [GeoService],
})
export class GeoModule {}
