const { io } = require('socket.io-client');

const socket = io('http://localhost:3001');

const RUSH_HOUR_BIDS = 100;
const DELAY_BETWEEN_BIDS = 50; // ms

console.log('🚀 Initializing Rush Hour Simulation...');
console.log(`📡 Targeting http://localhost:3001 with ${RUSH_HOUR_BIDS} rapid bids.`);

socket.on('connect', () => {
    console.log('✅ Connected to simulation server.');
    startSimulation();
});

async function startSimulation() {
    for (let i = 0; i < RUSH_HOUR_BIDS; i++) {
        const fare = 10 + Math.random() * 50;
        const riderId = `STRESS-USER-${Math.floor(Math.random() * 1000)}`;

        console.log(`[BID ${i + 1}] Proposing $${fare.toFixed(2)} for ${riderId}`);

        socket.emit('proposeFare', {
            riderId: riderId,
            amount: fare
        });

        // Small delay to simulate rapid-fire but not immediate flood
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BIDS));
    }

    console.log('🏁 Rush Hour Stress Test Completed.');
    setTimeout(() => {
        process.exit(0);
    }, 2000);
}

socket.on('newTripRequest', (trip) => {
    console.log(` ✨ Server acknowledged trip: ${trip.id}`);
});

socket.on('connect_error', (err) => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
});
