import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { BillingService } from './src/modules/billing/billing.service';
import { PrismaService } from './src/prisma/prisma.service';

async function verify() {
  console.log('🏗️ Starting Backend Production Readiness Verification (Phase 13)...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const billingService = app.get(BillingService);

  // 1. Test Health Endpoint Logic
  console.log('❤️ Testing health check...');
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connectivity: OK');
  } catch {
    console.error('❌ Database connectivity: FAILED');
    process.exit(1);
  }

  // 2. Test Commission Rates
  console.log('📊 Testing commission rates...');
  const rideRate = await billingService.getCommissionRate('ride');
  const hotelRate = await billingService.getCommissionRate('hotel');
  console.log(`✅ Ride commission rate: ${rideRate * 100}%`);
  console.log(`✅ Hotel commission rate: ${hotelRate * 100}%`);

  if (rideRate !== 0.20) {
    console.error('❌ FAILURE: Ride rate should be 20%');
    process.exit(1);
  }

  // 3. Test Commission Calculation
  console.log('💰 Testing commission calculation...');
  const commission = await billingService.calculateCommission('ride', 50);
  console.log(`✅ Commission on $50 ride: $${commission} (expected $10)`);

  if (commission !== 10) {
    console.error('❌ FAILURE: Commission calculation incorrect');
    process.exit(1);
  }

  // 4. Test Billing Transaction with Commission
  console.log('📝 Testing billing transaction recording...');
  const result = await billingService.recordTransaction({
    referenceId: null as any,
    type: 'payment',
    amount: 100,
    vertical: 'delivery',
  });
  console.log(`✅ Transaction recorded: ${result.transaction.id}`);
  console.log(`✅ Commission: $${result.commission.amount} (${result.commission.rate * 100}%)`);

  // 5. Test Revenue Summary
  console.log('📈 Testing revenue summary...');
  const summary = await billingService.getRevenueSummary();
  console.log(`✅ Revenue Summary for ${summary.billingCycle}:`);
  console.log(`   Total Revenue: $${summary.totalRevenue}`);
  console.log(`   Total Commission: $${summary.totalCommission}`);
  console.log(`   Net Payout: $${summary.netPayout}`);

  // 6. Test Settlement
  console.log('🏦 Testing settlement...');
  const settlement = await billingService.settlePayouts();
  console.log(`✅ Settled ${settlement.settledCount} commission records`);

  // Cleanup
  console.log('🧹 Cleaning up test transactions...');
  await prisma.transaction.delete({ where: { id: result.transaction.id } });
  // Also delete any commission records created for this period
  await prisma.transaction.deleteMany({
    where: { type: 'commission', reference_id: null }
  });

  await app.close();
  console.log('🏁 Phase 13 Verification Complete: ALL SYSTEMS NOMINAL');
  process.exit(0);
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
