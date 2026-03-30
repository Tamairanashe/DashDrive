import { Controller, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { NegotiationService } from './negotiation.service';
import { CreateNegotiatedTripDto } from './dto/create-negotiated-trip.dto';
import { CounterOfferDto } from './dto/counter-offer.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('negotiation')
@Controller('negotiation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NegotiationController {
  constructor(private readonly negotiationService: NegotiationService) {}

  @Post('create-trip')
  @ApiOperation({ summary: 'Create a new negotiated ride or parcel trip' })
  @ApiResponse({
    status: 201,
    description: 'Trip successfully created and broadcast initiated',
  })
  async createTrip(@Req() req: any, @Body() dto: CreateNegotiatedTripDto) {
    return this.negotiationService.createNegotiatedTrip({
      ...dto,
      customerId: req.user.sub,
    });
  }

  @Post('counter-offer')
  @ApiOperation({
    summary: 'Submit a counter-offer for a trip request (Driver only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Counter-offer successfully submitted',
  })
  async counterOffer(@Req() req: any, @Body() dto: CounterOfferDto) {
    // In a real scenario, we would verify the user role is RIDER/DRIVER
    return this.negotiationService.submitCounterOffer(
      req.user.sub,
      dto.offerId,
      dto.bidAmount,
    );
  }

  @Post('accept-bid/:orderId/:bidId')
  @ApiOperation({
    summary: 'Accept a specific rider/driver bid (Rider/Customer choice)',
  })
  @ApiResponse({ status: 200, description: 'Bid accepted, trip assigned' })
  async acceptBid(
    @Req() req: any,
    @Param('orderId') orderId: string,
    @Param('bidId') bidId: string,
  ) {
    return this.negotiationService.acceptNegotiatedOffer(orderId, bidId);
  }
}
