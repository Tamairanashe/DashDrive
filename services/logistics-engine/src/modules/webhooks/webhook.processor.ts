import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Processor('webhooks')
export class WebhookProcessor extends WorkerHost {
  private readonly logger = new Logger(WebhookProcessor.name);

  async process(job: Job<any>): Promise<any> {
    const { url, secret, event, payload, timestamp } = job.data;

    const body = JSON.stringify({
      event,
      payload,
      timestamp,
    });

    // Generate HMAC signature
    const signature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    try {
      await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          'X-DashDrive-Signature': signature,
          'X-DashDrive-Event': event,
          'User-Agent': 'DashDrive-Webhooks/1.0',
        },
        timeout: 10000, // 10s timeout
      });

      this.logger.log(`Successfully delivered webhook ${event} to ${url}`);
    } catch (error) {
      this.logger.error(
        `Failed to deliver webhook ${event} to ${url}: ${error.message}`,
      );
      throw error; // Rethrow to trigger BullMQ retry
    }
  }
}
