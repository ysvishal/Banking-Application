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

module.exports = {
    createAccountController,
    getAllAccountsController
}


