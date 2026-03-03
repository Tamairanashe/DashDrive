const { authenticate, requirePilot } = require("../middleware/authMiddleware");

const authController = require("../controllers/mobile/auth.controller");
const riderController = require("../controllers/mobile/rider.controller");
const pilotController = require("../controllers/mobile/pilot.controller");

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

/**
 * Pilot (Driver) Endpoints
 */
router.post("/pilot/telemetry", authenticate, requirePilot, pilotController.updateLocation);
router.patch("/pilot/status", authenticate, requirePilot, pilotController.toggleStatus);
router.get("/pilot/missions", authenticate, requirePilot, pilotController.getAvailableTrips);
router.post("/pilot/missions/:trip_id/accept", authenticate, requirePilot, pilotController.acceptTrip);

module.exports = router;
