import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { DispatchService } from './dispatch.service';

@Processor('dispatch_queue')
export class DispatchProcessor extends WorkerHost {
    private readonly logger = new Logger(DispatchProcessor.name);

    constructor(private readonly dispatchService: DispatchService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case 'process_dispatch':
                this.logger.log(`Processing dispatch for delivery ${job.data.deliveryId} (Radius: ${job.data.radius || 5}km)`);
                await this.dispatchService.processDispatch(job.data.deliveryId, job.data.radius);
                break;
            case 'dispatch_timeout':
                this.logger.log(`Handling timeout for delivery ${job.data.deliveryId} (Last Radius: ${job.data.currentRadius}km)`);
                await this.dispatchService.handleDispatchTimeout(job.data);
                break;
            default:
                this.logger.warn(`Unknown job name: ${job.name}`);
        }
    }
}
