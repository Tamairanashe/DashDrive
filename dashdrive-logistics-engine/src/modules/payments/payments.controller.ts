import { Controller, Post, Param, UseGuards, Req } from '@nestjs/common';
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
}
