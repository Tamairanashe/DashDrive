import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    UseGuards,
    Req,
} from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingGateway } from './pricing.gateway';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('pricing')
@Controller('pricing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PricingController {
    constructor(
        private readonly pricingService: PricingService,
        private readonly pricingGateway: PricingGateway,
    ) { }

    @Post('offer')
    @ApiOperation({ summary: 'Customer proposes a delivery fee' })
    async createOffer(@Body() data: { orderId: string; proposedFee: number }) {
        const offer = await this.pricingService.createOffer(
            data.orderId,
            data.proposedFee,
        );
        // In production, we would get nearby riders from DispatchService
        // For now, we'll assume a broadcast is handled by the system later
        return offer;
    }

    @Post('bid')
    @ApiOperation({ summary: 'Rider submits a counter-offer or accepts proposed fee' })
    async submitBid(
        @Req() req: any,
        @Body() data: { offerId: string; bidAmount: number },
    ) {
        const bid = await this.pricingService.submitBid(
            data.offerId,
            req.user.sub,
            data.bidAmount,
        );
        this.pricingGateway.emitNewBid(data.offerId, bid);
        return bid;
    }

    @Get('offer/:offerId/bids')
    @ApiOperation({ summary: 'Get all active bids for an offer' })
    async getBids(@Param('offerId') offerId: string) {
        return this.pricingService.getOfferBids(offerId);
    }

    @Patch('bid/:bidId/accept')
    @ApiOperation({ summary: 'Customer accepts a specific bid' })
    async acceptBid(@Param('bidId') bidId: string) {
        const assignment = await this.pricingService.acceptBid(bidId);
        // Get offerId to notify room
        const bid = await this.pricingService['prisma'].riderBid.findUnique({
            where: { id: bidId },
        });
        if (bid) {
            this.pricingGateway.emitOfferAccepted(bid.offerId, assignment);
        }
        return assignment;
    }
}
