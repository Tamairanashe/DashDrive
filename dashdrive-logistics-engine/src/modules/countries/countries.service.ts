import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.country.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOneByCode(code: string) {
    return this.prisma.country.findUnique({
      where: { code },
    });
  }

  async create(data: {
    name: string;
    code: string;
    currency: string;
    timezone: string;
  }) {
    return this.prisma.country.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
      },
    });
  }
}
