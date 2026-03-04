import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventBusService } from './event-bus.service';

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
                        queue: 'platform_events',
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
