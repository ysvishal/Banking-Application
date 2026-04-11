const mongoose = require('mongoose')

async function connectToDB(params) {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to DB");
    })
    .catch(() => {
        console.log("Error connecting to DB");
    })
}

module.exports = connectToDB;