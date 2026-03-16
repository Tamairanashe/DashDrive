const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/mobile/events.controller');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * Ticketing & Events Routes
 * Prefix: /api/mobile/events
 */

// Public / Authenticated Browsing
router.get('/', eventsController.listEvents);
router.get('/:id', eventsController.getEvent);
router.get('/:id/seats', eventsController.getEventSeats);

// Transactional Booking (Requires Authentication)
router.post('/lock-seat', authenticate, eventsController.lockSeat);
router.post('/create-order', authenticate, eventsController.createOrder);

module.exports = router;
