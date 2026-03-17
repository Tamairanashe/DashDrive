const { Resend } = require('resend');

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

if (!resend) {
  console.warn('[Resend] RESEND_API_KEY is missing. Email features will be disabled.');
}

module.exports = resend;
