const mongoose = require('mongoose')
const transactionModel = require("../model/transaction.model")
const ledgerModel = require("../model/ledger.model")
const emailService = require("../services/email.service");
const accountModel = require("../model/account.model");
/**
 * Create a new transaction
 * The 10 step verification flow:
 * 1. Validate Request
 * 2. Validate idempotency key
 * 3. Check account status (Frozen or Active)
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */

async function createTransaction(req, res) {
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body;
}
async function createInitialFundsTransaction(req, res) {
    const {toAccount, amount, idempotencyKey} = req.body;
    
    if(!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "To account, amount and idempotency key is required"
        })
    }

    const toUserAccount = await accountModel.findById(toAccount)
    console.log(toUserAccount);
    
    const systemUser = req.user;
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount: systemUser._id,
        toAccount: toUserAccount._id,
        amount: amount,
        idempotencyKey: idempotencyKey
    }, {session})

    const debitLedger = await ledgerModel.create([{
        account: systemUser._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
    }], { session })
    
    const creditLedger = await ledgerModel.create([{
        account: toUserAccount._id,
        amount: amount,
        type: "CREDIT",
        transaction: transaction._id
    }], {session})

    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: "Initial funds transaction is completed",
        amount: amount
    })
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}