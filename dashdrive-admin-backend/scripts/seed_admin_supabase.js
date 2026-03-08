require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const prisma = new PrismaClient();

async function seedAdmin() {
  const email = 'admin@dashdrive.com';
  const password = 'AdminPassword2026!';
  const name = 'Super Admin';

  console.log(`--- Seeding Admin: ${email} ---`);

  // 1. Create in Supabase Auth
  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });

  if (authErr) {
    if (authErr.message.includes('already been registered')) {
      console.log('Admin already exists in Supabase Auth');
    } else {
      console.error('Supabase Auth Error:', authErr.message);
      return;
    }
  } else {
    console.log('Admin created in Supabase Auth:', authData.user.id);
  }

  // 2. Create in Prisma AdminUser
  try {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      console.log('Admin already exists in Prisma AdminUser');
    } else {
      await prisma.adminUser.create({
        data: {
          id: authData?.user?.id || 'admin-placeholder-id', // ID might be different if already existed
          email,
          password: 'SUPABASE_AUTHENTICATED', // We don't need the real password here anymore
          name,
          role: 'SUPER_ADMIN',
        }
      });
      console.log('Admin created in Prisma AdminUser');
    }
  } catch (err) {
    console.error('Prisma Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin().catch(console.error);
