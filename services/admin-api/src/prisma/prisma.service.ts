import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        let url = process.env.DATABASE_URL;
        
        if (url) {
            url = url.trim();
            // Handle common misconfiguration
            if (url.startsWith('DATABASE_URL=')) {
                url = url.replace('DATABASE_URL=', '');
            }
            // Remove surrounding quotes
            if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
                url = url.substring(1, url.length - 1);
            }
            console.log(`[PrismaService] DATABASE_URL configured. Length: ${url.length}, Starts with: ${url.substring(0, 15)}...`);
        } else {
            console.error('[PrismaService] DATABASE_URL is MISSING');
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
            console.log('[PrismaService] Successfully connected to database');
        } catch (error) {
            console.error('[PrismaService] Connection error:', error.message);
            throw error;
        }
    }
}
