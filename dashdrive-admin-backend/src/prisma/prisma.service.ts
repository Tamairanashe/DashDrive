import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        let url = process.env.DATABASE_URL;
        
        if (!url) {
            console.error('[PrismaService] DATABASE_URL is UNDEFINED or EMPTY');
        } else {
            // Handle common misconfiguration where the key is included in the value
            if (url.startsWith('DATABASE_URL=')) {
                console.warn('[PrismaService] Detected "DATABASE_URL=" prefix in value. Stripping it.');
                url = url.replace('DATABASE_URL=', '');
                process.env.DATABASE_URL = url;
            }
            console.log(`[PrismaService] DATABASE_URL is ready. Length: ${url.length}, Protocol: ${url.substring(0, 10)}...`);
        }

        try {
            await this.$connect();
        } catch (error) {
            console.error('[PrismaService] Connection error:', error.message);
            throw error;
        }
    }
}
