const { producer } = require('./src/config/kafka');
require('dotenv').config();

async function testProducer() {
    console.log('🚀 Starting Kafka Producer Test...');

    try {
        // Wait for connection (since it's initiated in the config)
        setTimeout(async () => {
            console.log('📡 Sending test message to "trip-events"...');

            await producer.send({
                topic: 'trip-events',
                messages: [
                    {
                        key: 'TEST-123',
                        value: JSON.stringify({
                            event: 'TEST_PROPOSAL',
                            data: 'Hello Kafka from DashDrive!',
                            timestamp: new Date().toISOString()
                        })
                    }
                ],
            });

            console.log('✅ Test message sent successfully!');
            process.exit(0);
        }, 2000);

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        process.exit(1);
    }
}

testProducer();
