const mongoose = require('mongoose');
let dbURI = process.env.DB_atlasURI_SRV;

if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.DB_atlasURI;
}
// added qualifiers to stop mongoose deprecation warnings
mongoose.connect(dbURI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

const controlShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

// For nodemon restarts
process.once('SIGUSR2', () => {
  controlShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For app termination
process.on('SIGINT', () => {
  controlShutdown('app termination', () => {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', () => {
  controlShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});
