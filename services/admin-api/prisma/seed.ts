import { PrismaClient, AdminRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@dashdrive.com';
    const password = 'AdminPassword2026!';

    const existing = await prisma.adminUser.findUnique({
        where: { email },
    });

    if (existing) {
        console.log('Seed: Admin user already exists');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.adminUser.create({
        data: {
            email,
            password: hashedPassword,
            name: 'Super Admin',
            role: AdminRole.SUPER_ADMIN,
        },
    });

    console.log('Seed: Created Super Admin user');
    console.log('Email:', email);
    console.log('Password:', password);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
