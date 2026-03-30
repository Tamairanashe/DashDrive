import { Module, OnModuleInit, Global } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsConsumer } from './notifications.consumer';
import { PrismaModule } from '../../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [NotificationsService, NotificationsProcessor],
  controllers: [NotificationsConsumer],
  exports: [NotificationsService],
})
export class NotificationsModule implements OnModuleInit {
  constructor(private processor: NotificationsProcessor) {}

  onModuleInit() {
    // Processor is instantiated via DI and starts its worker in constructor
    console.log('Notifications Module Initialized');
  }
}
