import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PlatformEvent } from '../../common/events/platform-events';

@Injectable()
export class EventBusService {
    private readonly logger = new Logger(EventBusService.name);

    constructor(
        @Inject('PLATFORM_EVENT_BUS') private readonly client: ClientProxy,
    ) { }

    async publish(event: PlatformEvent, data: any) {
        this.logger.log(`Publishing event: ${event}`);
        // Using emit for fire-and-forget events in EDA
        return this.client.emit(event, data);
    }
}
