const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('✅ Using existing MongoDB connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log(`✅ MongoDB Connected: ${db.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Do not exit process in serverless environment
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
};

module.exports = connectDB;

