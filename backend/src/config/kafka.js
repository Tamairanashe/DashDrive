const { Kafka } = require('kafkajs');

const isMock = process.env.KAFKA_MOCK === 'true' || !process.env.KAFKA_BROKERS;

let kafka;
let producer;

if (isMock) {
    console.log('ℹ️ Kafka Mock Mode Enabled (Local Development)');
    producer = {
        connect: async () => console.log('✅ Mock Kafka Producer "Connected"'),
        disconnect: async () => console.log('✅ Mock Kafka Producer "Disconnected"'),
        send: async ({ topic, messages }) => {
            console.log(`[Mock Kafka] Sending to ${topic}:`, messages.length, 'messages');
            return [{ topicName: topic, partition: 0, errorCode: 0, offset: '0' }];
        }
    };
} else {
    kafka = new Kafka({
        clientId: process.env.KAFKA_CLIENT_ID || 'dashdrive-backend',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });
    producer = kafka.producer();

    const connectProducer = async () => {
        try {
            await producer.connect();
            console.log('✅ Kafka Producer Connected');
        } catch (error) {
            console.error('❌ Kafka Producer Connection Error:', error.message);
        }
    };

    connectProducer();
}

module.exports = { kafka, producer };
