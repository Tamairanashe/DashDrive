const express = require("express");
const router = express.Router();
const { requireSuperAdmin } = require("../middleware/rbac.middleware");
const superappController = require("../controllers/platform/superapp.controller");
const fintechController = require("../controllers/platform/fintech.controller");
const fleetController = require("../controllers/platform/fleet.controller");
const userController = require("../controllers/platform/user.controller");

// Platform Admin Health
router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "DashDrive Platform SuperAdmin API is live 👑",
    });
});

/**
 * SuperApp Intelligence (Dashboard)
 */
router.get("/superapp/stats", requireSuperAdmin, superappController.getPlatformStats);
router.get("/superapp/services", requireSuperAdmin, superappController.getServiceOverview);
router.get("/superapp/fleet", requireSuperAdmin, superappController.getFleetStatus);

/**
 * Fintech & Financial Services
 */
router.get("/fintech/summary", requireSuperAdmin, fintechController.getSummary);
router.get("/fintech/transactions", requireSuperAdmin, fintechController.listTransactions);
router.get("/fintech/withdraw-requests", requireSuperAdmin, fintechController.listWithdrawRequests);

/**
 * Fleet & Logistics
 */
router.get("/fleet/status", requireSuperAdmin, fleetController.getOverview);
router.get("/fleet/live", requireSuperAdmin, fleetController.getLiveFleet);
router.get("/fleet/vehicles", requireSuperAdmin, fleetController.getVehicleLogic);

/**
 * Global User & Support
 */
router.get("/users/stats", requireSuperAdmin, userController.getUserStats);
router.get("/support/tickets", requireSuperAdmin, userController.getSupportTickets);

module.exports = router;
