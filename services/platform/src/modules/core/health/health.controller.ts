import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check() {
    const start = Date.now();
    let dbStatus = 'ok';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }

    return {
      status: dbStatus === 'ok' ? 'healthy' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        memory: {
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        },
      },
      responseTime: `${Date.now() - start}ms`,
    };
  }
}
