import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DocumentController],
})
export class DocumentModule {}
