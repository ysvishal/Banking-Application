const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must have the details of from account"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must have the details of from account"],
        index: true
    },
    amount: {
        type: Number,
        min: [0, "Amount cannot be negative"],
        required: [true, "Amount has to specified"],
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"]
        },
        default: 'PENDING'
    },
    idempotencyKey: { //idempotency Key, is generated at client side and not at the backend. It makes sure that same transaction is never repeated
        type: String,
        required: [true, "Idempotency key is required for transaction"],
        unique: true,
        index: true
    }
}, {
    timestamps: true
}) 

const transactionModel = mongoose.model('transaction', transactionSchema)

module.exports = transactionModel