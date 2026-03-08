import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { InvoicingService } from './invoicing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
    constructor(
        private invoicingService: InvoicingService,
        private prisma: PrismaService
    ) {}

    @Get('statements/merchant/:id')
    @Roles('admin', 'superadmin')
    async getMerchantStatement(
        @Param('id') id: string,
        @Query('days') days?: string
    ) {
        const d = parseInt(days || '7') || 7;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - d);

        return this.invoicingService.generateMerchantStatement(id, startDate, endDate);
    }

    @Get('wallets')
    @Roles('admin', 'superadmin')
    async getAllMerchantWallets() {
        const wallets = await this.prisma.wallet.findMany({
            where: { ownerType: 'MERCHANT' },
            select: {
                id: true,
                ownerId: true,
                balance: true,
                currency: true,
                isFrozen: true,
                createdAt: true
            },
            orderBy: { balance: 'desc' }
        });
        
        return wallets;
    }
}
