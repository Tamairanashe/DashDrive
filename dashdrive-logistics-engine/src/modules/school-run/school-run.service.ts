import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DispatchService } from '../dispatch/dispatch.service';
import { PlatformBridgeService } from '../integrations/platform-bridge.service';
import { OrderStatus, DeliveryStatus } from '@prisma/client';

@Injectable()
export class SchoolRunService {
  private readonly logger = new Logger(SchoolRunService.name);

  constructor(
    private prisma: PrismaService,
    private dispatchService: DispatchService,
    private platformBridge: PlatformBridgeService,
  ) {}

  async createSubscription(data: any) {
    // Schedule validation: prevent duplicate subscriptions for same student on overlapping days
    const existing = await this.prisma.schoolRunSubscription.findFirst({
      where: {
        studentId: data.studentId,
        status: 'ACTIVE',
        daysOfWeek: { hasSome: data.daysOfWeek },
        OR: [{ endDate: null }, { endDate: { gte: new Date(data.startDate) } }],
      },
    });

    if (existing) {
      throw new Error(`Active subscription already exists for this student on overlapping days (ID: ${existing.id})`);
    }

    return this.prisma.schoolRunSubscription.create({
      data: {
        studentId: data.studentId,
        parentId: data.parentId,
        schoolId: data.schoolId,
        pickupTime: data.pickupTime,
        dropoffTime: data.dropoffTime,
        daysOfWeek: data.daysOfWeek,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
  }

  async getSubscriptions(parentId: string) {
    return this.prisma.schoolRunSubscription.findMany({
      where: { parentId },
    });
  }

  async generateDailyDeliveries() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0-6 (Sunday-Saturday)

    const activeSubscriptions =
      await this.prisma.schoolRunSubscription.findMany({
        where: {
          status: 'ACTIVE',
          daysOfWeek: { has: dayOfWeek },
          startDate: { lte: today },
          OR: [{ endDate: null }, { endDate: { gte: today } }],
        },
      });

    this.logger.log(`Found ${activeSubscriptions.length} active school run subscriptions for today.`);

    const systemMerchant = await this.prisma.merchant.findFirst({
      where: { email: 'system@dashdrive.com' },
      include: { stores: true },
    });

    if (!systemMerchant || systemMerchant.stores.length === 0) {
      this.logger.error('System merchant or store not found for school run generation.');
      return;
    }

    const store = systemMerchant.stores[0];

    for (const sub of activeSubscriptions) {
      try {
        this.logger.log(`Processing school run for subscription ${sub.id}`);

        // Fetch student and school details from Platform Backend
        const student = await this.platformBridge.getStudentDetails(sub.studentId);
        if (!student || !student.parent || !student.school) {
          this.logger.warn(`Skipping school run ${sub.id}: Incomplete student data.`);
          continue;
        }

        const parent = student.parent;
        const school = student.school;

        // 1. Morning Run: Home -> School
        await this.createSchoolRunDelivery(
          sub.id,
          'MORNING',
          systemMerchant.id,
          store.id,
          parent.name,
          parent.phone,
          parent.address,
          parent.latitude,
          parent.longitude,
          school.name,
          school.address,
          school.latitude,
          school.longitude,
        );

        // 2. Afternoon Run: School -> Home
        await this.createSchoolRunDelivery(
          sub.id,
          'AFTERNOON',
          systemMerchant.id,
          store.id,
          parent.name,
          parent.phone,
          school.address,
          school.latitude,
          school.longitude,
          parent.name,
          parent.address,
          parent.latitude,
          parent.longitude,
        );

      } catch (error) {
        this.logger.error(
          `Failed to process school run ${sub.id}: ${error.message}`,
        );
      }
    }
  }

  private async createSchoolRunDelivery(
    subscriptionId: string,
    type: 'MORNING' | 'AFTERNOON',
    merchantId: string,
    storeId: string,
    customerName: string,
    customerPhone: string,
    pickupAddress: string,
    pickupLat: number,
    pickupLng: number,
    dropoffName: string,
    dropoffAddress: string,
    dropoffLat: number,
    dropoffLng: number,
  ) {
    const orderNumber = `SR-${subscriptionId.substring(0, 8)}-${type}-${new Date().toISOString().split('T')[0]}`;

    // Create Order with custom pickup
    const order = await this.prisma.order.upsert({
      where: { orderNumber },
      create: {
        merchantId,
        storeId,
        orderNumber,
        status: OrderStatus.READY,
        currency: 'USD',
        subtotal: 0,
        totalAmount: 0,
        customerName,
        customerPhone,
        pickupAddress,
        pickupLat,
        pickupLng,
        deliveryAddress: `${dropoffName}: ${dropoffAddress}`,
        deliveryLat: dropoffLat,
        deliveryLng: dropoffLng,
      } as any, // Cast to any because IDE might lag on prisma types
      update: {}, // Skip if already exists for today
    });

    // Create Delivery
    let delivery = await this.prisma.delivery.findUnique({
      where: { orderId: order.id },
    });

    if (!delivery) {
      delivery = await this.prisma.delivery.create({
        data: {
          orderId: order.id,
          status: DeliveryStatus.PENDING,
          vertical: 'SCHOOL_RUN',
        } as any, // Cast to any
      });
      
      // Trigger Dispatch
      await this.dispatchService.startDispatchFlow(order.id);
      this.logger.log(`Created and dispatched ${type} school run order ${order.orderNumber}`);
    }
  }
}
