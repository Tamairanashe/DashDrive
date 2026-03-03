const supabase = require('../config/supabase');
const { getIO } = require('../config/socket');

let drivers = [];
let activeTrips = [];

const syncStateFromSupabase = async () => {
    try {
        const { data: driverData } = await supabase.from('drivers').select('*');
        const { data: tripData } = await supabase.from('trips').select('*').in('status', ['negotiating', 'matched']);

        if (driverData) drivers = driverData;
        if (tripData) activeTrips = tripData;
    } catch (err) {
        console.error("[Simulation] Error syncing state:", err.message);
    }
};

const simulateMarketingActivity = async () => {
    try {
        // Randomly Increment Ad Performance (Impressions, Clicks, Spent)
        const { data: ads } = await supabase.from('marketing_ads').select('id, impressions, clicks, spent').eq('status', 'Active');
        if (ads && ads.length > 0) {
            for (const ad of ads) {
                const newImpressions = Math.floor(Math.random() * 5);
                const newClicks = Math.random() > 0.8 ? 1 : 0;
                const newSpent = newClicks * (Math.random() * 2);

                await supabase.from('marketing_ads').update({
                    impressions: ad.impressions + newImpressions,
                    clicks: ad.clicks + newClicks,
                    spent: Number(ad.spent) + newSpent,
                    updated_at: new Date()
                }).eq('id', ad.id);
            }
        }
    } catch (err) {
        console.error("[Simulation] Marketing Activity Error:", err.message);
    }
};

const simulateCustomerEvents = async () => {
    try {
        // Occasionally generate new customer feedback for an order
        if (Math.random() > 0.95) {
            const { data: recentOrders } = await supabase.from('orders').select('id, store_id, organization_id, tenant_id').order('created_at', { ascending: false }).limit(10);
            if (recentOrders && recentOrders.length > 0) {
                const order = recentOrders[Math.floor(Math.random() * recentOrders.length)];
                const ratings = [1, 2, 3, 4, 5];
                const comments = ["Great service!", "A bit slow but good food.", "Excellent experience.", "Wrong item received.", "Simply the best!"];

                await supabase.from('customer_feedback').insert([{
                    store_id: order.store_id,
                    order_id: order.id,
                    rating: ratings[Math.floor(Math.random() * ratings.length)],
                    comment: comments[Math.floor(Math.random() * comments.length)],
                    status: 'pending',
                    created_at: new Date()
                }]);
                console.log("[Simulation] Added new customer feedback for order:", order.id);
            }
        }
    } catch (err) {
        // Table might not exist yet if migration wasn't run
    }
};

const startSimulation = () => {
    setInterval(syncStateFromSupabase, 10000);
    setInterval(simulateMarketingActivity, 15000); // Pulse marketing every 15s
    setInterval(simulateCustomerEvents, 30000); // Check for feedback events every 30s
    syncStateFromSupabase();

    setInterval(async () => {
        if (drivers.length === 0) return;
        const io = getIO();

        const updatedDrivers = drivers.map(d => {
            const speedKms = (d.speed || 10) / 3600;
            const rad = (d.heading * Math.PI) / 180;
            const deltaLat = (Math.cos(rad) * speedKms) / 111.32;
            const deltaLng = (Math.sin(rad) * speedKms) / (111.32 * Math.cos(d.latitude * Math.PI / 180));
            const newHeading = (d.heading + (Math.random() - 0.5) * 10 + 360) % 360;

            return {
                ...d,
                latitude: d.latitude + deltaLat,
                longitude: d.longitude + deltaLng,
                heading: newHeading,
                speed: Math.max(10, Math.min(60, (d.speed || 10) + (Math.random() - 0.5) * 5))
            };
        });

        drivers = updatedDrivers;

        for (const d of updatedDrivers) {
            await supabase.from('drivers').update({
                latitude: d.latitude,
                longitude: d.longitude,
                heading: d.heading,
                speed: d.speed,
                updated_at: new Date()
            }).eq('external_id', d.external_id);
        }

        io.emit('driversUpdate', drivers.map(d => ({
            id: d.external_id,
            name: d.name,
            location: { lat: d.latitude, lng: d.longitude },
            telemetry: { speed: d.speed, battery: d.battery, heading: d.heading, altitude: d.altitude },
            onlineStatus: d.status
        })));

        io.emit('marketUpdate', {
            liquidityRatio: 0.84,
            discoveryGap: 4.20,
            activeTrips: activeTrips.length
        });
    }, 2000);
};

module.exports = { startSimulation, activeTrips };
