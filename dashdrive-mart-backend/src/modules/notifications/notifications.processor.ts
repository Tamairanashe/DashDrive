import { Processor, Worker, Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

export class NotificationsProcessor {
    private readonly logger = new Logger(NotificationsProcessor.name);
    private worker: Worker;

    constructor() {
        // Initialize Firebase Admin (Assuming service account path is in env)
        if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
            admin.initializeApp({
                credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH),
            });
            this.logger.log('Firebase Admin initialized');
        } else {
            this.logger.warn('FIREBASE_SERVICE_ACCOUNT_PATH not found. Push notifications will be simulated.');
        }

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
                break;
            case 'SMS':
                this.logger.log(`[PROCESSOR] Sending SMS to ${phoneNumber}: ${message}`);
                break;
            case 'PUSH':
                this.logger.log(`[PROCESSOR] Sending Push to ${targetToken}: ${title}`);
                if (admin.apps.length > 0) {
                    try {
                        await admin.messaging().send({
                            token: targetToken,
                            notification: { title, body },
                            data: data || {},
                        });
                        this.logger.log(`[PROCESSOR] Push sent successfully to ${targetToken}`);
                    } catch (error) {
                        this.logger.error(`[PROCESSOR] FCM Error: ${error.message}`);
                    }
                }
                break;
            default:
                this.logger.warn(`Unknown notification type: ${type}`);
        }
    }
}
