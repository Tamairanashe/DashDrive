const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/admin/payment.controller");

router.get("/payouts", paymentController.listPayouts);
router.get("/summary", paymentController.getSummary);
router.get("/invoices", paymentController.listInvoices);

// Bank Accounts
router.get("/bank-accounts", paymentController.listBankAccounts);
router.post("/bank-accounts", paymentController.addBankAccount);

// Tax Identity
router.get("/tax-identity", paymentController.getTaxIdentity);
router.post("/tax-identity", paymentController.updateTaxIdentity);

module.exports = router;
