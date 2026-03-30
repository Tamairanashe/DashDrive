import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EventService {
  constructor(
    @Inject('EVENT_BUS') private readonly client: ClientProxy,
  ) {}

  /**
   * Publish an event to the message bus
   * @param pattern The event pattern/topic
   * @param payload The event data
   */
  async publish(pattern: string, payload: any) {
    console.log(`[EventBus] Publishing event: ${pattern}`, payload);
    return this.client.emit(pattern, {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }
}
