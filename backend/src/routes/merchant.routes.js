const express = require('express');
const router = express.Router();
const storeController = require('../controllers/merchant/store.controller');
const menuController = require('../controllers/merchant/menu.controller');
const orderController = require('../controllers/merchant/order.controller');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * Merchant Store Management
 */
router.post('/store/setup', authenticate, storeController.setupOrganization); // Org Setup
router.post('/store/onboard', authenticate, storeController.onboardStore); // Onboarding Wizard Submit
router.post('/store/add', authenticate, storeController.addStore); // Add Physical Store
router.get('/store/org/:organization_id', authenticate, storeController.getOrgStores); // List Stores
router.patch('/store/:store_id/settings', authenticate, storeController.updateStoreSettings); // Toggle Status/SLA

/**
 * Menu CMS
 */
router.post('/menu/category', authenticate, menuController.addCategory);
router.post('/menu/item', authenticate, menuController.addItem);
router.get('/menu/store/:store_id', authenticate, menuController.getStoreMenu);
router.patch('/menu/item/:item_id', authenticate, menuController.updateItem);

/**
 * Merchant Order Operations
 */
router.get('/orders/:store_id/active', authenticate, orderController.getActiveOrders);
router.patch('/orders/:order_id/status', authenticate, orderController.updateMerchantStatus);

module.exports = router;
