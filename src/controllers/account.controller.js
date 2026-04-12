const accountModel = require('../model/account.model');

async function createAccountController(req, res) {
    const user = req.user;
    console.log(user)
    const account = await accountModel.create({
        user: user._id
    })
    return res.status(200).json({
        account
    })
}
async function getAllAccountsController(req, res) {
    const accounts = await accountModel.find({
        user: req.user._id
    })
    return res.status(200).json({
        accounts
    })
}
async function getBalanceController(req, res) {
    const {accountId} = req.params;
    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if(!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }
    console.log(account.constructor.name)
    const balance = await account.getBalance();

    return res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}

module.exports = {
    createAccountController,
    getAllAccountsController,
    getBalanceController
}


