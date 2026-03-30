import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { MarketplaceService } from './src/modules/marketplace/marketplace.service';
import { PrismaService } from './src/prisma/prisma.service';
import * as crypto from 'crypto';

async function verify() {
  const uuidv4 = () => crypto.randomUUID();
  console.log('🛍️ Starting Marketplace Unification Verification...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const service = app.get(MarketplaceService);

  const userId = uuidv4();
  await prisma.user.create({
    data: { id: userId, email: `shopper-${userId.substring(0,8)}@example.com`, password_hash: 'hash' }
  });

  // 1. Seed Marketplace Store & Products
  console.log('🏪 Seeding Marketplace Store & Products...');
  const store = await (prisma as any).marketplaceStore.create({
    data: {
      name: 'DashMart Central',
      category: 'MART',
      description: 'Your one-stop mart for everything.',
      products: {
        create: [
          { name: 'Organic Apples', price: 2.5, stock: 100, description: 'Fresh organic apples' },
          { name: 'Whole Milk', price: 3.0, stock: 50, description: '1 gallon whole milk' }
        ]
      }
    },
    include: { products: true }
  });

  // 2. Seed Hotel & Listing
  console.log('🏨 Seeding Hotel & Listing...');
  const hotel = await prisma.hotel.create({
    data: {
      name: 'Grand Plaza Hotel',
      city: 'Harare',
      roomTypes: {
        create: { name: 'Deluxe Suite', maxGuests: 2, pricePerNight: 150, totalInventory: 5 }
      }
    }
  });

  const listing = await prisma.listing.create({
    data: {
      host_id: userId,
      title: 'Cozy City Loft',
      property_type: 'apartment',
      price_per_night: 85,
      location: {
        create: { country: 'Zimbabwe', city: 'Harare', address: '456 Loft St', latitude: -17.82, longitude: 31.05 }
      }
    }
  });

  // 3. Test Unified Search
  console.log('🔍 Testing Unified Search...');
  const searchResults = await service.searchMarketplace('Organic');
  console.log(`✅ Search for "Organic" found ${searchResults.products.length} products.`);

  const searchResults2 = await service.searchMarketplace('Cozy');
  console.log(`✅ Search for "Cozy" found ${searchResults2.listings.length} listings.`);

  if (searchResults.products.length > 0 && searchResults2.listings.length > 0) {
    console.log('✨ SUCCESS: Unified search verified!');
  } else {
    console.error('❌ FAILURE: Search results incomplete.');
    process.exit(1);
  }

  // 4. Test Retail Ordering
  console.log('🛒 Testing Retail Ordering...');
  const order = await service.createMarketplaceOrder(
    userId,
    store.id,
    [{ productId: store.products[0].id, quantity: 2 }],
    'Leave at the door.'
  );

  console.log(`✅ Order created: ${order.id} for $${order.totalAmount}`);

  if (Number(order.totalAmount) === 5.0) {
    console.log('✨ SUCCESS: Retail ordering verified!');
  } else {
    console.error(`❌ FAILURE: Order amount incorrect. Got: ${order.totalAmount}`);
    process.exit(1);
  }

  // Cleanup
  console.log('🧹 Cleaning up test data...');
  await (prisma as any).marketplaceOrderItem.deleteMany({ where: { orderId: order.id } });
  await (prisma as any).marketplaceOrder.delete({ where: { id: order.id } });
  await (prisma as any).marketplaceProduct.deleteMany({ where: { storeId: store.id } });
  await (prisma as any).marketplaceStore.delete({ where: { id: store.id } });
  await prisma.hotelRoomType.deleteMany({ where: { hotelId: hotel.id } });
  await prisma.hotel.delete({ where: { id: hotel.id } });
  await prisma.location.delete({ where: { listing_id: listing.id } });
  await prisma.listing.delete({ where: { id: listing.id } });
  await prisma.user.delete({ where: { id: userId } });

  await app.close();
  process.exit(0);
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
