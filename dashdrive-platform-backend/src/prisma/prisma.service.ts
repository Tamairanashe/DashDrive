import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  
  constructor() {
    let url = process.env.DATABASE_URL;
    
    if (url) {
      url = url.trim();
      if (url.startsWith('DATABASE_URL=')) url = url.replace('DATABASE_URL=', '');
      if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
        url = url.substring(1, url.length - 1);
      }
      this.logger.log(`DATABASE_URL configured. Length: ${url.length}, Starts with: ${url.substring(0, 15)}...`);
    } else {
      this.logger.error('DATABASE_URL is MISSING');
    }

    super({
      datasources: {
        db: {
          url: url,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error('Prisma connection error:', error.message);
      throw error;
    }
  }
}
