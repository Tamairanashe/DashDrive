import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppMode } from '@prisma/client';
import { LogisticsIntegrationService } from '../../integrations/logistics-engine.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private logisticsIntegration: LogisticsIntegrationService,
  ) {}

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        driver_profile: true,
        wallet: true,
      },
    });
  }

  async syncUser(firebaseUser: any) {
    const email = firebaseUser.email || `${firebaseUser.uid}@example.com`;
    return this.prisma.user.upsert({
      where: { id: firebaseUser.uid },
      update: {
        email,
      },
      create: {
        id: firebaseUser.uid,
        email,
        password_hash: '',
        active_mode: AppMode.CUSTOMER,
      },
      include: {
        wallet: true,
      },
    });
  }

  async switchMode(userId: string, newMode: AppMode) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { driver_profile: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (newMode === AppMode.DRIVER) {
      if (!user.is_driver) {
        throw new BadRequestException('User is not registered as a driver');
      }
      if (user.driver_profile?.verification_status !== 'verified') {
        throw new BadRequestException('Driver profile is not verified');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { active_mode: newMode },
    });
  }

  async becomeDriver(userId: string, driverData: any) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        is_driver: true,
        driver_profile: {
          upsert: {
            create: {
              ...driverData,
              verification_status: 'pending',
            },
            update: {
              ...driverData,
            },
          },
        },
      },
      include: { driver_profile: true },
    });

    await this.syncRider(user);

    return user;
  }

  async updateDriverProfile(userId: string, driverData: any) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        driver_profile: {
          update: driverData,
        },
      },
      include: { driver_profile: true },
    });

    await this.syncRider(user);

    return user;
  }

  private async syncRider(user: any) {
    if (!user.is_driver || !user.driver_profile) return;

    // Auto-provision or Update in Logistics Engine
    return this.logisticsIntegration.provisionRider({
      userId: user.id,
      name: user.email, // Use email or name if profile exists
      phone: user.phone || '',
      vehicleType: user.driver_profile.vehicle_type || 'economy',
    });
  }
}
