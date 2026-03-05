import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SurgeEngineService } from './surge.service';
import { DistanceCalculatorService } from './distance.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

export class PricingQuoteDto {
    countryCode: string;
    pickup_lat: number;
    pickup_lng: number;
    dropoff_lat: number;
    dropoff_lng: number;
    package_size: 'SMALL' | 'MEDIUM' | 'LARGE';
    delivery_type: 'STANDARD' | 'EXPRESS' | 'SCHEDULED';
    merchantPlan?: 'BASIC' | 'PRO' | 'ENTERPRISE';
}

@Injectable()
export class PricingService {
    private readonly logger = new Logger(PricingService.name);

    constructor(
        private prisma: PrismaService,
        private surgeEngine: SurgeEngineService,
        private distanceCalculator: DistanceCalculatorService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async getDeliveryQuote(dto: PricingQuoteDto) {
        // 1. Fetch Pricing Rule for Country
        const rule = await this.getPricingRule(dto.countryCode);

        // 2. Fetch Distance & Estimated Time
        const { distanceKm, estimatedTimeMin } = await this.distanceCalculator.calculateRouteDistance(
            { lat: dto.pickup_lat, lng: dto.pickup_lng },
            { lat: dto.dropoff_lat, lng: dto.dropoff_lng }
        );

        // 3. Base Calculation
        let baseFee = rule.baseFee;
        let distanceFee = distanceKm * rule.distanceFeeKm;
        let timeFee = estimatedTimeMin * rule.timeFeeMin;
        let serviceFee = rule.serviceFee;

        let totalBaseCost = baseFee + distanceFee + timeFee + serviceFee;

        // 4. Demand Multiplier (Dynamic Pricing)
        const surgeMultiplier = await this.surgeEngine.calculateDemandMultiplier(dto.pickup_lat, dto.pickup_lng);
        let currentCost = totalBaseCost * surgeMultiplier;

        // 5. Package Size Multiplier
        const packageMultiplier = await this.getPackageMultiplier(dto.package_size);
        currentCost = currentCost * packageMultiplier;

        // 6. Delivery Type Modifier
        if (dto.delivery_type === 'EXPRESS') {
            currentCost = currentCost * 1.5; // +50%
        } else if (dto.delivery_type === 'SCHEDULED') {
            currentCost = currentCost * 0.9; // -10% discount
        }

        // 7. Merchant Disounts
        if (dto.merchantPlan === 'PRO') {
            currentCost = currentCost * 0.9; // 10% discount
        } else if (dto.merchantPlan === 'ENTERPRISE') {
            currentCost = currentCost * 0.8; // 20% discount
        }

        // 8. Rider Payout Calculation
        const distributableCost = Math.max(0, currentCost - rule.serviceFee);
        const riderPayout = distributableCost * 0.65; // Rider gets 65% of the dynamic delivery fee
        const platformFee = currentCost - riderPayout;

        return {
            distance_km: Number(distanceKm.toFixed(2)),
            estimated_time: estimatedTimeMin,
            price: Number(currentCost.toFixed(2)),
            breakdown: {
                base_fee: Number((baseFee * surgeMultiplier).toFixed(2)),
                distance_fee: Number((distanceFee * surgeMultiplier).toFixed(2)),
                time_fee: Number((timeFee * surgeMultiplier).toFixed(2)),
                service_fee: Number(serviceFee.toFixed(2)),
                surge_multiplier: surgeMultiplier,
                package_multiplier: packageMultiplier
            },
            internal: {
                rider_payout: Number(riderPayout.toFixed(2)),
                platform_fee: Number(platformFee.toFixed(2)),
            }
        };
    }

    private async getPricingRule(countryCode: string) {
        const cacheKey = `pricing:rule:${countryCode}`;
        const cachedRule = await this.cacheManager.get<any>(cacheKey);

        if (cachedRule) return cachedRule;

        const rule = await this.prisma.pricingRule.findUnique({
            where: { countryCode, active: true }
        });

        if (!rule) {
            this.logger.warn(`No pricing rule found for ${countryCode}, using default fallback`);
            return {
                baseFee: 2.00,
                distanceFeeKm: 0.80,
                timeFeeMin: 0.10,
                serviceFee: 1.00
            };
        }

        await this.cacheManager.set(cacheKey, rule, 3600000); // 1 hour cache
        return rule;
    }

    private async getPackageMultiplier(size: string): Promise<number> {
        const cacheKey = `pricing:package:${size}`;
        const cachedMlp = await this.cacheManager.get<number>(cacheKey);

        if (cachedMlp) return cachedMlp;

        const pkg = await this.prisma.packagePricing.findUnique({
            where: { name: size.toUpperCase() }
        });

        const multiplier = pkg ? pkg.multiplier : 1.0;
        await this.cacheManager.set(cacheKey, multiplier, 3600000 * 24); // 24 hour cache
        return multiplier;
    }
}
