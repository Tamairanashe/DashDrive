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

// Historical Market Analytics Endpoint
app.get('/api/market/historical', async (req, res) => {
    const { start, end, service } = req.query;
    console.log(`[HISTORICAL QUERY] Range: ${start} to ${end}, Service: ${service}`);

    try {
        // 1. Fetch historical trips from Supabase for this range
        let query = supabase.from('trips')
            .select('*')
            .gte('created_at', start)
            .lte('created_at', end);
        
        if (service && service !== 'ALL') {
             // Assuming trip has a 'service_type' column or similar
             // For now we just filter what we have
        }

        const { data: historicalTrips, error } = await query;
        if (error) throw error;

        // 2. Perform spatial aggregation using the same grid logic as live
        const historicalHeatmap = heatmapCells.map(cell => {
            const tripsInCell = (historicalTrips || []).filter(t => {
                const origin = typeof t.origin === 'string' ? JSON.parse(t.origin) : t.origin;
                return isPointInCell(origin.lat, origin.lng, cell);
            });

            const metrics = {
                ...cell.metrics,
                demandCount: tripsInCell.length,
                idleSupply: Math.max(1, Math.floor(tripsInCell.length * 0.8)), // Proxy supply for history
                activeSupply: Math.floor(tripsInCell.length * 0.2),
                etaCurrent: 5
            };

            return {
                ...cell,
                metrics,
                derived: calculateDerivedMetrics(metrics)
            };
        });

        res.json(historicalHeatmap);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Initial driver and trip state will be managed via Supabase
let drivers = [];
let activeTrips = [];

// Helper to fetch and enrich state from Supabase
const syncStateFromSupabase = async () => {
    try {
        const { data: driverData } = await supabase.from('drivers').select('*');
        const { data: tripData } = await supabase.from('trips').select('*'); // Fetch all for historical calc
        const { data: userData } = await supabase.from('users').select('*').limit(20);

        if (!driverData) return;

        // Optimized Historical Aggregation
        const today = new Date();
        today.setHours(0,0,0,0);

        const enrichedDrivers = driverData.map(d => {
            const driverTrips = (tripData || []).filter(t => t.driver_id === d.id);
            const completedTrips = driverTrips.filter(t => t.status === 'completed');
            const cancelledTrips = driverTrips.filter(t => t.status === 'cancelled');
            
            const tripsToday = completedTrips.filter(t => new Date(t.created_at) >= today).length;
            const earningsToday = completedTrips
                .filter(t => new Date(t.created_at) >= today)
                .reduce((sum, t) => sum + Number(t.final_price || 0), 0);

            const successRate = driverTrips.length > 0 
                ? Math.round((completedTrips.length / driverTrips.length) * 100) 
                : 100;
            
            const cancellationRate = driverTrips.length > 0
                ? Math.round((cancelledTrips.length / driverTrips.length) * 100)
                : 0;

            return {
                ...d,
                tripsToday,
                earningsPerDay: earningsToday,
                successRate,
                cancellationRate,
                // Wallet proxy (in prod this would be a separate table)
                wallet: {
                    withdrawable: earningsToday * 0.8,
                    pending: earningsToday * 0.2,
                    withdrawn: 1200.50, // mock legacy
                    total: 1200.50 + earningsToday
                }
            };
        });

        drivers = enrichedDrivers;
        activeTrips = (tripData || []).filter(t => ['negotiating', 'matched'].includes(t.status));

        // format demand points for the map (derived from active trips)
        const demandPoints = activeTrips.map(t => {
            const origin = typeof t.origin === 'string' ? JSON.parse(t.origin) : t.origin;
            return {
                id: t.id,
                lat: origin.lat,
                lng: origin.lng,
                radius: 1000,
                intensity: 0.5,
                label: 'Active Request'
            };
        });

        // 5. Emit Fleet-wide synchronization event for Fleet View
        const fleetStats = {
            online: drivers.filter(d => d.status === 'online').length,
            busy: drivers.filter(d => d.status === 'busy').length,
            offline: drivers.filter(d => d.status === 'offline').length,
            available: drivers.filter(d => d.status === 'online').length
        };

        io.emit('fleetUpdate', {
            drivers,
            activeTrips,
            demandPoints,
            customers: userData || [],
            stats: fleetStats
        });

        console.log(`[STATE SYNC] Drivers: ${enrichedDrivers.length}, Trips: ${activeTrips.length}, Online: ${fleetStats.online}`);
    } catch (error) {
        console.error('[STATE SYNC ERROR]', error);
    }
};

// Periodic Sync
setInterval(syncStateFromSupabase, 10000);
syncStateFromSupabase(); // Initial sync

// ==========================
// Heatmap Simulation Engine
// ==========================
let heatmapCells = [];

const calculateDerivedMetrics = (metrics) => {
    const totalSupply = Math.max(1, metrics.idleSupply);
    const totalRequests = Math.max(1, metrics.demandCount);
    const imbalanceRatio = totalRequests / totalSupply;
    const etaInflation = metrics.etaCurrent / Math.max(1, metrics.etaBaseline);
    const cancellationRate = metrics.cancellations / Math.max(1, (metrics.cancellations + metrics.completedTrips));
    const requestPressure = Math.min(1.0, (totalRequests / 100)); 
    let heatScore = (
        (requestPressure * 0.35) + 
        (Math.min(2.0, etaInflation) * 0.20) + 
        (cancellationRate * 0.15) + 
        (metrics.surgeSuggestion * 0.10) - 
        ((metrics.idleSupply / 50) * 0.20)
    ) * 100;
    heatScore = Math.max(0, heatScore);
    let status = 'healthy';
    if (heatScore > 70) status = 'critical';
    else if (heatScore > 40) status = 'high_demand';
    else if (heatScore > 20) status = 'warning';
    return { imbalanceRatio, etaInflation, cancellationRate, heatScore, status };
};

const initHeatmapGrid = (centerLat = -17.8216, centerLng = 31.0492) => {
    heatmapCells = [];
    const HARARE_AREAS = [
        'Gunhill', 'Belvedere', 'Braeside', 'Ridgeview', 'Workington', 'Graniteside', 
        'Avondale', 'Borrowdale', 'Mount Pleasant', 'CBD', 'Highlands', 'Eastlea', 
        'Queensdale', 'Greendale', 'Msasa', 'Mbare', 'Highfield', 'Glen View', 
        'Kuwadzana', 'Warren Park', 'Dzivarasekwa', 'Mabvuku', 'Tafara', 'Epworth',
        'Waterfalls', 'Hatfield', 'Greystone Park', 'Glen Lorne', 'Chisipite', 'Marlborough', 'Bluff Hill', 'Mabelreign'
    ];
    const GRID_SIZE = 8;
    const CELL_SPAN_LAT = 0.015;
    const CELL_SPAN_LNG = 0.015;
    const startLat = centerLat - (GRID_SIZE / 2) * CELL_SPAN_LAT;
    const startLng = centerLng - (GRID_SIZE / 2) * CELL_SPAN_LNG;

    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            const lat = startLat + (x * CELL_SPAN_LAT);
            const lng = startLng + (y * CELL_SPAN_LNG);
            const isHotspot = Math.random() > 0.8;
            const metrics = {
                demandCount: isHotspot ? Math.floor(Math.random() * 80) + 20 : Math.floor(Math.random() * 15),
                idleSupply: isHotspot ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 30) + 5,
                activeSupply: isHotspot ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 10),
                etaBaseline: 5,
                etaCurrent: isHotspot ? 5 + Math.floor(Math.random() * 15) : 5 + Math.floor(Math.random() * 2),
                cancellations: isHotspot ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * 2),
                completedTrips: Math.floor(Math.random() * 100),
                surgeSuggestion: isHotspot ? 1.2 + (Math.random() * 0.8) : 1.0
            };
            const halfLat = CELL_SPAN_LAT / 1.9; // Slight overlap for visual continuity
            const halfLng = CELL_SPAN_LNG / 1.9;
            const baseBounds = [
                { lat: lat + halfLat, lng: lng - halfLng },
                { lat: lat + halfLat, lng: lng + halfLng },
                { lat: lat - halfLat, lng: lng + halfLng },
                { lat: lat - halfLat, lng: lng - halfLng },
            ];
            heatmapCells.push({
                id: `hex_${x}_${y}`,
                name: HARARE_AREAS[(x * GRID_SIZE + y) % HARARE_AREAS.length],
                center: { lat, lng },
                bounds: { minLat: lat - halfLat, maxLat: lat + halfLat, minLng: lng - halfLng, maxLng: lng + halfLng },
                baseBounds,
                metrics: {
                    demandCount: 0,
                    idleSupply: 0,
                    activeSupply: 0,
                    etaBaseline: 5,
                    etaCurrent: 5,
                    cancellations: 0,
                    completedTrips: 0,
                    surgeSuggestion: 1.0
                },
                derived: calculateDerivedMetrics({ demandCount: 0, idleSupply: 1, activeSupply: 0, etaBaseline: 5, etaCurrent: 5, cancellations: 0, completedTrips: 1, surgeSuggestion: 1.0 })
            });
        }
    }
};
initHeatmapGrid();

// Helper to check if point is inside cell
const isPointInCell = (lat, lng, cell) => {
    return lat >= cell.bounds.minLat && lat <= cell.bounds.maxLat &&
           lng >= cell.bounds.minLng && lng <= cell.bounds.maxLng;
};

// Real-time Aggregation Logic
setInterval(() => {
    const liveHeatmap = heatmapCells.map(cell => {
        // Find real drivers in this cell
        const onlineDrivers = drivers.filter(d => d.status === 'online' && isPointInCell(d.latitude, d.longitude, cell));
        const busyDrivers = drivers.filter(d => d.status === 'busy' && isPointInCell(d.latitude, d.longitude, cell));
        
        // Find real trips (demand) in this cell
        const ongoingTrips = activeTrips.filter(t => {
            const origin = typeof t.origin === 'string' ? JSON.parse(t.origin) : t.origin;
            return isPointInCell(origin.lat, origin.lng, cell);
        });

        const metrics = {
            ...cell.metrics,
            demandCount: ongoingTrips.length,
            idleSupply: onlineDrivers.length,
            activeSupply: busyDrivers.length,
            etaCurrent: ongoingTrips.length > onlineDrivers.length ? 8 : 4
        };

        return {
            ...cell,
            metrics,
            derived: calculateDerivedMetrics(metrics)
        };
    });

    io.emit('heatmapUpdate', liveHeatmap);
}, 3000);

// Global Explorer Engine
const INITIAL_ZONES = [
  { id: 'z1', name: 'Harare Central', level: 'Zimbabwe', rides: 1420, food: 340, shopping: 125, mart: 88, c2c: 12, lat: -17.8248, lng: 31.0530 },
  { id: 'z2', name: 'Bulawayo CBD', level: 'Zimbabwe', rides: 850, food: 210, shopping: 85, mart: 40, c2c: 8, lat: -20.1436, lng: 28.5816 },
  { id: 'z3', name: 'Victoria Falls', level: 'Zimbabwe', rides: 320, food: 85, shopping: 20, mart: 10, c2c: 4, lat: -17.9243, lng: 25.8559 },
  { id: 'z4', name: 'Sandton, Johannesburg', level: 'Africa', rides: 4200, food: 1100, shopping: 450, mart: 320, c2c: 45, lat: -26.1076, lng: 28.0567 },
  { id: 'z5', name: 'Lagos Island', level: 'Africa', rides: 5100, food: 950, shopping: 300, mart: 210, c2c: 30, lat: 6.4541, lng: 3.4005 },
  { id: 'z6', name: 'Nairobi Westlands', level: 'Africa', rides: 3800, food: 820, shopping: 280, mart: 190, c2c: 18, lat: -1.2662, lng: 36.8041 },
  { id: 'z7', name: 'Manhattan, NY', level: 'World', rides: 12500, food: 3200, shopping: 1100, mart: 850, c2c: 120, lat: 40.7831, lng: -73.9712 },
  { id: 'z8', name: 'Central London', level: 'World', rides: 9800, food: 2800, shopping: 950, mart: 620, c2c: 85, lat: 51.5072, lng: -0.1276 },
  { id: 'z9', name: 'Singapore Central', level: 'World', rides: 8500, food: 2400, shopping: 1050, mart: 980, c2c: 15, lat: 1.2801, lng: 103.8509 },
];
let liveGlobalZones = JSON.parse(JSON.stringify(INITIAL_ZONES));

setInterval(() => {
    liveGlobalZones = liveGlobalZones.map(z => ({
        ...z,
        rides: Math.max(0, z.rides + Math.floor(Math.random() * 21) - 10),
        food: Math.max(0, z.food + Math.floor(Math.random() * 11) - 5),
        shopping: Math.max(0, z.shopping + Math.floor(Math.random() * 7) - 3),
        mart: Math.max(0, z.mart + Math.floor(Math.random() * 5) - 2),
    }));
    io.emit('globalZonesUpdate', liveGlobalZones);
}, 3000);

// Market History Engine (for Live Analytics)
let marketHistory = [];
const MAX_HISTORY_POINTS = 30;

const tickMarketHistory = () => {
    const totalDemand = heatmapCells.reduce((acc, c) => acc + c.metrics.demandCount, 0);
    const totalIdle = heatmapCells.reduce((acc, c) => acc + c.metrics.idleSupply, 0);
    const totalActiveSurgeZones = heatmapCells.filter(c => c.metrics.surgeSuggestion > 1.2).length;
    const avgEta = heatmapCells.length > 0 ? (heatmapCells.reduce((acc, c) => acc + c.metrics.etaCurrent, 0) / heatmapCells.length) : 5;

    const snapshot = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        demand: totalDemand,
        supply: totalIdle,
        eta: Math.round(avgEta),
        surgeZones: totalActiveSurgeZones
    };

    marketHistory.push(snapshot);
    if (marketHistory.length > MAX_HISTORY_POINTS) {
        marketHistory.shift();
    }
    io.emit('marketTrendsUpdate', marketHistory);
};

// Tick history every 5 seconds for a responsive "live" feel in charts
setInterval(tickMarketHistory, 5000);
tickMarketHistory(); // Initial tick

// ==========================
// Simulation loop (Drivers)
// ==========================
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
    socket.emit('heatmapUpdate', heatmapCells);
    socket.emit('globalZonesUpdate', liveGlobalZones);

    socket.on('subscribeToZone', (coords) => {
        console.log(`[HeatMap] Client requested Grid generation at ${coords.lat}, ${coords.lng}`);
        initHeatmapGrid(coords.lat, coords.lng);
        // Instantly force broadcast newly generated cells to all clients
        io.emit('heatmapUpdate', heatmapCells);
    });

    // Delegate all negotiation and chat logic to the unified controller
    handleNegotiation(socket, io);

    // ==========================
    // DashFood Room Management
    // ==========================
    socket.on('join_store', (storeId) => {
        socket.join(`store_${storeId}`);
        console.log(`[DashFood] Client joined store room: store_${storeId}`);
    });

    // Admin Control: Manual Fleet Sync
    socket.on('syncFleet', async () => {
        console.log('[CONTROL] Manual Fleet Sync requested');
        await syncStateFromSupabase();
    });

    // Admin Control: Recalibrate Analytics
    socket.on('recalibrateAnalytics', () => {
        console.log('[CONTROL] Analytics Recalibration requested');
        initHeatmapGrid();
        io.emit('heatmapUpdate', heatmapCells);
    });

    // Admin Control: Toggle Demand Simulation
    socket.on('toggleDemandSimulation', (enabled) => {
        console.log(`[CONTROL] Demand Simulation ${enabled ? 'ON' : 'OFF'}`);
        // This could toggle a mock demand generator if needed
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// ==========================
// Module C: DashFood API
// ==========================

// Dashboard Status Sync Endpoint - AUTHORITATIVE
app.patch('/api/orders/:id/status', validateApiKey, async (req, res) => {
    const { id } = req.params;
    const { status, reason, userId } = req.body;


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
const { handleNewOrder } = require('./src/controllers/webhookController');
app.post("/webhooks/new-order", validateApiKey, handleNewOrder);

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
