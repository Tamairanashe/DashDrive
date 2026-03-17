import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { TransitService } from './src/modules/transit/transit.service';
import { WalletService } from './src/modules/fintech/wallet.service';
import { PrismaService } from './src/prisma/prisma.service';
import * as crypto from 'crypto';

async function verify() {
  console.log('🚌 Starting DashTransit Hardening Verification (Phase 11)...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const transitService = app.get(TransitService);
  const walletService = app.get(WalletService);

  const userId = crypto.randomUUID();
  await prisma.user.create({
    data: { id: userId, email: `transit-${userId.substring(0,8)}@test.com`, password_hash: 'hash' }
  });

  // 1. Fund wallet
  console.log('💰 Funding wallet...');
  await walletService.creditWallet(userId, 100, 'Transit test fund');

  // 2. Seed route, stops, and product
  console.log('🗺️ Seeding transit data...');
  const route = await (prisma as any).transitRoute.create({
    data: { name: 'CBD Express', routeNumber: `R-${Date.now()}`, type: 'BUS', baseFare: 1.5 }
  });

  const stop1 = await (prisma as any).transitStop.create({
    data: { name: 'Central Station', latitude: -17.82, longitude: 31.05 }
  });
  const stop2 = await (prisma as any).transitStop.create({
    data: { name: 'Eastgate Mall', latitude: -17.80, longitude: 31.08 }
  });

  await (prisma as any).routeStop.createMany({
    data: [
      { routeId: route.id, stopId: stop1.id, stopOrder: 1 },
      { routeId: route.id, stopId: stop2.id, stopOrder: 2 },
    ]
  });

  const product = await (prisma as any).transitProduct.create({
    data: { type: 'WEEKLY', name: 'Weekly Commuter Pass', price: 15, durationDays: 7 }
  });

  // 3. Test route listing
  console.log('📋 Testing route listing...');
  const routes = await transitService.getRoutes();
  console.log(`✅ Found ${routes.length} active route(s)`);

  // 4. Test product listing
  console.log('🏷️ Testing product listing...');
  const products = await transitService.getProducts();
  console.log(`✅ Found ${products.length} transit product(s)`);

  // 5. Test pass purchase with wallet deduction
  console.log('🎫 Purchasing transit pass...');
  const pass = await transitService.purchasePass({ userId, productId: product.id });
  console.log(`✅ Pass Created: ${pass.id}`);
  console.log(`   QR Code: ${pass.qrCode}`);
  console.log(`   Valid Until: ${pass.validUntil}`);
  console.log(`   Product: ${pass.product.name}`);

  const wallet = await walletService.getWallet(userId);
  console.log(`✅ Wallet Balance: $${wallet.balance} (expected $85)`);

  if (Number(wallet.balance) !== 85) {
    console.error('❌ FAILURE: Wallet balance mismatch');
    process.exit(1);
  }

  // 6. Test trip recording with active pass (fare should be 0)
  console.log('🚏 Recording trip with active pass...');
  const trip = await transitService.recordTrip({
    userId, routeId: route.id, boardStop: stop1.id, alightStop: stop2.id, passId: pass.id
  });
  console.log(`✅ Trip Recorded: ${trip.id}, Fare: $${trip.fare} (expected $0 — pass holder)`);

  if (trip.fare !== 0) {
    console.error('❌ FAILURE: Pass holder should ride free');
    process.exit(1);
  }

  // 7. Test trip recording WITHOUT pass (fare should be baseFare)
  console.log('🚏 Recording trip without pass...');
  const trip2 = await transitService.recordTrip({
    userId, routeId: route.id, boardStop: stop1.id, alightStop: stop2.id
  });
  console.log(`✅ Trip Recorded: ${trip2.id}, Fare: $${trip2.fare} (expected $1.5 — no pass)`);

  if (trip2.fare !== 1.5) {
    console.error('❌ FAILURE: Non-pass trip should cost baseFare');
    process.exit(1);
  }

  // Cleanup
  console.log('🧹 Cleaning up...');
  await (prisma as any).transitTrip.deleteMany({ where: { userId } });
  await (prisma as any).transitPass.deleteMany({ where: { userId } });
  await (prisma as any).transitProduct.delete({ where: { id: product.id } });
  await (prisma as any).routeStop.deleteMany({ where: { routeId: route.id } });
  await (prisma as any).transitRoute.delete({ where: { id: route.id } });
  await (prisma as any).transitStop.deleteMany({ where: { id: { in: [stop1.id, stop2.id] } } });
  await prisma.walletTransaction.deleteMany({ where: { wallet_id: wallet.id } });
  await prisma.wallet.delete({ where: { id: wallet.id } });
  await prisma.user.delete({ where: { id: userId } });

  await app.close();
  console.log('🏁 Phase 11 Verification Complete: ALL SYSTEMS NOMINAL');
  process.exit(0);
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
