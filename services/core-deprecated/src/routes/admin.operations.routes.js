// routes/admin.operations.routes.js
const express = require("express");
const router = express.Router();
const adminOperationsService = require("../services/admin/adminOperations");

// Apply Surge
router.post("/surge/apply", async (req, res) => {
  try {
    const result = await adminOperationsService.applySurge(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to apply surge",
    });
  }
});

// Notify Fleet
router.post("/notifications/fleet", async (req, res) => {
  try {
    const result = await adminOperationsService.notifyFleet(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to notify fleet",
    });
  }
});

module.exports = router;
