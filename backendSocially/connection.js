const mongoose = require('mongoose')
// const {} = require('mo')

async function connectMongoDb(url) {
    return mongoose.connect(url)
}

module.exports = connectMongoDb