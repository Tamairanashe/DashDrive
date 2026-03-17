```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    let url = process.env.DATABASE_URL;
    
    if (url) {
      url = url.trim();
      // Remove surrounding quotes
      if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
        url = url.substring(1, url.length - 1);
      }

      process.env.DATABASE_URL = url;
      console.log(`DATABASE_URL cleaned. Length: ${url.length}, Protocol: ${url.substring(0, 10)}...`);
    }

    try {
      await this.$connect();
    } catch (error) {
      console.error('Prisma connection error:', error.message);
      throw error;
    }
  }
}
