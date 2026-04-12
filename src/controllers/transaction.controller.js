const mongoose = require("mongoose");
const transactionModel = require("../model/transaction.model");
const ledgerModel = require("../model/ledger.model");
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
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  /* 1. Validate Request */
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "From account, To account, amount, and Idempotency key required",
    });
  }

  const fromUserAccount = await accountModel({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid from or to account.",
    });
  }

  /* 2. Validate Idempotency Key */
  const idemKeyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });
  if (idemKeyExists) {
    if (idemKeyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed",
        idemKeyExists,
      });
    }

    if (idemKeyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is in process",
      });
    } else {
      return res.status(500).json({
        message:
          "Transaction is failed or reversed, please make a new transaction",
      });
    }
  }

  //   3. Account Status
  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message: "From and to account must be ACTIVE",
    });
  }

  //  4. Get from account balance
  const balance = fromUserAccount.getBalance();

  if (balance < amount) {
    res.status(400).json({
      message: `Insufficient balance in from Account. Current balance is ${balance}`,
    });
  }

  //   5. Create transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount: toUserAccount._id,
    amount: amount,
    idempotencyKey: idempotencyKey,
    status: "PENDING",
  });

//    * 6. Create DEBIT ledger entry
const debitLedger = await ledgerModel.create(
    [
        {
            account: fromUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT",
        },
    ],
    { session },
);

//    * 7. Create CREDIT ledger entry
  const creditLedger = await ledgerModel.create(
    [
      {
        account: toUserAccount._id,
        amount: amount,
        type: "CREDIT",
        transaction: transaction._id,
      },
    ],
    { session },
  );

//   8. Mark transaction COMPLETED
  transaction.status = "COMPLETED";
  await transaction.save({ session });

//   9. Commit session
  await session.commitTransaction();
  session.endSession();

//   10. Email notification 
  await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

  return res.status(201).json({
    message: "Transaction completed successfully",
    amount: amount,
  });

}
async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "To account, amount and idempotency key is required",
    });
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid toAccount",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(400).json({
      message: "System user account not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount: toUserAccount._id,
    amount: amount,
    idempotencyKey: idempotencyKey,
    status: "PENDING",
  });

  const debitLedger = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const creditLedger = await ledgerModel.create(
    [
      {
        account: toUserAccount._id,
        amount: amount,
        type: "CREDIT",
        transaction: transaction._id,
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message: "Initial funds transaction is completed",
    amount: amount,
  });
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
