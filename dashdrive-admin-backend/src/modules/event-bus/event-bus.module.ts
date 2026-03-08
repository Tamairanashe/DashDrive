import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventBusService } from './event-bus.service.js';

@Global()
@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'PLATFORM_EVENT_BUS',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
                        queue: 'admin_events_queue', // Specific queue for admin service
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
            },
        ]),
    ],
    providers: [EventBusService],
    exports: [EventBusService],
})
export class EventBusModule { }
