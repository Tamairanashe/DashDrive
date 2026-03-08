import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RiskEventType, RiskActorType, RiskDecision } from '@prisma/client';

@Injectable()
export class FraudService {
    private readonly logger = new Logger(FraudService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Evaluate risk for a specific event
     * Phase 1: Rule-based scoring
     */
    async evaluate(
        eventType: RiskEventType,
        actorId: string,
        actorType: RiskActorType,
        referenceId: string,
        metadata?: any
    ) {
        let riskScore = 0;
        const reasons: string[] = [];

        // 1. Velocity Checks (Recent actions by same actor)
        const recentEventsCount = await this.prisma.riskEvent.count({
            where: {
                actorId,
                actorType,
                createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) }, // Last 30 mins
            },
        });

        if (recentEventsCount > 10) {
            riskScore += 40;
            reasons.push('High activity velocity detected');
        }

        // 2. Advanced Heuristics
        if (eventType === RiskEventType.DELIVERY && metadata?.distance && metadata?.timeSeconds) {
            // Speed = Distance / Time
            const speedMps = metadata.distance / metadata.timeSeconds;
            const speedKmph = speedMps * 3.6;
            
            // Impossible speeds for non-flight vehicles (e.g. > 150km/h for delivery)
            if (speedKmph > 150) {
                riskScore += 80;
                reasons.push(`Impossible delivery speed detected: ${speedKmph.toFixed(1)} km/h (GPS Spoofing)`);
            }
        }

        if (actorType === RiskActorType.MERCHANT) {
            // Check for order padding (suspiciously high volume of small orders)
            const recentOrders = await this.prisma.order.count({
                where: {
                    merchantId: actorId,
                    createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
                }
            });
            if (recentOrders > 50) {
                riskScore += 50;
                reasons.push('Merchant order-padding velocity detected');
            }
        }

        // 3. Event-Specific Rules
        if (eventType === RiskEventType.WITHDRAWAL) {
            // Large withdrawal check
            const amount = metadata?.amount || 0;
            if (amount > 5000) {
                riskScore += 30;
                reasons.push('High value withdrawal request');
            }
        }

        if (eventType === RiskEventType.PAYMENT) {
            // Potential card testing or rapid payments
        }

        if (eventType === RiskEventType.DELIVERY) {
            // Logic for "Too fast" delivery (GPS spoofing detection placeholder)
        }

        // 3. Final Decision Logic
        let decision: RiskDecision = RiskDecision.APPROVED;

        if (riskScore >= 70) {
            decision = RiskDecision.BLOCKED;
        } else if (riskScore >= 30) {
            decision = RiskDecision.REVIEW;
        }

        this.logger.log(`Risk Evaluation: ${eventType} by ${actorType} ${actorId} - Score: ${riskScore} - Decision: ${decision}`);

        // Persist the event
        const riskEvent = await this.prisma.riskEvent.create({
            data: {
                eventType,
                actorId,
                actorType,
                referenceId,
                riskScore,
                decision,
                reasons: reasons as any,
            },
        });

        // Auto-freeze wallet if extremely high risk
        if (decision === RiskDecision.BLOCKED && (actorType === RiskActorType.MERCHANT || actorType === RiskActorType.RIDER)) {
            await this.prisma.wallet.updateMany({
                where: { ownerId: actorId, ownerType: actorType as any },
                data: { isFrozen: true },
            });
            this.logger.warn(`AUTOMATED ACTION: Wallet frozen for ${actorType} ${actorId} due to critical risk score`);
        }

        return riskEvent;
    }

    async getRiskEvents(limit = 50) {
        return this.prisma.riskEvent.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
}
