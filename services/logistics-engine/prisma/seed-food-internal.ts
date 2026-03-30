import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Internal Food Merchant...');

    // 1. Get a country (e.g., Zimbabwe)
    const country = await prisma.country.findFirst({
        where: { code: 'ZW' }
    });

    if (!country) {
        console.error('❌ Country ZW not found. Please run seed.ts first.');
        return;
    }

    // 2. Create the DashFood System Merchant
    const merchant = await prisma.merchant.upsert({
        where: { email: 'system@dashfood.com' },
        update: {},
        create: {
            email: 'system@dashfood.com',
            passwordHash: 'INTERNAL_SYSTEM_ACCOUNT',
            storeName: 'DashFood Internal Hub',
            countryId: country.id,
            isVerified: true
        }
    });

    console.log(`✅ Merchant created: ${merchant.storeName} (${merchant.id})`);

    // 3. Generate a static API Key for easy configuration
    const staticKey = 'sk_live_food_internal_882299';

    await prisma.apiKey.upsert({
        where: { key: staticKey },
        update: { isActive: true },
        create: {
            merchantId: merchant.id,
            key: staticKey,
            name: 'DashFood Production Key',
            isActive: true
        }
    });

    console.log(`✅ API Key created: ${staticKey}`);
    console.log('🏁 Internal Seeding Completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding Failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
