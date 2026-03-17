import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Triggering type refresh after schema expansion
  async onModuleInit() {
    await this.$connect();
  }
}
