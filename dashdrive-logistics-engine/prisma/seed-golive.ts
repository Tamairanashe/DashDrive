import { PrismaClient, BusinessType, AcceptanceMode } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting Go-Live Seed: FOOD + MART Merchants...\n');

    // ==========================================
    // 1. SEED COUNTRIES
    // ==========================================
    const countries = [
        { name: 'Zimbabwe', code: 'ZW', currency: 'USD', timezone: 'Africa/Harare' },
        { name: 'Kenya', code: 'KE', currency: 'KES', timezone: 'Africa/Nairobi' },
        { name: 'Nigeria', code: 'NG', currency: 'NGN', timezone: 'Africa/Lagos' },
        { name: 'South Africa', code: 'ZA', currency: 'ZAR', timezone: 'Africa/Johannesburg' },
        { name: 'United Kingdom', code: 'GB', currency: 'GBP', timezone: 'Europe/London' },
    ];

    for (const c of countries) {
        await prisma.country.upsert({ where: { code: c.code }, update: c, create: c });
    }
    console.log('✅ Countries seeded');

    const zw = await prisma.country.findUnique({ where: { code: 'ZW' } });
    const ke = await prisma.country.findUnique({ where: { code: 'KE' } });
    if (!zw || !ke) throw new Error('Countries not found after seeding');

    const passwordHash = await bcrypt.hash('password123', 10);

    // ==========================================
    // 2. SEED PRICING RULES
    // ==========================================
    await prisma.pricingRule.upsert({
        where: { countryCode: 'ZW' },
        update: {},
        create: { countryCode: 'ZW', baseFee: 2.00, distanceFeeKm: 0.80, timeFeeMin: 0.10, serviceFee: 1.00 }
    });
    await prisma.pricingRule.upsert({
        where: { countryCode: 'KE' },
        update: {},
        create: { countryCode: 'KE', baseFee: 150, distanceFeeKm: 50, timeFeeMin: 10, serviceFee: 80 }
    });
    console.log('✅ Pricing rules seeded');

    // ==========================================
    // 3. SEED MART MERCHANT (Zimbabwe)
    // ==========================================
    const martMerchant = await prisma.merchant.upsert({
        where: { email: 'mart@dashdrive.com' },
        update: {},
        create: {
            email: 'mart@dashdrive.com',
            passwordHash,
            storeName: 'QuickMart Harare',
            type: BusinessType.MART,
            countryId: zw.id,
            isVerified: true,
            phone: '+263771234567',
        },
    });
    console.log(`✅ Mart Merchant: ${martMerchant.storeName} (${martMerchant.email})`);

    const martStore = await prisma.store.upsert({
        where: { id: martMerchant.id + '-store' },
        update: {},
        create: {
            id: martMerchant.id + '-store',
            merchantId: martMerchant.id,
            name: 'QuickMart Avondale',
            address: '5 King George Road, Avondale',
            city: 'Harare',
            currency: 'USD',
            timezone: 'Africa/Harare',
            taxRate: 0.15,
            commissionRate: 0.10,
            isActive: true,
            acceptanceMode: AcceptanceMode.MANUAL,
        },
    });
    console.log(`  📍 Store created: ${martStore.name}`);

    // Mart Categories + Products
    const martGrocery = await prisma.category.create({
        data: { storeId: martStore.id, merchantId: martMerchant.id, name: 'Groceries' },
    });
    const martDrinks = await prisma.category.create({
        data: { storeId: martStore.id, merchantId: martMerchant.id, name: 'Drinks' },
    });

    const martProducts = [
        { name: 'White Bread', description: 'Fresh 700g loaf', basePrice: 1.50, stock: 100, categoryId: martGrocery.id },
        { name: 'Full Cream Milk 1L', description: 'Fresh dairy milk', basePrice: 2.00, stock: 50, categoryId: martGrocery.id },
        { name: 'Brown Rice 2kg', description: 'Premium long grain', basePrice: 4.50, stock: 30, categoryId: martGrocery.id },
        { name: 'Cooking Oil 750ml', description: 'Sunflower cooking oil', basePrice: 3.20, stock: 40, categoryId: martGrocery.id },
        { name: 'Coca-Cola 2L', description: 'Original cola', basePrice: 2.50, stock: 60, categoryId: martDrinks.id },
        { name: 'Bottled Water 500ml', description: 'Still mineral water', basePrice: 0.80, stock: 200, categoryId: martDrinks.id },
        { name: 'Orange Juice 1L', description: '100% natural', basePrice: 3.50, stock: 25, categoryId: martDrinks.id },
    ];

    for (const p of martProducts) {
        await prisma.product.create({
            data: { storeId: martStore.id, merchantId: martMerchant.id, ...p },
        });
    }
    console.log(`  🛒 ${martProducts.length} Mart products created`);

    // Business Hours for Mart
    for (let day = 0; day < 7; day++) {
        await prisma.businessHours.create({
            data: {
                storeId: martStore.id,
                dayOfWeek: day,
                openTime: day === 0 ? '09:00' : '07:00',
                closeTime: day === 0 ? '15:00' : '21:00',
                isOpen: true,
            },
        });
    }
    console.log('  🕐 Business hours set');

    // ==========================================
    // 4. SEED FOOD MERCHANT (Zimbabwe)
    // ==========================================
    const foodMerchant = await prisma.merchant.upsert({
        where: { email: 'food@dashdrive.com' },
        update: {},
        create: {
            email: 'food@dashdrive.com',
            passwordHash,
            storeName: 'Flame Grill Kitchen',
            type: BusinessType.FOOD,
            countryId: zw.id,
            isVerified: true,
            phone: '+263772345678',
        },
    });
    console.log(`\n✅ Food Merchant: ${foodMerchant.storeName} (${foodMerchant.email})`);

    const foodStore = await prisma.store.upsert({
        where: { id: foodMerchant.id + '-store' },
        update: {},
        create: {
            id: foodMerchant.id + '-store',
            merchantId: foodMerchant.id,
            name: 'Flame Grill - Sam Levy',
            address: '12 Sam Levy Village, Borrowdale',
            city: 'Harare',
            currency: 'USD',
            timezone: 'Africa/Harare',
            taxRate: 0.15,
            commissionRate: 0.15,
            isActive: true,
            acceptanceMode: AcceptanceMode.AUTO,
            autoAcceptOrders: true,
            slaWarningMinutes: 8,
            slaBreachMinutes: 15,
            escalationEnabled: true,
            escalationRoles: ['manager', 'supervisor'],
        },
    });
    console.log(`  📍 Store created: ${foodStore.name}`);

    // Food Categories + Products
    const burgers = await prisma.category.create({
        data: { storeId: foodStore.id, merchantId: foodMerchant.id, name: 'Burgers' },
    });
    const sides = await prisma.category.create({
        data: { storeId: foodStore.id, merchantId: foodMerchant.id, name: 'Sides' },
    });
    const beverages = await prisma.category.create({
        data: { storeId: foodStore.id, merchantId: foodMerchant.id, name: 'Beverages' },
    });

    const foodProducts = [
        { name: 'Classic Smash Burger', description: 'Double beef patty, cheddar, pickles', basePrice: 8.50, stock: 999, categoryId: burgers.id },
        { name: 'Chicken Burger', description: 'Crispy fried chicken, coleslaw, mayo', basePrice: 7.50, stock: 999, categoryId: burgers.id },
        { name: 'Veggie Burger', description: 'Plant-based patty, avocado, lettuce', basePrice: 9.00, stock: 999, categoryId: burgers.id },
        { name: 'BBQ Bacon Burger', description: 'Beef, bacon, BBQ sauce, onion rings', basePrice: 10.00, stock: 999, categoryId: burgers.id },
        { name: 'Loaded Fries', description: 'Cheese, jalapeños, sour cream', basePrice: 4.50, stock: 999, categoryId: sides.id },
        { name: 'Onion Rings', description: 'Beer-battered crispy rings', basePrice: 3.50, stock: 999, categoryId: sides.id },
        { name: 'Coleslaw', description: 'Creamy house-made', basePrice: 2.00, stock: 999, categoryId: sides.id },
        { name: 'Fresh Lemonade', description: 'Hand-squeezed daily', basePrice: 3.00, stock: 999, categoryId: beverages.id },
        { name: 'Milkshake', description: 'Vanilla / Chocolate / Strawberry', basePrice: 5.00, stock: 999, categoryId: beverages.id },
    ];

    for (const p of foodProducts) {
        await prisma.product.create({
            data: { storeId: foodStore.id, merchantId: foodMerchant.id, ...p },
        });
    }
    console.log(`  🍔 ${foodProducts.length} Food products created`);

    // Modifier Groups for Classic Smash Burger
    const classicBurger = await prisma.product.findFirst({
        where: { name: 'Classic Smash Burger', storeId: foodStore.id },
    });
    if (classicBurger) {
        const sizeGroup = await prisma.modifierGroup.create({
            data: {
                productId: classicBurger.id,
                name: 'Choose Size',
                minSelect: 1,
                maxSelect: 1,
            },
        });
        await prisma.modifier.createMany({
            data: [
                { modifierGroupId: sizeGroup.id, name: 'Regular', price: 0 },
                { modifierGroupId: sizeGroup.id, name: 'Large (+$2)', price: 2.00 },
            ],
        });

        const toppingsGroup = await prisma.modifierGroup.create({
            data: {
                productId: classicBurger.id,
                name: 'Extra Toppings',
                minSelect: 0,
                maxSelect: 3,
            },
        });
        await prisma.modifier.createMany({
            data: [
                { modifierGroupId: toppingsGroup.id, name: 'Extra Cheese', price: 1.00 },
                { modifierGroupId: toppingsGroup.id, name: 'Bacon', price: 1.50 },
                { modifierGroupId: toppingsGroup.id, name: 'Avocado', price: 2.00 },
                { modifierGroupId: toppingsGroup.id, name: 'Jalapeños', price: 0.50 },
            ],
        });
        console.log('  🧀 Modifier groups created for Classic Smash Burger');
    }

    // Business Hours for Food
    for (let day = 0; day < 7; day++) {
        await prisma.businessHours.create({
            data: {
                storeId: foodStore.id,
                dayOfWeek: day,
                openTime: '10:00',
                closeTime: '22:00',
                isOpen: day !== 1, // Closed on Monday
            },
        });
    }
    console.log('  🕐 Business hours set (closed Mondays)');

    // ==========================================
    // 5. SEED FOOD MERCHANT (Kenya)
    // ==========================================
    const keFoodMerchant = await prisma.merchant.upsert({
        where: { email: 'nyamachoma@dashdrive.co.ke' },
        update: {},
        create: {
            email: 'nyamachoma@dashdrive.co.ke',
            passwordHash,
            storeName: 'Nyama Choma Express',
            type: BusinessType.FOOD,
            countryId: ke.id,
            isVerified: true,
            phone: '+254712345678',
        },
    });
    console.log(`\n✅ Kenya Food Merchant: ${keFoodMerchant.storeName}`);

    const keStore = await prisma.store.upsert({
        where: { id: keFoodMerchant.id + '-store' },
        update: {},
        create: {
            id: keFoodMerchant.id + '-store',
            merchantId: keFoodMerchant.id,
            name: 'Nyama Choma - Westlands',
            address: 'Sarit Centre, Westlands',
            city: 'Nairobi',
            currency: 'KES',
            timezone: 'Africa/Nairobi',
            taxRate: 0.16,
            commissionRate: 0.12,
            isActive: true,
            acceptanceMode: AcceptanceMode.MANUAL,
        },
    });

    const keGrill = await prisma.category.create({
        data: { storeId: keStore.id, merchantId: keFoodMerchant.id, name: 'Grilled Meats' },
    });

    const keProducts = [
        { name: 'Nyama Choma (500g)', description: 'Flame-grilled goat ribs', basePrice: 850, stock: 999, categoryId: keGrill.id },
        { name: 'Chicken Quarter', description: 'Marinated & grilled', basePrice: 450, stock: 999, categoryId: keGrill.id },
        { name: 'Ugali & Sukuma', description: 'Traditional side dish', basePrice: 200, stock: 999, categoryId: keGrill.id },
    ];
    for (const p of keProducts) {
        await prisma.product.create({ data: { storeId: keStore.id, merchantId: keFoodMerchant.id, ...p } });
    }
    console.log(`  🔥 ${keProducts.length} Kenya products created`);

    // ==========================================
    // 6. SEED RIDERS
    // ==========================================
    const riders = [
        { name: 'Tinashe Moyo', phone: '+263771000001', vehicleType: 'bike', countryCode: 'ZW', latitude: -17.8292, longitude: 31.0522 },
        { name: 'Brian Mutasa', phone: '+263771000002', vehicleType: 'scooter', countryCode: 'ZW', latitude: -17.8100, longitude: 31.0455, isOnline: true },
        { name: 'Gift Ndlovu', phone: '+263771000003', vehicleType: 'car', countryCode: 'ZW', latitude: -17.7900, longitude: 31.0600, isOnline: true },
        { name: 'James Wanjiku', phone: '+254722000001', vehicleType: 'bike', countryCode: 'KE', latitude: -1.2921, longitude: 36.8219, isOnline: true },
    ];

    for (const r of riders) {
        await prisma.rider.upsert({
            where: { phone: r.phone },
            update: {},
            create: r,
        });
    }
    console.log(`\n✅ ${riders.length} Riders seeded`);

    // ==========================================
    // 7. SEED ZONES
    // ==========================================
    await prisma.zone.create({
        data: { name: 'Harare CBD', countryCode: 'ZW', minLat: -17.85, maxLat: -17.80, minLng: 31.03, maxLng: 31.07, surgeMultiplier: 1.0 },
    });
    await prisma.zone.create({
        data: { name: 'Borrowdale', countryCode: 'ZW', minLat: -17.78, maxLat: -17.74, minLng: 31.05, maxLng: 31.10, surgeMultiplier: 1.2 },
    });
    await prisma.zone.create({
        data: { name: 'Nairobi Westlands', countryCode: 'KE', minLat: -1.27, maxLat: -1.26, minLng: 36.80, maxLng: 36.82, surgeMultiplier: 1.0 },
    });
    console.log('✅ Delivery zones seeded');

    // ==========================================
    // SUMMARY
    // ==========================================
    console.log('\n═══════════════════════════════════════');
    console.log('🏁 GO-LIVE SEEDING COMPLETE!');
    console.log('═══════════════════════════════════════');
    console.log('\n📋 Test Credentials (password: password123):');
    console.log('  MART: mart@dashdrive.com');
    console.log('  FOOD: food@dashdrive.com');
    console.log('  FOOD (KE): nyamachoma@dashdrive.co.ke');
    console.log('\n📋 API Endpoints:');
    console.log('  POST /api/v1/auth/login    { email, password }');
    console.log('  POST /api/v1/auth/register { email, password, storeName, countryCode, type }');
    console.log('  GET  /api/v1/merchants/profile');
    console.log('  GET  /api/v1/stores');
    console.log('  GET  /api/v1/orders/store/:storeId');
    console.log('═══════════════════════════════════════\n');
}

main()
    .catch((e) => {
        console.error('❌ Seeding Failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
