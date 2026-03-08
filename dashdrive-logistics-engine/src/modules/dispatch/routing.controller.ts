import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('dispatch')
@Controller('dispatch/routing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RoutingController {
    constructor(private readonly routingService: RoutingService) { }

    @Get('riders/:id/optimal-route')
    @ApiOperation({ summary: 'Calculate and return the optimal delivery sequence for a rider (TSP)' })
    getOptimalRoute(@Param('id') id: string) {
        return this.routingService.optimizeBatch(id);
    }
}
