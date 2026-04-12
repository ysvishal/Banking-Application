const mongoose = require('mongoose')

const tokenBlacklistSchema = mongoose.Schema({
    token: {
        type: String,
        unique: true,
        require: true
    }
}, {
    timestamps: true
})

tokenBlacklistSchema.index({createdAt: 1}, {
    expireAfterSeconds: 60 * 60 * 24 * 3
})

const tokenBlackListModel = mongoose.model('tokenBlackList', tokenBlacklistSchema)

module.exports = tokenBlackListModel