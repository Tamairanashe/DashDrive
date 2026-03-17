import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        const url = process.env.DATABASE_URL;
        if (!url) {
            console.error('[PrismaService] DATABASE_URL is UNDEFINED or EMPTY');
        } else {
            console.log(`[PrismaService] DATABASE_URL is defined. Length: ${url.length}, Prefix: ${url.substring(0, 10)}...`);
        }
        try {
            await this.$connect();
        } catch (error) {
            console.error('[PrismaService] Connection error:', error.message);
            throw error;
        }
    }
}
