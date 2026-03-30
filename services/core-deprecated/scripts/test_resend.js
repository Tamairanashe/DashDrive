require('dotenv').config();
const emailService = require('../src/services/emailService');

async function testResend() {
    console.log('--- Testing Resend Email Integration ---');
    
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key') {
        console.error('❌ Error: RESEND_API_KEY is not configured in .env');
        process.exit(1);
    }

    const testEmail = 'jchitewe@gmail.com'; // Verified testing recipient
    const result = await emailService.sendEmail({
        to: testEmail,
        subject: 'DashDrive Integration Test',
        html: '<p>This is a test email from your <strong>DashDrive Backend</strong> using Resend!</p>'
    });

    if (result.success) {
        console.log('✅ Integration Test Passed!');
    } else {
        console.error('❌ Integration Test Failed.');
    }
}

testResend().catch(console.error);
