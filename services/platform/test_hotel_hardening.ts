import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { HotelService } from './src/modules/hotels/hotel.service';
import { WalletService } from './src/modules/fintech/wallet.service';
import { PrismaService } from './src/prisma/prisma.service';
import * as crypto from 'crypto';

async function verify() {
  console.log('🏨 Starting Hotel Hardening Verification (Phase 12)...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const hotelService = app.get(HotelService);
  const walletService = app.get(WalletService);

  const userId = crypto.randomUUID();
  await prisma.user.create({
    data: { id: userId, email: `hotel-${userId.substring(0,8)}@test.com`, password_hash: 'hash' }
  });

  // 1. Fund wallet
  console.log('💰 Funding wallet with $500...');
  await walletService.creditWallet(userId, 500, 'Hotel test fund');

  // 2. Seed hotel and room type
  console.log('🏗️ Seeding hotel data...');
  const hotel = await (prisma as any).hotel.create({
    data: {
      name: 'DashStay Grand',
      city: 'Harare',
      address: '1 Unity Square',
      starRating: 4,
      isActive: true,
      roomTypes: {
        create: [
          { name: 'Standard Double', maxGuests: 2, pricePerNight: 80, totalInventory: 2, bedType: 'Double' },
          { name: 'Executive Suite', maxGuests: 4, pricePerNight: 200, totalInventory: 1, bedType: 'King' },
        ]
      }
    },
    include: { roomTypes: true }
  });

  const standardRoom = hotel.roomTypes.find((r: any) => r.name === 'Standard Double');
  const suiteRoom = hotel.roomTypes.find((r: any) => r.name === 'Executive Suite');

  // 3. Test search
  console.log('🔍 Testing hotel search...');
  const results = await hotelService.searchHotels('Harare', '2026-04-01', '2026-04-03', 2);
  console.log(`✅ Found ${results.hotels.length} hotel(s) with availability`);

  // 4. Test booking with wallet deduction
  console.log('📝 Booking Standard Double for 2 nights...');
  const booking = await hotelService.bookRoom({
    userId,
    roomTypeId: standardRoom.id,
    checkIn: '2026-04-01',
    checkOut: '2026-04-03',
    guests: 2,
  });
  console.log(`✅ Booking Created: ${booking.id}, Total: $${booking.totalPrice}`);

  const wallet = await walletService.getWallet(userId);
  console.log(`✅ Wallet Balance: $${wallet.balance} (expected $340)`);

  if (Number(wallet.balance) !== 340) {
    console.error('❌ FAILURE: Wallet balance mismatch after booking');
    process.exit(1);
  }

  // 5. Test availability — book the suite (only 1 available)
  console.log('📝 Booking Executive Suite (1 inventory)...');
  await hotelService.bookRoom({
    userId,
    roomTypeId: suiteRoom.id,
    checkIn: '2026-04-01',
    checkOut: '2026-04-02',
    guests: 2,
  });

  // 6. Test overbooking — should fail
  console.log('🚫 Testing overbooking prevention...');
  try {
    await hotelService.bookRoom({
      userId,
      roomTypeId: suiteRoom.id,
      checkIn: '2026-04-01',
      checkOut: '2026-04-02',
      guests: 2,
    });
    console.error('❌ FAILURE: Overbooking should have been prevented');
    process.exit(1);
  } catch (e: any) {
    console.log(`✅ Overbooking correctly prevented: "${e.message}"`);
  }

  // 7. Test cancellation with refund
  console.log('❌ Testing cancellation with wallet refund...');
  await hotelService.cancelBooking(booking.id);
  const walletAfterRefund = await walletService.getWallet(userId);
  console.log(`✅ Wallet After Refund: $${walletAfterRefund.balance} (expected $500 - $200 suite = $300... wait)`);

  // Actually: started with 500, booked standard (160) = 340, booked suite (200) = 140, refund standard (160) = 300
  if (Number(walletAfterRefund.balance) !== 300) {
    console.error(`❌ FAILURE: Expected $300 after refund, got $${walletAfterRefund.balance}`);
    process.exit(1);
  }
  console.log('✅ Refund verified correctly!');

  // Cleanup
  console.log('🧹 Cleaning up...');
  await (prisma as any).hotelBooking.deleteMany({ where: { userId } });
  await (prisma as any).hotelRoomType.deleteMany({ where: { hotelId: hotel.id } });
  await (prisma as any).hotel.delete({ where: { id: hotel.id } });
  await prisma.walletTransaction.deleteMany({ where: { wallet_id: (await walletService.getWallet(userId)).id } });
  await prisma.wallet.delete({ where: { user_id: userId } });
  await prisma.user.delete({ where: { id: userId } });

  await app.close();
  console.log('🏁 Phase 12 Hotel Verification Complete: ALL SYSTEMS NOMINAL');
  process.exit(0);
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
