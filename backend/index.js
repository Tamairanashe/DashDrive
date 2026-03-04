require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const { Expo } = require('expo-server-sdk');

// Initialize Expo SDK
let expo = new Expo();

// Supabase Init (Using Render Env Vars)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for backend bypass
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(cors());
app.use(morgan('dev')); // Production-grade logging
app.use(express.json());

// API Auth Middleware
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (process.env.BACKEND_API_KEY && apiKey !== process.env.BACKEND_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }
    next();
};

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite default port
        methods: ["GET", "POST"]
    }
});

// Route Imports
const mobileRoutes = require('./src/routes/mobile.routes');
const merchantRoutes = require('./src/routes/merchant.routes');

// API Routes
app.use('/api/mobile', mobileRoutes);
app.use('/api/merchant', merchantRoutes);

// Initial driver and trip state will be managed via Supabase
let drivers = [];
let activeTrips = [];

// Helper to fetch state from Supabase
const syncStateFromSupabase = async () => {
    try {
        const { data: driverData } = await supabase.from('drivers').select('*');
        const { data: tripData } = await supabase.from('trips').select('*').in('status', ['negotiating', 'matched']);

        if (driverData) drivers = driverData;
        if (tripData) activeTrips = tripData;
    } catch (err) {
        console.error("Error syncing state:", err.message);
    }
};

// Periodic Sync
setInterval(syncStateFromSupabase, 10000);
syncStateFromSupabase(); // Initial sync

// Simulation loop
setInterval(async () => {
    if (drivers.length === 0) return;

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

    // Update locally
    drivers = updatedDrivers;

    // Push to Supabase (optimized for simulation)
    // In production, we'd use a more efficient batched update or only update changed fields
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

const { handleNegotiation } = require('./src/controllers/negotiationController');

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.emit('driversUpdate', drivers);

    // Delegate all negotiation and chat logic to the unified controller
    handleNegotiation(socket, io);

    // ==========================
    // DashFood Room Management
    // ==========================
    socket.on('join_store', (storeId) => {
        socket.join(`store_${storeId}`);
        console.log(`[DashFood] Client joined store room: store_${storeId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// ==========================
// Module C: DashFood API
// ==========================

// Dashboard Status Sync Endpoint - AUTHORITATIVE
app.patch('/api/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status, reason, userId } = req.body;

    const { id } = req.params;
    const { status, reason } = req.body;
    const { orderService } = require('./src/controllers/merchant/order.controller'); // Fallback if not globally shared
    const defaultOrderService = require('./src/services/merchant/order.service');

    console.log(`[DashFood] Authoritative Status Update: Order ${id} -> ${status}`);

    try {
        let updatedOrder;
        if (status === 'preparing') {
            updatedOrder = await defaultOrderService.acceptOrder(id);
        } else if (status === 'ready') {
            updatedOrder = await defaultOrderService.markOrderReady(id);
        } else {
            // Fallback for other statuses
            const { data, error } = await supabase
                .from('orders')
                .update({ status, updated_at: new Date() })
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            updatedOrder = data;
        }

        // Broadcast to specific store room
        const broadcastPayload = { ...updatedOrder, reason };
        io.to(`store_${updatedOrder.store_id}`).emit('orderStatusChanged', broadcastPayload);
        io.emit('orderStatusChanged', broadcastPayload);

        res.json({ success: true, order: updatedOrder });
    } catch (err) {
        console.error("[DashFood] Status Update Error:", err.message);
        res.status(500).json({ error: "Failed to update order status" });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'live', system: 'dashfood-sync' });
});

// ==========================
// Module D: Supabase Sync & Push Notifications
// ==========================

const sendPushNotification = async (pushToken, title, body, data = {}) => {
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return;
    }

    const message = {
        to: pushToken,
        sound: 'default',
        title,
        body,
        data,
        priority: 'high',
    };

    try {
        const ticketChunk = await expo.sendPushNotificationsAsync([message]);
        console.log("Push Notification Sent:", ticketChunk);
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
};

// Push Token Registration
app.post("/api/notifications/register", async (req, res) => {
    const { userId, storeId, pushToken, role } = req.body;

    try {
        const { error } = await supabase
            .from('users')
            .update({ push_token: pushToken })
            .eq('id', userId);

        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 1. Render -> Supabase (Incoming External Order)
app.post("/webhooks/new-order", validateApiKey, async (req, res) => {
    const orderData = req.body;
    console.log("[Webhook] New external order received:", orderData);

    try {
        const { data, error } = await supabase
            .from('orders')
            .insert({
                customer_name: orderData.customer,
                total_amount: orderData.amount,
                status: 'new',
                store_id: orderData.store_id || '476e91d7-3b2a-4e83-680a-7f61ff95bf3c',
                organization_id: orderData.organization_id || 'cfd01e92-8b1d-4afd-8d27-0a18aa8564ed',
                items: orderData.items || []
            })
            .select()
            .single();

        if (error) throw error;

        // Broadcast to Dashboard & Mobile App (Scoped to store room)
        io.to(`store_${data.store_id}`).emit('newIncomingOrder', data);

        // Also broadcast globally for general monitoring
        io.emit('newIncomingOrder', data);

        // Send Push Notifications to store staff
        try {
            const { data: usersWithTokens, error: userError } = await supabase
                .from('users')
                .select('push_token')
                .eq('store_id', data.store_id)
                .not('push_token', 'is', null);

            if (!userError && usersWithTokens) {
                usersWithTokens.forEach(u => {
                    if (u.push_token) {
                        sendPushNotification(
                            u.push_token,
                            'New Order Received! 🍱',
                            `Order for ${data.customer_name} of $${data.total_amount?.toFixed(2)}`,
                            { orderId: data.id, storeId: data.store_id }
                        );
                    }
                });
            }
        } catch (pushErr) {
            console.error("Push Notification Dispatch Error:", pushErr.message);
        }

        res.status(200).json({ success: true, orderId: data.id });
    } catch (err) {
        console.error("Supabase Insert Error:", err.message);
        res.status(500).json({ error: "Failed to sync to Supabase" });
    }
});

// 2. Supabase -> Render (Database Event Sync)
// This is called by Supabase Database Webhooks
app.post("/webhooks/supabase-sync", validateApiKey, (req, res) => {
    const { record, type, table } = req.body;

    console.log(`[Supabase Event] ${type} on ${table}:`, record.id);

    if (table === 'orders' && type === 'UPDATE') {
        const payload = {
            id: record.id,
            status: record.status,
            updatedAt: record.updated_at
        };

        // Broadcast to store room
        io.to(`store_${record.store_id}`).emit('orderStatusChanged', payload);

        // Global broadcast
        io.emit('orderStatusChanged', payload);
    }

    res.status(200).send("OK");
});

// ==========================
// Module E: Background Intelligence Worker
// ==========================
setInterval(async () => {
    // 1. SLA Breach Monitor
    // 2. Pickup Delay Monitor
    try {
        const { data: activeOrders } = await supabase
            .from('orders')
            .select('*, stores(*)')
            .in('status', ['new', 'in_progress', 'ready']);

        if (!activeOrders) return;

        for (const order of activeOrders) {
            const now = new Date();
            const createdAt = new Date(order.created_at);
            const elapsed = (now - createdAt) / 60000;
            const breachMin = order.stores?.sla_breach_minutes || 30;

            // SLA Breach Alert
            if (elapsed >= breachMin && order.status !== 'ready') {
                console.log(`[Monitor] SLA Breach for Order ${order.id}`);

                // Persist as Issue if not already exists
                const { data: existing } = await supabase
                    .from('issues')
                    .select('id')
                    .eq('order_id', order.id)
                    .eq('type', 'late')
                    .maybeSingle();

                if (!existing) {
                    const { data: newIssue } = await supabase
                        .from('issues')
                        .insert({
                            order_id: order.id,
                            type: 'late',
                            severity: 'high',
                            status: 'open',
                            resolution_notes: `System detected SLA breach at ${elapsed.toFixed(0)} mins.`
                        })
                        .select()
                        .single();

                    if (newIssue) {
                        io.to(`store_${order.store_id}`).emit('newIssue', newIssue);
                    }
                }
            }

            // Pickup Delay Alert
            if (order.status === 'ready' && order.ready_at) {
                const shelfElapsed = (now - new Date(order.ready_at)) / 60000;
                if (shelfElapsed >= 20) {
                    console.log(`[Monitor] Pickup Delay Critical for Order ${order.id}`);

                    const { data: existing } = await supabase
                        .from('issues')
                        .select('id')
                        .eq('order_id', order.id)
                        .eq('type', 'pickup_delay')
                        .maybeSingle();

                    if (!existing) {
                        const { data: newIssue } = await supabase
                            .from('issues')
                            .insert({
                                order_id: order.id,
                                type: 'pickup_delay',
                                severity: 'medium',
                                status: 'open',
                                resolution_notes: `Order waiting on shelf for ${shelfElapsed.toFixed(0)} mins.`
                            })
                            .select()
                            .single();

                        if (newIssue) {
                            io.to(`store_${order.store_id}`).emit('newIssue', newIssue);
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error("Monitor Error:", err.message);
    }
}, 60000); // Check every minute

const PORT = process.env.PORT || 8000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Real-time simulation server running on port ${PORT}`);
});
