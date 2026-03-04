const express = require("express");
const router = express.Router();
const { authenticate, requirePilot } = require("../middleware/authMiddleware");

const authController = require("../controllers/mobile/auth.controller");
const riderController = require("../controllers/mobile/rider.controller");
const pilotController = require("../controllers/mobile/pilot.controller");
const paymentController = require("../controllers/mobile/payment.controller");
const prepaidController = require("../controllers/mobile/prepaid.controller");
const chatController = require("../controllers/mobile/chat.controller");
const ratingController = require("../controllers/mobile/rating.controller");
const issueController = require("../controllers/mobile/issue.controller");

/**
 * Mobile Authentication & Profile
 */
router.post("/auth/login", authController.login);
router.get("/profile", authenticate, authController.getProfile);

/**
 * Rider (Customer) Endpoints
 */
router.get("/rider/search", authenticate, riderController.searchMarketplace);
router.get("/rider/stores/:id", authenticate, riderController.getStoreDetails);
router.post("/rider/orders", authenticate, riderController.createOrder);
router.get("/rider/orders/active", authenticate, riderController.getActiveOrders);

// Wallet & Payments
router.get("/rider/wallet", authenticate, paymentController.getWalletInfo);

// Ride Navigation & Parcel Delivery (InDrive Style)
router.post("/rider/rides/request", authenticate, riderController.requestRide);
router.post("/rider/parcel/request", authenticate, riderController.requestParcel);

/**
 * Pilot (Driver) Endpoints
 */
router.post("/pilot/telemetry", authenticate, requirePilot, pilotController.updateLocation);
router.patch("/pilot/status", authenticate, requirePilot, pilotController.toggleStatus);
router.get("/pilot/missions", authenticate, requirePilot, pilotController.getAvailableTrips);
router.post("/pilot/missions/:trip_id/accept", authenticate, requirePilot, pilotController.acceptTrip);
router.patch("/pilot/missions/:trip_id/status", authenticate, requirePilot, pilotController.updateTripStatus);

// Prepaid Rides & Packages
router.get("/pilot/prepaid/packages", authenticate, prepaidController.getAvailablePackages);
router.post("/pilot/prepaid/purchase", authenticate, prepaidController.purchasePackage);

// Real-time Chat & Coordination
router.get("/chat/:trip_id/history", authenticate, chatController.getHistory);
router.post("/chat/read", authenticate, chatController.markMessagesRead);

// Wallet & Payouts
router.get("/pilot/wallet", authenticate, paymentController.getWalletInfo);
router.post("/pilot/payout", authenticate, paymentController.requestPayout);

// Ride Discovery & Bidding (InDrive Style)
router.get("/pilot/rides/available", authenticate, requirePilot, pilotController.getAvailableRides);
router.post("/pilot/rides/:trip_id/bid", authenticate, requirePilot, pilotController.submitRideBid);

// Trust & Support Architecture
router.post("/trust/rating/trip", authenticate, ratingController.submitTripRating);
router.get("/trust/rating/pilot/:driver_id", authenticate, ratingController.getPilotRating);
router.post("/support/issue/report", authenticate, issueController.reportNewIssue);
router.get("/support/order/:order_id/issues", authenticate, issueController.fetchOrderIssues);

module.exports = router;
