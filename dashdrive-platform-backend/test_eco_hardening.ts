import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { FuelService } from './src/modules/fuel/fuel.service';
import { InsuranceService } from './src/modules/insurance/claims/insurance.service';
import { PrismaService } from './src/prisma/prisma.service';
import { WalletService } from './src/modules/fintech/wallet.service';
import * as crypto from 'crypto';

async function verify() {
  const uuidv4 = () => crypto.randomUUID();
  console.log('🌱 Starting Advanced Eco-system Hardening Verification (Phase 10)...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const fuelService = app.get(FuelService);
  const insuranceService = app.get(InsuranceService);
  const walletService = app.get(WalletService);

  const userId = uuidv4();
  await prisma.user.create({
    data: { id: userId, email: `eco-user-${userId.substring(0,8)}@example.com`, password_hash: 'hash' }
  });

  // 1. Setup Wallet
  console.log('💰 Setting up Wallet...');
  await walletService.creditWallet(userId, 500, 'Initial eco-fund');

  // 2. Setup Fuel Station
  console.log('⛽ Setting up Fuel Station...');
  const station = await (prisma as any).fuelStation.create({
    data: {
      name: 'EcoEnergy Hub',
      address: '101 Green Blvd',
      latitude: -17.82,
      longitude: 31.05,
      fuelTypes: {
        create: [
          { name: 'Petrol 95 Premium', pricePerUnit: 1.5, unit: 'litre' },
          { name: 'Pure Diesel', pricePerUnit: 1.2, unit: 'litre' }
        ]
      }
    },
    include: { fuelTypes: true }
  });

  // 3. Setup Insurance Product
  console.log('🛡️ Setting up Insurance Product...');
  const provider = await prisma.insuranceProvider.create({
    data: { name: 'DashSecure' }
  });
  const iProduct = await prisma.insuranceProduct.create({
    data: {
      provider_id: provider.id,
      name: 'EcoShield Plus',
      coverage_amount: 50000,
      premium: 200,
      policy_type: 'vehicle'
    }
  });
  const policy = await prisma.policy.create({
    data: {
      user_id: userId,
      product_id: iProduct.id,
      premium: 200,
      coverage_amount: 50000,
      status: 'active',
      start_date: new Date(),
      end_date: new Date(Date.now() + 31536000000)
    }
  });

  // 4. Test Fuel Ordering
  console.log('🚗 Testing Fuel Ordering with Wallet Payment...');
  const fuelOrder = await fuelService.orderFuel({
    userId,
    stationId: station.id,
    fuelTypeId: station.fuelTypes[0].id,
    quantity: 20,
    orderType: 'self'
  });

  console.log(`✅ Fuel Order Created: ${fuelOrder.id} for $${fuelOrder.totalPrice}`);
  
  const wallet = await walletService.getWallet(userId);
  console.log(`✅ Remaining Wallet Balance: $${wallet.balance}`);

  if (Number(fuelOrder.totalPrice) === 30 && Number(wallet.balance) === 470) {
    console.log('✨ SUCCESS: Fuel ordering and wallet integration verified!');
  } else {
    console.error(`❌ FAILURE: Totals mismatch. Order: ${fuelOrder.totalPrice}, Wallet: ${wallet.balance}`);
    process.exit(1);
  }

  // 5. Test Insurance Claim Hardening
  console.log('📁 Testing Hardened Insurance Claim Submission...');
  const claim = await insuranceService.submitClaim({
    userId,
    policyId: policy.id,
    incidentType: 'collision',
    description: 'Minor fender bender at the station.',
    amountClaimed: 1500,
    incidentReport: {
      location: 'EcoEnergy Hub Parking',
      incidentAt: new Date().toISOString(),
      narrative: 'While fueling, another car backed into me.'
    },
    attachments: [
      { url: 'https://example.com/dmg1.jpg', fileType: 'image' },
      { url: 'https://example.com/dmg2.jpg', fileType: 'image' }
    ]
  });

  console.log(`✅ Claim Submitted: ${claim.id}`);
  console.log(`🔍 Incident Report: ${claim.incident_report.narrative}`);
  console.log(`📎 Attachments: ${claim.attachments.length}`);

  if (claim.attachments.length === 2 && claim.incident_report) {
    console.log('✨ SUCCESS: Hardened insurance claim verified!');
  } else {
    console.error('❌ FAILURE: Claim details incomplete.');
    process.exit(1);
  }

  // Cleanup
  console.log('🧹 Cleaning up test data...');
  await (prisma as any).fuelOrder.deleteMany({ where: { userId } });
  await (prisma as any).fuelType.deleteMany({ where: { stationId: station.id } });
  await (prisma as any).fuelStation.delete({ where: { id: station.id } });
  await (prisma as any).claimAttachment.deleteMany({ where: { claim_id: claim.id } });
  await (prisma as any).incidentReport.deleteMany({ where: { claim_id: claim.id } });
  await (prisma as any).claim.delete({ where: { id: claim.id } });
  await prisma.policy.delete({ where: { id: policy.id } });
  await prisma.insuranceProduct.delete({ where: { id: iProduct.id } });
  await prisma.insuranceProvider.delete({ where: { id: provider.id } });
  await prisma.walletTransaction.deleteMany({ where: { wallet_id: wallet.id } });
  await prisma.transfer.deleteMany({ where: { OR: [{ sender_id: userId }, { receiver_id: userId }] } });
  await prisma.wallet.delete({ where: { id: wallet.id } });
  await prisma.user.delete({ where: { id: userId } });

  await app.close();
  console.log('🏁 Phase 10 Verification Complete: ALL SYSTEMS NOMINAL');
  process.exit(0);
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
