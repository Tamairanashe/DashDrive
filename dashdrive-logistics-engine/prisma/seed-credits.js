const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Credit Packages...');

  const packages = [
    { name: 'Starter', price: 10, credits: 8, expiresInDays: 7 },
    { name: 'Basic', price: 20, credits: 17, expiresInDays: 14 },
    { name: 'Standard', price: 40, credits: 36, expiresInDays: 30 },
    { name: 'Pro', price: 80, credits: 75, expiresInDays: 60 },
  ];

  for (const pkg of packages) {
    const existing = await prisma.creditPackage.findFirst({
      where: { name: pkg.name },
    });
    
    if (!existing) {
      await prisma.creditPackage.create({
        data: pkg,
      });
    } else {
      await prisma.creditPackage.update({
        where: { id: existing.id },
        data: pkg,
      });
    }
  }

  console.log('✅ Credit Packages seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
