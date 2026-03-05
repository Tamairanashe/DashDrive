const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const supabase = require('../config/supabase');

const seed = async () => {
    console.log("🌱 Starting Safe Seeding Process...");

    try {
        // 1. Organization
        const slug = 'dashfood-group';
        let { data: org } = await supabase.from('organizations').select('*').eq('slug', slug).maybeSingle();

        if (!org) {
            console.log("  Creating Organization...");
            const { data: newOrg, error: orgErr } = await supabase
                .from('organizations')
                .insert({ name: 'DashFood Group', slug: slug })
                .select().single();
            if (orgErr) throw orgErr;
            org = newOrg;
        }
        console.log("✅ Organization Ready:", org.name);

        // 2. Region
        const regionName = 'London Central';
        let { data: region } = await supabase.from('regions').select('*').eq('name', regionName).eq('organization_id', org.id).maybeSingle();

        if (!region) {
            console.log("  Creating Region...");
            const { data: newRegion, error: regionErr } = await supabase
                .from('regions')
                .insert({ organization_id: org.id, name: regionName })
                .select().single();
            if (regionErr) throw regionErr;
            region = newRegion;
        }
        console.log("✅ Region Ready:", region.name);

        // 3. Store
        const storeName = 'DashDrive London HQ';
        let { data: store } = await supabase.from('stores').select('*').eq('name', storeName).eq('organization_id', org.id).maybeSingle();

        if (!store) {
            console.log("  Creating Store...");
            const { data: newStore, error: storeErr } = await supabase
                .from('stores')
                .insert({
                    organization_id: org.id,
                    region_id: region.id,
                    name: storeName,
                    address: '123 Tech Lane, London',
                    is_active: true,
                    sla_breach_minutes: 30
                })
                .select().single();
            if (storeErr) throw storeErr;
            store = newStore;
        } else {
            // Ensure it's active
            await supabase.from('stores').update({ is_active: true }).eq('id', store.id);
        }
        console.log("✅ Store Ready:", store.name);

        // 4. Roles (Platform + Merchant)
        const roleDefs = [
            { name: 'super_admin', permissions: { all: true } },
            { name: 'Owner', permissions: { dashboard: true, orders: true, inventory: true, financials: true, settings: true, staff: true, marketing: true, reports: true } },
            { name: 'Admin', permissions: { dashboard: true, orders: true, inventory: true, settings: true, marketing: true, reports: true } },
            { name: 'Manager', permissions: { dashboard: true, orders: true, inventory: true, reports: true } },
            { name: 'Staff', permissions: { dashboard: true, orders: true } },
            { name: 'Analyst', permissions: { dashboard: true, reports: true } },
        ];

        let roleId;
        for (const roleDef of roleDefs) {
            const { data: existing } = await supabase.from('roles').select('*').eq('name', roleDef.name).maybeSingle();
            if (!existing) {
                console.log(`  Creating Role: ${roleDef.name}...`);
                const { data: newRole } = await supabase.from('roles').insert(roleDef).select().single();
                if (roleDef.name === 'super_admin') roleId = newRole.id;
            } else {
                if (roleDef.name === 'super_admin') roleId = existing.id;
            }
        }
        console.log("✅ All Roles Seeded.");

        // 5. Global SuperAdmin User
        const adminEmail = 'platform@dashdrive.com';
        let { data: adminUser } = await supabase.from('users').select('*').eq('email', adminEmail).maybeSingle();
        if (!adminUser) {
            console.log("  Creating Platform SuperAdmin...");
            const { data: newUser } = await supabase.from('users').insert({
                email: adminEmail,
                full_name: 'Platform God',
                role_id: roleId,
                status: 'active'
            }).select().single();
            adminUser = newUser;
        }

        // 6. Orders (Unified Naming)
        const orders = [
            {
                store_id: store.id,
                organization_id: org.id,
                customer_name: 'Justin Chithu',
                total_amount: 45.50,
                status: 'completed',
                created_at: new Date(Date.now() - 3600000).toISOString(),
                accepted_at: new Date(Date.now() - 3500000).toISOString(),
                ready_at: new Date(Date.now() - 3000000).toISOString(),
                completed_at: new Date(Date.now() - 2500000).toISOString()
            }
        ];

        const { data: createdOrders, error: orderErr } = await supabase
            .from('orders')
            .upsert(orders)
            .select();

        if (orderErr) throw orderErr;
        console.log(`✅ Orders Seeded.`);

        // 7. Menu Structure
        console.log("  Seeding Menus...");
        let { data: category } = await supabase.from('menu_categories')
            .select('*')
            .eq('store_id', store.id)
            .eq('name', 'Main Course')
            .maybeSingle();

        if (!category) {
            console.log("  Creating Category...");
            const { data: newCat, error: catErr } = await supabase.from('menu_categories')
                .insert({ store_id: store.id, name: 'Main Course', is_active: true })
                .select().single();
            if (catErr) {
                console.error("  ❌ Category Creation Error:", catErr.message, catErr.details);
                throw catErr;
            }
            if (!newCat) {
                console.error("  ❌ Category created but no data returned. Check RLS or triggers.");
                throw new Error("Category creation returned null data");
            }
            category = newCat;
        }

        let { data: menuItem } = await supabase.from('menu_items')
            .select('*')
            .eq('category_id', category.id)
            .eq('name', 'Signature Burger')
            .maybeSingle();

        if (!menuItem) {
            console.log("  Creating MenuItem...");
            const { data: newItem, error: itemErr } = await supabase.from('menu_items')
                .insert({ category_id: category.id, name: 'Signature Burger', price: 15.00, is_active: true })
                .select().single();
            if (itemErr) {
                console.error("  ❌ MenuItem Creation Error:", itemErr.message, itemErr.details);
                throw itemErr;
            }
            if (!newItem) {
                console.error("  ❌ MenuItem created but no data returned. Check RLS or triggers.");
                throw new Error("MenuItem creation returned null data");
            }
            menuItem = newItem;
        }

        console.log("✅ Menus Seeded.");

        // 8. Drivers (Mobile)
        await supabase.from('drivers').upsert([
            { external_id: 'PILOT-342', name: 'John Smith', status: 'online' }
        ], { onConflict: 'external_id' });
        console.log("✅ Drivers Seeded.");

        // 5b. Pilot User
        const pilotEmail = 'pilot@dashdrive.com';
        let { data: pilotUser } = await supabase.from('users').select('*').eq('email', pilotEmail).maybeSingle();
        if (!pilotUser) {
            console.log("  Creating Pilot User...");
            const { data: newUser, error: pilotErr } = await supabase.from('users').insert({
                email: pilotEmail,
                full_name: 'Test Pilot',
                status: 'active'
            }).select().single();
            if (pilotErr) {
                console.error("  ❌ Pilot User Creation Failed:", pilotErr.message);
                throw pilotErr;
            }
            pilotUser = newUser;
        }

        // 5c. Driver Profile
        const { data: driver, error: drvErr } = await supabase.from('drivers').upsert([
            {
                user_id: pilotUser.id,
                external_id: 'PILOT-999',
                name: 'Test Pilot',
                status: 'online',
                latitude: 51.5074,
                longitude: -0.1278
            }
        ], { onConflict: 'user_id' }).select().single();
        if (drvErr) {
            console.error("  ❌ Driver Profile Creation Failed:", drvErr.message);
            throw drvErr;
        }
        console.log("✅ Pilot & Driver Ready.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding Failed:", err.message);
        process.exit(1);
    }
};

seed();
