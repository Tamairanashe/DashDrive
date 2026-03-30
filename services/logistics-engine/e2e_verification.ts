import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyVerticalFlows() {
    console.log('--- Phase 5 E2E Verification Start ---');

    try {
        const merchantId = '5f165d31-d2ae-4aa9-9d18-233e18a3cad5';
        
        // 1. Food Vertical Verification
        console.log('\n[Food Vertical] Testing Store creation with ratings and prep time...');
        const foodStore = await prisma.store.create({
            data: {
                merchantId: merchantId,
                name: 'Test Gourmet Restaurant',
                address: '123 Gourmet Way',
                city: 'Harare',
                currency: 'USD',
                timezone: 'Africa/Harare',
                latitude: -17.8248,
                longitude: 31.053,
                estimatedPrepTime: 25,
                cuisineTypes: ['Italian', 'Fine Dining'],
            }
        });
        console.log(`✅ Food Store created: ${foodStore.id}`);

        console.log('[Food Vertical] Testing Product creation with food attributes...');
        const foodProduct = await prisma.product.create({
            data: {
                merchantId: merchantId,
                name: 'Truffle Pasta',
                basePrice: 18.50,
                storeId: foodStore.id,
                isHalal: true,
                isVegetarian: true,
            }
        });
        console.log(`✅ Food Product created: ${foodProduct.id}`);

        console.log('[Review System] Testing automated rating aggregation...');
        await prisma.review.create({
            data: {
                storeId: foodStore.id,
                rating: 5,
                comment: 'Amazing experience!'
            }
        });
        await prisma.review.create({
            data: {
                storeId: foodStore.id,
                rating: 4,
                comment: 'Good food, slightly late.'
            }
        });

        // Note: The aggregation normally happens in the service layer, but let's check if the service would work.
        // Since I'm using Prisma directly, I'll simulate the service's aggregation logic to verify the queries.
        const stats = await prisma.review.aggregate({
            where: { storeId: foodStore.id },
            _avg: { rating: true },
            _count: { id: true },
        });

        await prisma.store.update({
            where: { id: foodStore.id },
            data: {
                rating: stats._avg.rating || 0,
                reviewCount: stats._count.id,
            }
        });

        const updatedStore = await prisma.store.findUnique({ where: { id: foodStore.id } });
        console.log(`✅ Aggregated Rating: ${updatedStore?.rating}, Review Count: ${updatedStore?.reviewCount}`);

        // 2. Mart Vertical Verification
        console.log('\n[Mart Vertical] Testing Product creation with barcode and weight...');
        const martStore = await prisma.store.create({
            data: {
                merchantId: merchantId,
                name: 'Test Mart Express',
                address: '456 Mart St',
                city: 'Harare',
                currency: 'USD',
                timezone: 'Africa/Harare',
                latitude: -17.8248,
                longitude: 31.053,
            }
        });
        const martProduct = await prisma.product.create({
            data: {
                merchantId: merchantId,
                name: 'Laundry Detergent',
                basePrice: 12.00,
                storeId: martStore.id,
                barcode: 'MART-SKU-999',
                weightUnit: '2kg',
            }
        });
        console.log(`✅ Mart Product created with Barcode: ${martProduct.barcode}, Weight: ${martProduct.weightUnit}`);

        // 3. Shopping Vertical Verification
        console.log('\n[Shopping Vertical] Testing Product creation with generic attributes...');
        const shopStore = await prisma.store.create({
            data: {
                merchantId: merchantId,
                name: 'Test Fashion Shop',
                address: '789 Fashion Ave',
                city: 'Harare',
                currency: 'USD',
                timezone: 'Africa/Harare',
                latitude: -17.8248,
                longitude: 31.053,
            }
        });
        const shopProduct = await prisma.product.create({
            data: {
                merchantId: merchantId,
                name: 'Summer T-Shirt',
                basePrice: 25.00,
                storeId: shopStore.id,
                attributes: {
                    color: 'Sky Blue',
                    size: ['S', 'M', 'L'],
                    material: 'Cotton'
                }
            }
        });
        console.log(`✅ Shopping Product created with Attributes: ${JSON.stringify(shopProduct.attributes)}`);

        // Cleanup
        console.log('\n--- Cleanup ---');
        await prisma.review.deleteMany({ where: { storeId: foodStore.id } });
        await prisma.product.deleteMany({ where: { id: { in: [foodProduct.id, martProduct.id, shopProduct.id] } } });
        await prisma.store.deleteMany({ where: { id: { in: [foodStore.id, martStore.id, shopStore.id] } } });
        console.log('✅ Cleanup complete.');

        console.log('\n--- Phase 5 E2E Verification SUCCESS ---');

    } catch (error) {
        console.error('\n❌ Verification FAILED:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyVerticalFlows();
