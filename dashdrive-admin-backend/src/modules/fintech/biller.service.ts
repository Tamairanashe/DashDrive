import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BillerService {
  constructor(private prisma: PrismaService) {}

  async listActive() {
    return (this.prisma as any).biller.findMany({
      where: { isActive: true },
    });
  }

  async create(data: {
    name: string;
    category: string;
    billerCode: string;
    icon?: string;
    color?: string;
    metadata?: any;
  }) {
    return (this.prisma as any).biller.create({
      data,
    });
  }

  async seedDefaultBillers() {
    const defaultBillers = [
      { name: 'ZESA Prepaid', category: 'Electricity', billerCode: 'ZESA_PREPAID', icon: 'ThunderboltOutlined', color: '#fbbf24' },
      { name: 'City of Harare', category: 'Council', billerCode: 'CITY_OF_HARARE', icon: 'EnvironmentOutlined', color: '#3b82f6' },
      { name: 'TelOne Voice', category: 'Telecommunications', billerCode: 'TELONE_VOICE', icon: 'GlobalOutlined', color: '#10b981' },
      { name: 'Econet Airtime', category: 'Airtime', billerCode: 'ECONET_AIRTIME', icon: 'PhoneOutlined', color: '#8b5cf6' },
    ];

    for (const biller of defaultBillers) {
      await (this.prisma as any).biller.upsert({
        where: { billerCode: biller.billerCode },
        update: {},
        create: biller,
      });
    }
  }
}
