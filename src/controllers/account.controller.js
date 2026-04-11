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

module.exports = {
    createAccountController
}


