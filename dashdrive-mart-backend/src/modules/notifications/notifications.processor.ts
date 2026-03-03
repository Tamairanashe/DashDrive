import { Processor, Worker, Job } from 'bullmq';
import { Logger } from '@nestjs/common';

export class NotificationsProcessor {
    private readonly logger = new Logger(NotificationsProcessor.name);
    private worker: Worker;

    constructor() {
        this.worker = new Worker(
            'notifications',
            async (job: Job) => {
                await this.processNotification(job);
            },
            {
                connection: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                },
            }
        );

        this.worker.on('completed', (job) => {
            this.logger.log(`Job ${job.id} has completed!`);
        });

        this.worker.on('failed', (job, err) => {
            this.logger.error(`Job ${job?.id} failed with ${err.message}`);
        });
    }

    private async processNotification(job: Job) {
        const { type, to, subject, template, context, phoneNumber, message, targetToken, title, body, data } = job.data;

        switch (type) {
            case 'EMAIL':
                this.logger.log(`[PROCESSOR] Sending Email to ${to}...`);
                // Actual Nodemailer implementation would go here
                break;
            case 'SMS':
                this.logger.log(`[PROCESSOR] Sending SMS to ${phoneNumber}: ${message}`);
                // Actual Twilio implementation would go here
                break;
            case 'PUSH':
                this.logger.log(`[PROCESSOR] Sending Push to ${targetToken}: ${title}`);
                // Actual FCM implementation would go here
                break;
            default:
                this.logger.warn(`Unknown notification type: ${type}`);
        }
    }
}
