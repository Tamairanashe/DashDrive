const io = require('socket.io-client');

const SOCKET_URL = 'http://localhost:8000';

const simulateChat = async () => {
    console.log('--- Starting Real-time Chat Test ---');

    const socketRider = io(SOCKET_URL);
    const socketPilot = io(SOCKET_URL);

    const testTripId = 'cfd01e92-8b1d-4afd-8d27-0a18aa8564ed'; // Existing UUID from .env/index.js (Organization ID, but let's try)
    const riderId = 'cfd01e92-8b1d-4afd-8d27-0a18aa8564ed';
    const pilotId = 'cfd01e92-8b1d-4afd-8d27-0a18aa8564ed';

    socketRider.on('connect', () => {
        console.log('✅ Rider connected to socket');
    });

    socketPilot.on('connect', () => {
        console.log('✅ Pilot connected to socket');
    });

    // Pilot listens for messages
    socketPilot.on('newMessage', (msg) => {
        console.log(`📩 Pilot received: [${msg.sender_id}] ${msg.content}`);
        if (msg.content === "Hello Pilot! I'm waiting at the gate.") {
            console.log('✅ Real-time delivery verified!');

            // Pilot replies
            console.log('📤 Pilot replying...');
            socketPilot.emit('sendMessage', {
                tripId: testTripId,
                senderId: pilotId,
                content: "Copy that! I'm 2 minutes away."
            });
        }
    });

    // Rider listens for replies
    socketRider.on('newMessage', (msg) => {
        if (msg.sender_id === pilotId) {
            console.log(`📩 Rider received reply: ${msg.content}`);
            console.log('✅ Full Chat Loop Verified!');
            process.exit(0);
        }
    });

    // Simulate sending message
    setTimeout(() => {
        console.log('📤 Rider sending message...');
        socketRider.emit('sendMessage', {
            tripId: testTripId,
            senderId: riderId,
            content: "Hello Pilot! I'm waiting at the gate."
        });
    }, 2000);

    // Timeout safety
    setTimeout(() => {
        console.log('❌ Test timed out');
        process.exit(1);
    }, 10000);
};

simulateChat();
