import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SchoolRunService } from './src/modules/school-run/school-run.service';
import { PlatformBridgeService } from './src/modules/integrations/platform-bridge.service';
import { PrismaService } from './src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

async function verify() {
  console.log('🚀 Starting School Run Automation Verification...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const schoolRunService = app.get(SchoolRunService);
  const bridge = app.get(PlatformBridgeService);
  const prisma = app.get(PrismaService);

  // 1. Ensure System Merchant AND STORE exist
  let systemMerchant = await (prisma.merchant as any).findFirst({ 
    where: { email: 'system@dashdrive.com' },
    include: { stores: true }
  });

  if (!systemMerchant) {
    console.log('🏗️ Seeding system merchant...');
    systemMerchant = await (prisma.merchant as any).create({
      data: {
        id: uuidv4(),
        name: 'DashDrive System',
        email: 'system@dashdrive.com',
        phone: '+000000000',
        isActive: true,
        merchantType: 'SYSTEM',
        countryId: (await prisma.country.findFirst())?.id || uuidv4()
      },
      include: { stores: true }
    });
  }

  if (systemMerchant.stores.length === 0) {
    console.log('🏗️ Seeding system store...');
    await (prisma.store as any).create({
      data: {
        id: uuidv4(),
        merchantId: systemMerchant.id,
        name: 'DashDrive System Store',
        latitude: -17.824,
        longitude: 31.050,
        address: 'System HQ',
        city: 'Harare',
        isActive: true,
        currency: 'USD',
        timezone: 'Africa/Harare'
      }
    });
  }

  // 2. Mock the bridge to avoid real API calls
  const studentId = uuidv4();

  (bridge as any).getStudentDetails = async (id: string) => {
    console.log(`[MOCK] Fetching details for student ${id}`);
    return {
      id: id,
      name: 'John Junior',
      parent: {
        name: 'John Senior',
        phone: '+263771234567',
        address: '123 Pinecrest Ave, Harare',
        latitude: -17.825,
        longitude: 31.049
      },
      school: {
        name: 'St. Georges College',
        address: '4 Borrowdale Rd, Harare',
        latitude: -17.805,
        longitude: 31.061
      }
    };
  };

  // 3. Create a mock subscription for TODAY
  const dayOfWeek = new Date().getDay();
  console.log(`📅 Current day of week: ${dayOfWeek}`);

  const subscription = await (prisma.schoolRunSubscription as any).create({
    data: {
      studentId: studentId,
      parentId: uuidv4(),
      schoolId: uuidv4(),
      pickupTime: '07:00',
      dropoffTime: '16:00',
      daysOfWeek: [dayOfWeek],
      startDate: new Date(),
      status: 'ACTIVE'
    }
  });

  console.log(`✅ Created mock subscription: ${subscription.id}`);

  // 4. Trigger generation
  console.log('🔄 Triggering daily delivery generation...');
  await schoolRunService.generateDailyDeliveries();

  // 5. Verify orders and deliveries in database
  const orderCount = await prisma.order.count({
    where: {
      orderNumber: { contains: subscription.id.substring(0, 8) }
    }
  });

  const deliveryCount = await prisma.delivery.count({
    where: {
      order: {
        orderNumber: { contains: subscription.id.substring(0, 8) }
      }
    }
  });

  console.log(`📊 Verification Results:`);
  console.log(`   - Orders Created: ${orderCount} (Expected: 2)`);
  console.log(`   - Deliveries Created: ${deliveryCount} (Expected: 2)`);

  if (orderCount >= 2 && deliveryCount >= 2) {
    console.log('✨ SUCCESS: School Run automation verified!');
  } else {
    console.error('❌ FAILURE: Expected 2 orders and 2 deliveries.');
  }

  // Cleanup
  console.log('🧹 Cleaning up mock data...');
  await (prisma.delivery as any).deleteMany({
    where: { order: { orderNumber: { contains: subscription.id.substring(0, 8) } } }
  });
  await (prisma.order as any).deleteMany({
    where: { orderNumber: { contains: subscription.id.substring(0, 8) } }
  });
  await (prisma.schoolRunSubscription as any).delete({
    where: { id: subscription.id }
  });

  await app.close();
  process.exit(orderCount >= 2 ? 0 : 1);
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
