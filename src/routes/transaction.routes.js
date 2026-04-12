const express = require('express')
const authMiddleware = require("../middleware/auth.middleware")
const transactionController = require('../controllers/transaction.controller')
const router = express.Router()

/**
 * POST /api/transactions
 * - transaction details
 */
router.post("/", authMiddleware.authMiddleware, transactionController.createTransaction)


/**
 * POST /api/transactions/system/inital-funds
 * - Create initial funds from system user
 */
router.post("/system/initial-funds", authMiddleware.authSystemMiddleware, transactionController.createInitialFundsTransaction)

module.exports = router

