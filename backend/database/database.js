const mongoose = require('mongoose')
const mongoUri = process.env.MONGO_DB_URI

// Connect to MongoDB
const connectDatabase = () => {
    mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = connectDatabase;