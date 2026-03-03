import { Module, OnModuleInit } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';

@Module({
    providers: [NotificationsService, NotificationsProcessor],
    exports: [NotificationsService],
})
export class NotificationsModule implements OnModuleInit {
    constructor(private processor: NotificationsProcessor) { }

    onModuleInit() {
        // Processor is instantiated via DI and starts its worker in constructor
        console.log('Notifications Module Initialized');
    }
}
