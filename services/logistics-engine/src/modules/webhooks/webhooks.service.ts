import { Injectable, Logger, Optional } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private prisma: PrismaService,
    @Optional() @InjectQueue('webhooks') private webhookQueue: Queue,
  ) {}

  async dispatch(merchantId: string, event: string, payload: any) {
    // 1. Fetch active webhook configurations for this merchant
    const configs = await this.prisma.webhookConfig.findMany({
      where: { merchantId, isActive: true },
    });

    for (const config of configs) {
      // Check if this config is listening for this event
      if (config.events.includes(event) || config.events.includes('*')) {
        // 2. Queue the webhook delivery
        if (!this.webhookQueue) {
          this.logger.warn(
            `[MOCK] Webhook queue not available. Skipping ${event} for ${config.url}`,
          );
          continue;
        }
        await this.webhookQueue.add(
          'deliver',
          {
            url: config.url,
            secret: config.secret,
            event,
            payload,
            timestamp: new Date().toISOString(),
          },
          {
            attempts: 5,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
          },
        );

        this.logger.debug(
          `Queued webhook ${event} for merchant ${merchantId} to ${config.url}`,
        );
      }
    }
  }

  async createConfig(
    merchantId: string,
    data: { url: string; events: string[] },
  ) {
    const secret = `whsec_${crypto.randomBytes(24).toString('hex')}`;
    return this.prisma.webhookConfig.create({
      data: {
        merchantId,
        url: data.url,
        events: data.events,
        secret,
        isActive: true,
      },
    });
  }

  async listConfigs(merchantId: string) {
    return this.prisma.webhookConfig.findMany({
      where: { merchantId },
    });
  }

  async deleteConfig(merchantId: string, id: string) {
    return this.prisma.webhookConfig.deleteMany({
      where: { id, merchantId },
    });
  }
}
