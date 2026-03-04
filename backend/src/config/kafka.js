const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'dashdrive-backend',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

const producer = kafka.producer();

const connectProducer = async () => {
    try {
        await producer.connect();
        console.log('✅ Kafka Producer Connected');
    } catch (error) {
        console.error('❌ Kafka Producer Connection Error:', error);
    }
};

// Start the connection in a non-blocking way
if (process.env.KAFKA_BROKERS) {
    connectProducer();
} else {
    console.log('ℹ️ Kafka Brokers not configured, skipping connection.');
}

module.exports = { kafka, producer };
