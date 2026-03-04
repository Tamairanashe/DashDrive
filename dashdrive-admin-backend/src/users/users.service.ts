import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUser, AdminRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(email: string): Promise<AdminUser | null> {
        return this.prisma.adminUser.findUnique({
            where: { email },
        });
    }

    async findOneById(id: string): Promise<AdminUser | null> {
        return this.prisma.adminUser.findUnique({
            where: { id },
        });
    }

    async create(data: Partial<AdminUser>): Promise<AdminUser> {
        const existing = await this.findOne(data.email!);
        if (existing) {
            throw new ConflictException('Admin already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password!, 10);
        return this.prisma.adminUser.create({
            data: {
                email: data.email!,
                password: hashedPassword,
                name: data.name!,
                role: data.role || AdminRole.SUPPORT_AGENT,
            },
        });
    }

    async updateLastLogin(id: string) {
        return this.prisma.adminUser.update({
            where: { id },
            data: { lastLogin: new Date() },
        });
    }
}
