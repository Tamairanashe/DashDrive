import { Module } from '@nestjs/common';
import { MockPosProvider } from './mock-pos.provider';

@Module({
  providers: [MockPosProvider],
  exports: [MockPosProvider],
})
export class ProviderModule {}
