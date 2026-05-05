const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // If MONGO_URI is a local connection or not set, use in-memory MongoDB
    if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
      console.log('🔄 Starting in-memory MongoDB server...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('✅ In-memory MongoDB started');
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('💡 To use MongoDB Atlas, set MONGO_URI in .env');
    process.exit(1);
  }
};

module.exports = connectDB;
