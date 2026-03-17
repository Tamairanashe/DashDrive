import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { RideService } from './src/modules/rides/ride.service';
import { PrismaService } from './src/prisma/prisma.service';
import { RideStatus } from '@prisma/client';
import * as crypto from 'crypto';

async function verify() {
  const uuidv4 = () => crypto.randomUUID();
  console.log('🚗 Starting DashRides Proximity Matching Verification...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const rideService = app.get(RideService);

  // 1. Setup Base Data
  console.log('📋 Setting up base data...');
  const userId = uuidv4();
  await prisma.user.create({
    data: { id: userId, email: `rider-${Date.now()}@example.com`, password_hash: 'hash' }
  });

  const serviceType = await prisma.rideServiceType.findFirst() || await prisma.rideServiceType.create({
    data: { name: 'economy', basePrice: 2, pricePerKm: 1, pricePerMin: 0.2 }
  });

  // 2. Create 3 Online Drivers
  console.log('🚕 Creating 3 online drivers...');
  const drivers: string[] = [];
  const driverLocations = [
    { name: 'Driver Near (1km)', lat: -17.8252 + 0.005, lng: 31.0335 + 0.005 },
    { name: 'Driver Far (10km)', lat: -17.8252 + 0.08, lng: 31.0335 + 0.08 },
    { name: 'Driver Offline', lat: -17.8252 + 0.001, lng: 31.0335 + 0.001, online: false }
  ];

  for (const loc of driverLocations) {
    const dUserId = uuidv4();
    await prisma.user.create({
      data: { id: dUserId, email: `driver-${dUserId.substring(0,8)}@example.com`, password_hash: 'hash' }
    });

    const profile = await (prisma as any).driverProfile.create({
      data: {
        user_id: dUserId,
        is_online: loc.online !== false,
        verification_status: 'verified',
        vehicle_type: 'CAR',
        last_location_lat: loc.lat,
        last_location_lng: loc.lng,
      }
    });
    if (loc.online !== false) drivers.push(profile.id);
  }

  // 3. Request a Ride
  console.log('📱 Requesting a ride...');
  const ride = await rideService.requestRide({
    userId,
    serviceTypeId: serviceType.id,
    pickupLat: -17.8252,
    pickupLng: 31.0335,
    pickupAddress: 'Pickup Point',
    dropoffLat: -17.8300,
    dropoffLng: 31.0400,
    dropoffAddress: 'Dropoff Point'
  });

  console.log(`✅ Ride requested: ${ride.id}`);

  // 4. Verify Driver Discovery
  console.log('🔍 Verifying driver discovery...');
  let nearby = await rideService.findNearbyDrivers(ride.pickupLat, ride.pickupLng, serviceType.id);
  console.log(`✅ Found ${nearby.length} online drivers within 5km.`);

  // Wait for status to become SEARCHING
  console.log('⏳ Waiting for ride status to reach SEARCHING...');
  let updatedRide = await prisma.rideRequest.findUnique({ where: { id: ride.id } });
  let retries = 5;
  while (updatedRide.status === RideStatus.REQUESTED && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 500));
    updatedRide = await prisma.rideRequest.findUnique({ where: { id: ride.id } });
    retries--;
  }
  console.log(`📊 Final ride status before acceptance: ${updatedRide.status}`);

  const nearest = nearby.find(d => d.id === drivers[0]);
  if (nearby.length >= 1 && nearest && updatedRide.status === RideStatus.SEARCHING) {
    console.log('✨ SUCCESS: Discovery and status verified!');
  } else {
    console.error(`❌ FAILURE: Discovery results or status incorrect. Status: ${updatedRide.status}, Found: ${nearby.length}`);
    process.exit(1);
  }

  // 5. Simulate Acceptance
  console.log('🤝 Driver accepting ride...');
  const { trip } = await rideService.acceptRide(ride.id, nearest.user_id);
  console.log(`✅ Result: Ride assigned, Trip created (${trip.id})`);

  // Verify final status
  updatedRide = await prisma.rideRequest.findUnique({ where: { id: ride.id } });
  if (updatedRide.status === RideStatus.DRIVER_ASSIGNED) {
    console.log('✨ SUCCESS: Ride status updated to DRIVER_ASSIGNED!');
  } else {
    console.error(`❌ FAILURE: Ride status is ${updatedRide.status}`);
    process.exit(1);
  }

  // Cleanup
  console.log('🧹 Cleaning up test data...');
  await (prisma as any).rideTrip.deleteMany({ where: { rideRequestId: ride.id } });
  await prisma.rideRequest.delete({ where: { id: ride.id } });
  await (prisma as any).driverProfile.deleteMany({ where: { user_id: { in: [userId, ...nearby.map(d => d.user_id)] } } });
  // await prisma.user.deleteMany({ where: { id: { in: [userId, ...nearby.map(d => d.user_id)] } } });

  await app.close();
  process.exit(0);
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
