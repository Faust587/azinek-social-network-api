const mongoose = require('mongoose');

function connect() {
  if (process.env.NODE_ENV === 'test') return;
  mongoose.connect(process.env.DATABASE_CONNECTION_URI, {
    keepAlive: true,
    keepAliveInitialDelay: 300000,
  }, null);
}

module.exports = {
  connect,
  mongoose,
};
