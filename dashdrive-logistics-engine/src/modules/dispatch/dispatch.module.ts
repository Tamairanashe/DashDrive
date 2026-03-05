import { Module, Global } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { DispatchProcessor } from './dispatch.processor';
import { DispatchGateway } from './dispatch.gateway';

const useMockRedis = process.env.USE_MOCK_REDIS === 'true';

@Global()
@Module({
    imports: [
        PrismaModule,
        ...(useMockRedis ? [] : [BullModule.registerQueue({ name: 'dispatch_queue' })]),
    ],
    providers: [
        DispatchService,
        DispatchGateway,
        ...(useMockRedis ? [] : [DispatchProcessor]),
    ],
    exports: [DispatchService],
})
export class DispatchModule { }
