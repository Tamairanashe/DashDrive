import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DeliveriesService } from './src/modules/deliveries/deliveries.service';
import { DispatchService } from './src/modules/dispatch/dispatch.service';
import { PrismaService } from './src/prisma/prisma.service';
import { OrderStatus, DeliveryStatus } from '@prisma/client';
import * as crypto from 'crypto';

async function verify() {
  const uuidv4 = () => crypto.randomUUID();
  console.log('📦 Starting Direct Delivery Batching Verification...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const dispatchService = app.get(DispatchService);

  const country = await prisma.country.findFirst() || await prisma.country.create({
    data: { name: 'Zimbabwe', code: 'ZW', currency: 'USD', timezone: 'Africa/Harare' }
  });

  const mId = uuidv4();
  const merchant = await prisma.merchant.findFirst() || await prisma.merchant.create({
    data: { 
      id: mId,
      storeName: 'Batch Test Merchant', 
      email: `batch-test-${Date.now()}@example.com`,
      passwordHash: 'hashed',
      countryId: country.id, 
      type: 'MART' 
    }
  });

  const store = await prisma.store.findFirst({ where: { merchantId: merchant.id } }) || await prisma.store.create({
    data: {
      name: 'Main Street Store',
      merchantId: merchant.id,
      address: '123 Main St',
      city: 'Harare',
      currency: 'USD',
      timezone: 'Africa/Harare',
      latitude: -17.8252,
      longitude: 31.0335,
    }
  });

  // 2. Create 3 Nearby Orders
  console.log('📝 Creating 3 nearby orders...');
  const orderIds: string[] = [];
  for (let i = 1; i <= 3; i++) {
    const order = await prisma.order.create({
      data: {
        storeId: store.id,
        merchantId: merchant.id,
        orderNumber: `BATCH-TEST-${i}-${Date.now()}`,
        status: OrderStatus.READY,
        currency: 'USD',
        subtotal: 10,
        totalAmount: 12,
        deliveryFee: 2,
        pickupLat: -17.8252 + (i * 0.0001), // Very close
        pickupLng: 31.0335 + (i * 0.0001),
        pickupAddress: `Pickup Point ${i}`,
        deliveryAddress: `Dropoff Point ${i}`,
      }
    });
    orderIds.push(order.id);
  }

  // 3. Trigger Dispatch for the first order
  console.log('🚀 Triggering dispatch flow for the first order...');
  await dispatchService.startDispatchFlow(orderIds[0]);

  // Give it a moment to process (database is fast, but let's be safe)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 4. Verify Batch Creation
  console.log('🔍 Checking for DeliveryBatch...');
  const firstDelivery = await prisma.delivery.findUnique({
    where: { orderId: orderIds[0] },
    include: { batch: { include: { deliveries: true } } }
  });

  if (firstDelivery?.batch && firstDelivery.batchId === firstDelivery.batch.id) {
    console.log(`✅ SUCCESS: DeliveryBatch created (${firstDelivery.batchId})`);
    if (firstDelivery.batch) {
      console.log(`✅ Deliveries in batch: ${firstDelivery.batch.deliveries.length}`);
      
      if (firstDelivery.batch.deliveries.length >= 2) {
        console.log('✨ SUCCESS: Multi-stop batching verified!');
      } else {
        console.error('❌ FAILURE: Batch exists but contains too few deliveries.');
      }
    }
  } else {
    console.error('❌ FAILURE: No DeliveryBatch created.');
    process.exit(1);
  }

  // Cleanup
  console.log('🧹 Cleaning up test data...');
  const batchId = firstDelivery.batchId;
  await prisma.delivery.deleteMany({ where: { orderId: { in: orderIds } } });
  if (batchId) await (prisma as any).deliveryBatch.delete({ where: { id: batchId } });
  await prisma.order.deleteMany({ where: { id: { in: orderIds } } });

  await app.close();
  process.exit(0);
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
