import { Controller, Post, Param, UseGuards, Req, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('initiate/:orderId')
    @ApiOperation({ summary: 'Initiate a payment for an order' })
    @ApiResponse({ status: 201, description: 'Payment session successfully created' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    initiatePayment(@Req() req: any, @Param('orderId') orderId: string) {
        return this.paymentsService.initiatePayment(orderId, req.user.sub);
    }

    @Post('topup')
    @ApiOperation({ summary: 'Initiate a wallet top-up using MockGateway' })
    @ApiResponse({ status: 201, description: 'Top-up session URL created' })
    topUpWallet(@Req() req: any, @Body() data: { amount: number; currency: string }) {
        // Resolve ownerType securely
        let ownerType: 'CUSTOMER' | 'RIDER' | 'MERCHANT' | 'PLATFORM' = 'MERCHANT';
        if (req.user?.role === 'customer') ownerType = 'CUSTOMER';
        if (req.user?.role === 'rider') ownerType = 'RIDER';
        if (req.user?.role === 'admin') ownerType = 'PLATFORM';

        return this.paymentsService.topUpWallet(ownerType as any, req.user.id, data.amount, data.currency);
    }
}
