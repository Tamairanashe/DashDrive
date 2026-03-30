const express = require("express");
const router = express.Router();
const marketingController = require("../controllers/admin/marketing.controller");

router.get("/list", marketingController.listOffers);
router.post("/create", marketingController.createOffer);
router.patch("/update/:id", marketingController.updateOffer);
router.delete("/delete/:id", marketingController.deleteOffer);

// Campaigns
router.get("/campaigns", marketingController.listCampaigns);
router.post("/campaigns", marketingController.createCampaign);

// Ads
router.get("/ads", marketingController.listAds);

module.exports = router;
