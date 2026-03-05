import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { AdminRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private prisma: PrismaService) { }

    @Get('roles')
    async getRoles() {
        // Since AdminRole is an enum, we'll define static metadata and fetch dynamic member counts
        const baseRoles = [
            {
                id: 'SUPER_ADMIN',
                name: 'Super Administrator',
                description: 'Full platform access across all modules.',
                permissions: 124,
                color: 'bg-slate-900',
            },
            {
                id: 'FLEET_MANAGER',
                name: 'Fleet Manager',
                description: 'Manage drivers, zones, and logistics.',
                permissions: 45,
                color: 'bg-[#0089D1]',
            },
            {
                id: 'SUPPORT_AGENT',
                name: 'Support Agent',
                description: 'Handle customer and merchant support tickets.',
                permissions: 18,
                color: 'bg-emerald-500',
            }
        ];

        // Fetch user counts per role
        const roleCounts = await this.prisma.adminUser.groupBy({
            by: ['role'],
            _count: {
                id: true,
            },
        });

        // Merge static data with dynamic counts
        const rolesWithCounts = baseRoles.map(roleDef => {
            const match = roleCounts.find(r => r.role === roleDef.id as AdminRole);
            return {
                ...roleDef,
                members: match ? match._count.id : 0,
                lastUpdate: new Date().toISOString(), // Mocking last update for UI purposes
            };
        });

        return {
            success: true,
            data: rolesWithCounts,
        };
    }
}
