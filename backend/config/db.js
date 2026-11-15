const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopnova';
    
    // Set connection options with quick timeout to fallback if local mongod is not running
    const options = {
      serverSelectionTimeoutMS: 2500,
      autoIndex: true
    };

    try {
      const conn = await mongoose.connect(mongoURI, options);
      console.log(`[ShopNova DB] Connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[ShopNova DB] Standard MongoDB connection failed (${err.message}). Starting in-memory Mongo server for zero-config development...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[ShopNova DB] Connected to In-Memory MongoDB: ${inMemoryUri}`);
      return conn;
    }
  } catch (error) {
    console.error(`[ShopNova DB Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
