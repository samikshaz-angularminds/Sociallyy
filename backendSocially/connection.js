const { MongoClient } = require('mongodb');
const mongoose = require('mongoose')

async function connectMongoDb(url) {
    const client = new MongoClient(url)

    try {
        return mongoose.connect(url)

    } catch (error) {
        console.log('MONGODB ERRRORR: ', error);

        return false
    }

}



module.exports = connectMongoDb