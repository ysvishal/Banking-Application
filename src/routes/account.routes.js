const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");
const router = express.Router();

/**
 * - POST /api/accounts/
 * - Create new account
 */
router.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccountController,
);

/**
 * GET /api/accounts
 * Get all the accounts of the logged-in user
 */
router.get("/", authMiddleware.authMiddleware, accountController.getAllAccountsController)

/**
 * GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getBalanceController)

module.exports = router;
