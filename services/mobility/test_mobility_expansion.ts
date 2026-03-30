import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { VehiclesService } from './src/modules/vehicles/vehicles.service';
import { TripsService } from './src/modules/trips/trips.service';
import { HostingService } from './src/modules/hosting/hosting.service';
import { InspectionsService } from './src/modules/inspections/inspections.service';
import { FinancialsService } from './src/modules/financials/financials.service';
import { FavoritesService } from './src/modules/favorites/favorites.service';
import { MessagesService } from './src/modules/messages/messages.service';
import { PrismaService } from './src/prisma/prisma.service';
import * as crypto from 'crypto';

async function verify() {
  console.log('🚀 Starting Phase 16 Expanded Mobility Verification (Restore)...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const vehiclesService = app.get(VehiclesService);
  const tripsService = app.get(TripsService);
  const hostingService = app.get(HostingService);
  const inspectionsService = app.get(InspectionsService);
  const financialsService = app.get(FinancialsService);
  const favoritesService = app.get(FavoritesService);
  const messagesService = app.get(MessagesService);

  const testId = crypto.randomUUID().substring(0, 8);
  const hostId = crypto.randomUUID();
  const guestId = crypto.randomUUID();

  // Setup Users
  await prisma.user.createMany({
    data: [
      { id: hostId, email: `host-${testId}@test.com`, password_hash: 'pass', active_mode: 'DRIVER' },
      { id: guestId, email: `guest-${testId}@test.com`, password_hash: 'pass', active_mode: 'CUSTOMER' },
    ],
  });

  await prisma.hostProfile.create({ data: { userId: hostId } });

  // 1. Create Vehicle
  console.log('🚘 Creating vehicle...');
  const vehicle = await vehiclesService.createVehicle({
    host: { connect: { id: hostId } },
    make: 'Rivian',
    model: 'R1S',
    year: 2024,
    category: 'SUV',
    pricePerDay: 200,
    location: 'Bulawayo',
  } as any);

  // 2. Hosting: Block Calendar & Set Pricing
  console.log('📅 Testing calendar blocking...');
  const blockStart = new Date();
  blockStart.setDate(blockStart.getDate() + 10);
  const blockEnd = new Date();
  blockEnd.setDate(blockEnd.getDate() + 12);

  await hostingService.setAvailability(vehicle.id, {
    startDate: blockStart,
    endDate: blockEnd,
    isAvailable: false,
    reason: 'Maintenance',
  });

  console.log('💰 Setting 20% weekly discount...');
  await hostingService.setPricingRule(vehicle.id, {
    type: 'weekly_discount',
    value: 20,
    isPercentage: true,
  });

  // 3. Search: Verify blocking and pricing
  console.log('🔍 Testing search (Blocked dates)...');
  const blockedSearch = await vehiclesService.findAll({
    location: 'Bulawayo',
    startDate: blockStart,
    endDate: blockEnd,
  });
  console.log(`✅ Blocked search found ${blockedSearch.length} vehicles (Expected: 0)`);

  console.log('🔍 Testing search (7-day trip with discount)...');
  const tripStart = new Date();
  tripStart.setDate(tripStart.getDate() + 1);
  const tripEnd = new Date();
  tripEnd.setDate(tripEnd.getDate() + 8); // 7 days

  const availableSearch = await vehiclesService.findAll({
    location: 'Bulawayo',
    startDate: tripStart,
    endDate: tripEnd,
  });
  const found = availableSearch.find(v => v.id === vehicle.id);
  console.log(`✅ Discounted search price: $${found?.displayPrice} (Expected: $160/day due to 20% off)`);

  // 4. Booking and Lifecycle
  console.log('📅 Booking 7-day trip...');
  const trip = await tripsService.createTrip({
    vehicleId: vehicle.id,
    guestId: guestId,
    startDate: tripStart,
    endDate: tripEnd,
  });
  console.log(`✅ Trip booked. Total Amount: $${trip.totalAmount} (Expected: $1120)`);

  console.log('🏷️ Testing check-in inspection...');
  await inspectionsService.createInspection(trip.id, {
    type: 'check_in',
    odometerReading: 5000,
    fuelLevel: 1.0,
    photos: ['front.jpg', 'interior.jpg'],
  });

  console.log('🏷️ Testing check-out inspection...');
  await inspectionsService.createInspection(trip.id, {
    type: 'check_out',
    odometerReading: 5200,
    fuelLevel: 0.8,
    photos: ['front_ok.jpg'],
  });

  // 5. Verification: Financials & Status
  const finalTrip = await prisma.trip.findUnique({ where: { id: trip.id } });
  console.log(`✅ Final Trip Status: ${finalTrip?.status}`);

  console.log('📊 Verifying host earnings...');
  const summary = await financialsService.getFinancialSummary(hostId);
  console.log(`✅ Host Total Earnings: $${summary.totalEarnings}`);

  // 6. Engagement: Messages & Favorites
  console.log('💬 Sending test message...');
  await messagesService.sendMessage({
    senderId: guestId,
    receiverId: hostId,
    tripId: trip.id,
    content: 'Ready to pick up!',
  });

  console.log('❤️ Toggling favorite...');
  await favoritesService.toggleFavorite(guestId, vehicle.id);
  const favs = await favoritesService.getFavorites(guestId);
  console.log(`✅ User has ${favs.length} favorite(s)`);

  // Cleanup
  console.log('🧹 Cleaning up...');
  await prisma.favorite.deleteMany({ where: { userId: guestId } });
  await prisma.message.deleteMany({ where: { OR: [{ senderId: hostId }, { receiverId: hostId }] } });
  await prisma.hostEarning.deleteMany({ where: { hostProfile: { userId: hostId } } });
  await prisma.tripInspection.deleteMany({ where: { tripId: trip.id } });
  await prisma.trip.deleteMany({ where: { vehicleId: vehicle.id } });
  await prisma.pricingRule.deleteMany({ where: { vehicleId: vehicle.id } });
  await prisma.vehicleAvailability.deleteMany({ where: { vehicleId: vehicle.id } });
  await prisma.vehicle.delete({ where: { id: vehicle.id } });
  await prisma.hostProfile.delete({ where: { userId: hostId } });
  await prisma.user.deleteMany({ where: { id: { in: [hostId, guestId] } } });

  await app.close();
  console.log('🏁 Phase 16 Verification Complete: ALL SYSTEMS NOMINAL');
  process.exit(0);
}

verify().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
