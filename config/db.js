const mongoose = require('mongoose');
let dbURI = process.env.DB_localURI;

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
