import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  
  async onModuleInit() {
    let url = process.env.DATABASE_URL;
    
    if (url) {
      url = url.trim();
      
      // Strip DATABASE_URL= prefix
      if (url.startsWith('DATABASE_URL=')) {
        url = url.replace('DATABASE_URL=', '');
      }

      // Remove surrounding quotes
      if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
        url = url.substring(1, url.length - 1);
      }

      process.env.DATABASE_URL = url;
      this.logger.log(`DATABASE_URL cleaned. Length: ${url.length}, Protocol: ${url.substring(0, 10)}...`);
    }

    try {
      await this.$connect();
    } catch (error) {
      this.logger.error('Prisma connection error:', error.message);
      throw error;
    }
  }
}
