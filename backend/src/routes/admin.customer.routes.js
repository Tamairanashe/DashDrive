const express = require("express");
const router = express.Router();
const customerController = require("../controllers/admin/customer.controller");

router.get("/list", customerController.listCustomers);
router.get("/feedback", customerController.listFeedback);
router.patch("/feedback/:id", customerController.updateFeedbackStatus);
router.get("/insights", customerController.getInsights);

// Groups
router.get("/groups", customerController.listGroups);
router.post("/groups", customerController.createGroup);

// Engagements
router.get("/engagements", customerController.listEngagements);
router.post("/send-offer", customerController.createEngagement);

module.exports = router;
