import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);

  constructor(private prisma: PrismaService) {}

  async generateReferralCode(userId: string): Promise<string> {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await this.prisma.user.update({
      where: { id: userId },
      data: { referral_code: code },
    });
    return code;
  }

  async applyReferral(newUserId: string, code: string) {
    const referrer = await this.prisma.user.findFirst({
      where: { referral_code: code },
    });

    if (referrer) {
      // Logic for referral credit
      // e.g., Add $5 credit to both wallets
      this.logger.log(`Referral code ${code} applied for new user ${newUserId}. Referrer: ${referrer.id}`);
      
      // Update new user's referred_by
      await this.prisma.user.update({
        where: { id: newUserId },
        data: { referred_by: referrer.id },
      });
    }
  }
}
