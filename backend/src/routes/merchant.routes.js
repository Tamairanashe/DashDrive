const express = require('express');
const router = express.Router();
const storeController = require('../controllers/merchant/store.controller');
const menuController = require('../controllers/merchant/menu.controller');
const orderController = require('../controllers/merchant/order.controller');
const { authenticate } = require('../middleware/authMiddleware');
// In a real app, this would be in a shared auth module
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey === process.env.BACKEND_API_KEY) {
        return next();
    }
    authenticate(req, res, next);
};

/**
 * Merchant Store Management
 */
router.post('/store/setup', validateApiKey, storeController.setupOrganization); // Org Setup
router.post('/store/onboard', validateApiKey, storeController.onboardStore); // Onboarding Wizard Submit
router.post('/store/add', validateApiKey, storeController.addStore); // Add Physical Store
router.get('/store/org/:organization_id', validateApiKey, storeController.getOrgStores); // List Stores
router.patch('/store/:store_id/settings', validateApiKey, storeController.updateStoreSettings); // Toggle Status/SLA

/**
 * Menu CMS
 */
router.post('/menu/category', validateApiKey, menuController.addCategory);
router.post('/menu/item', validateApiKey, menuController.addItem);
router.get('/menu/store/:store_id', validateApiKey, menuController.getStoreMenu);
router.patch('/menu/item/:item_id', validateApiKey, menuController.updateItem);

/**
 * Merchant Order Operations
 */
router.get('/orders/:store_id/active', validateApiKey, orderController.getActiveOrders);
router.patch('/orders/:order_id/status', validateApiKey, orderController.updateMerchantStatus);

module.exports = router;
