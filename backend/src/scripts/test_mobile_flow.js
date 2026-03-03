const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const supabase = require(path.join(__dirname, '../config/supabase'));
const authService = require(path.join(__dirname, '../services/mobile/auth.service'));
const riderService = require(path.join(__dirname, '../services/mobile/rider.service'));
const pilotService = require(path.join(__dirname, '../services/mobile/pilot.service'));

const runVerification = async () => {
    console.log("🚀 Starting Mobile End-to-End Verification...");

    try {
        // 1. Setup Test User & Pilot
        const testEmail = 'pilot@dashdrive.com';
        const { data: user, error: userErr } = await supabase.from('users').select('*').eq('email', testEmail).maybeSingle();

        if (userErr || !user) {
            throw new Error(`Test user ${testEmail} not found. Please run seed.js first.`);
        }
        console.log("✅ Using Test User:", user.email);

        // 2. Rider: Search & Store Details
        const stores = await riderService.searchStores('DashDrive', {});
        console.log(`✅ Found ${stores.length} stores.`);
        const storeId = stores[0].id;

        // 3. Rider: Create Order
        console.log("  Fetching Menu for Store...");
        const storeWithMenu = await riderService.getStoreWithMenu(storeId);
        const menuItem = storeWithMenu.menu[0].menu_items[0];

        console.log("  Placing Test Order...");
        const order = await riderService.processMobileOrder({
            userId: user.id,
            storeId: storeId,
            organizationId: stores[0].organization_id,
            items: [{ id: menuItem.id, quantity: 1, price: menuItem.price }],
            deliveryAddress: '456 Pilot Way, London'
        });
        console.log("✅ Order Created:", order.id);

        // 4. Admin/System: Create Trip for Order
        const { data: trip, error: tripErr } = await supabase.from('trips').insert([{
            external_id: `TRIP-${Date.now()}`,
            order_id: order.id,
            status: 'pending',
            initial_offer: 25.00,
            current_price: 25.00
        }]).select().single();

        if (tripErr) {
            console.error("  ❌ Trip Generation Failed:", tripErr.message, tripErr.details);
            throw tripErr;
        }
        if (!trip) {
            console.error("  ❌ Trip created but no data returned. Check RLS or triggers.");
            throw new Error("Trip creation returned null data");
        }
        console.log("✅ Trip Mission Generated:", trip.id);

        // 5. Pilot: Find & Accept Mission
        const missions = await pilotService.findNearbyTrips({ pilotId: 'pilot-id', location: { lat: 0, lng: 0 } });
        console.log(`✅ Found ${missions.length} available missions.`);

        const myPilot = await supabase.from('drivers').select('id').eq('user_id', user.id).single();
        await pilotService.assignPilotToTrip(trip.id, myPilot.data.id);
        console.log("✅ Mission Accepted by Pilot!");

        // 6. Pilot: Update Telemetry
        await pilotService.updatePilotTelemetry(myPilot.data.id, { latitude: 51.5, longitude: -0.1 });
        console.log("✅ Telemetry Updated.");

        console.log("🏆 End-to-End Verification SUCCESSFUL!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Verification Failed:", err.message);
        process.exit(1);
    }
};

runVerification();
