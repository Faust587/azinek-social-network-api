const mongoose = require('mongoose');

const connectToMongoose = () => {
  mongoose.connect(process.env.DATABASE_TESTING_URI, {
    keepAlive: true,
    keepAliveInitialDelay: 300000,
  }, null);
};

const clearCollection = async (collectionName) => {
  await mongoose.connection.dropCollection(collectionName);
};

const disconnectFromMongoose = async () => {
  await mongoose.disconnect();
};

const dropTestingDatabase = async () => {
  await mongoose.connection.dropDatabase();
};

module.exports = {
  connectToMongoose,
  disconnectFromMongoose,
  dropTestingDatabase,
  clearCollection,
};
