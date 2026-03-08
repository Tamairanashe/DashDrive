import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PlatformEvent } from '../../common/events/platform-events.js';

@Injectable()
export class EventBusService {
    private readonly logger = new Logger(EventBusService.name);

    constructor(
        @Inject('PLATFORM_EVENT_BUS') private readonly client: ClientProxy,
    ) { }

    async publish(event: PlatformEvent, data: any) {
        this.logger.log(`Publishing event: ${event}`);
        return this.client.emit(event, data);
    }
}
