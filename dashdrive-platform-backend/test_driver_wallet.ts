import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DriverWalletService } from './src/modules/rides/driver-wallet.service';
import { PrismaService } from './src/prisma/prisma.service';
import * as crypto from 'crypto';

async function verify() {
  console.log('💳 Starting Driver Wallet & Ride Bundle Verification (Phase 14)...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const walletService = app.get(DriverWalletService);

  // Setup: Create user + driver profile
  const userId = crypto.randomUUID();
  await prisma.user.create({
    data: { id: userId, email: `driver-${userId.substring(0,8)}@test.com`, password_hash: 'hash' }
  });

  const driverProfile = await prisma.driverProfile.create({
    data: { user_id: userId, license_number: 'DRV-001', vehicle_type: 'sedan', verification_status: 'verified' }
  });

  // 1. Test Wallet Creation
  console.log('💰 Testing driver wallet auto-creation...');
  const wallet = await walletService.getDriverWallet(driverProfile.id);
  console.log(`✅ Driver Wallet Created: ${wallet.id}, Balance: $${wallet.balance}`);

  // 2. Top Up
  console.log('💵 Testing wallet top-up...');
  const topUpResult = await walletService.topUp(driverProfile.id, 50);
  console.log(`✅ Wallet Balance After Top-Up: $${topUpResult.balance}`);

  if (Number(topUpResult.balance) !== 50) {
    console.error('❌ FAILURE: Balance should be $50');
    process.exit(1);
  }

  // 3. Create Ride Bundle
  console.log('📦 Seeding ride bundle products...');
  const starterBundle = await (prisma as any).rideBundle.create({
    data: { name: 'Starter 20', rideCount: 20, price: 10, validityDays: 30, isActive: true }
  });
  const proBundle = await (prisma as any).rideBundle.create({
    data: { name: 'Pro 50', rideCount: 50, price: 20, validityDays: 30, isActive: true }
  });

  // 4. List Bundles
  console.log('📋 Testing bundle listing...');
  const bundles = await walletService.getRideBundles();
  console.log(`✅ Found ${bundles.length} available bundle(s)`);

  // 5. Purchase Bundle
  console.log('🛒 Purchasing Starter 20 bundle ($10)...');
  const purchase = await walletService.purchaseBundle(driverProfile.id, starterBundle.id);
  console.log(`✅ Bundle Purchased: ${purchase.bundle.name}, Rides: ${purchase.ridesRemaining}, Valid Until: ${purchase.validUntil}`);

  const walletAfter = await walletService.getDriverWallet(driverProfile.id);
  console.log(`✅ Wallet Balance After Purchase: $${walletAfter.balance} (expected $40)`);

  if (Number(walletAfter.balance) !== 40) {
    console.error('❌ FAILURE: Balance should be $40 after $10 purchase');
    process.exit(1);
  }

  // 6. Check Active Credits
  console.log('🎟️ Testing active credits check...');
  const hasCredits = await walletService.hasActiveCredits(driverProfile.id);
  console.log(`✅ Has Active Credits: ${hasCredits} (expected true)`);

  if (!hasCredits) {
    console.error('❌ FAILURE: Should have active credits');
    process.exit(1);
  }

  // 7. Deduct Ride Credit
  console.log('🚗 Testing ride credit deduction...');
  const deducted = await walletService.deductRideCredit(driverProfile.id);
  console.log(`✅ Credit Deducted: ${deducted}`);

  const activeBundles = await walletService.getActiveBundles(driverProfile.id);
  const remaining = activeBundles[0]?.ridesRemaining;
  console.log(`✅ Rides Remaining: ${remaining} (expected 19)`);

  if (remaining !== 19) {
    console.error('❌ FAILURE: Should have 19 rides remaining');
    process.exit(1);
  }

  // 8. Test Insufficient Balance Prevention
  console.log('🚫 Testing insufficient balance prevention...');
  try {
    await walletService.purchaseBundle(driverProfile.id, proBundle.id);
    // This should work since wallet has $40 and Pro costs $20
    console.log('✅ Pro bundle purchased successfully (had enough balance)');
    
    // Now try again — wallet should have $20 left, not enough for another Pro ($20)
    await walletService.purchaseBundle(driverProfile.id, proBundle.id);
    console.log('✅ Second Pro bundle purchased (had $20 = exactly enough)');
    
    // Now truly insufficient
    try {
      await walletService.purchaseBundle(driverProfile.id, proBundle.id);
      console.error('❌ FAILURE: Should have thrown insufficient balance');
      process.exit(1);
    } catch (e: any) {
      console.log(`✅ Insufficient balance correctly blocked: "${e.message}"`);
    }
  } catch (e: any) {
    console.error('❌ Unexpected error:', e.message);
    process.exit(1);
  }

  // Cleanup
  console.log('🧹 Cleaning up...');
  await (prisma as any).driverBundlePurchase.deleteMany({ where: { driverProfileId: driverProfile.id } });
  await (prisma as any).driverWalletTransaction.deleteMany({ where: { walletId: walletAfter.id } });
  await (prisma as any).driverWallet.delete({ where: { driverProfileId: driverProfile.id } });
  await (prisma as any).rideBundle.deleteMany({ where: { id: { in: [starterBundle.id, proBundle.id] } } });
  await prisma.driverProfile.delete({ where: { id: driverProfile.id } });
  await prisma.user.delete({ where: { id: userId } });

  await app.close();
  console.log('🏁 Phase 14 Verification Complete: ALL SYSTEMS NOMINAL');
  process.exit(0);
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
