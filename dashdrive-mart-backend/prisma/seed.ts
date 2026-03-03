import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting Regional Data Seeding...');

    const countries = [
        {
            name: 'Zimbabwe',
            code: 'ZW',
            currency: 'USD',
            timezone: 'Africa/Harare',
        },
        {
            name: 'Kenya',
            code: 'KE',
            currency: 'KES',
            timezone: 'Africa/Nairobi',
        },
        {
            name: 'Nigeria',
            code: 'NG',
            currency: 'NGN',
            timezone: 'Africa/Lagos',
        },
        {
            name: 'South Africa',
            code: 'ZA',
            currency: 'ZAR',
            timezone: 'Africa/Johannesburg',
        },
        {
            name: 'United Kingdom',
            code: 'GB',
            currency: 'GBP',
            timezone: 'Europe/London',
        }
    ];

    for (const country of countries) {
        await prisma.country.upsert({
            where: { code: country.code },
            update: country,
            create: country,
        });
        console.log(`  ✅ Seeded Country: ${country.name} (${country.code})`);
    }

    console.log('🏁 Seeding Completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding Failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
