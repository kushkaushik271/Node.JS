const mongoose = require('mongoose');
const config = require('../config/default')

const { DB_URI }  = config

const dbConnection = async () => {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.log('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

module.exports = dbConnection;