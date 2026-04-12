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
 */
router.get("/", authMiddleware.authMiddleware, accountController.getAllAccountsController)

module.exports = router;
