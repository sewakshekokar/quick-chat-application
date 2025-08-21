const mongoose = require('mongoose');

const connString = process.env.CONN_STRING;
if (!connString) {
  console.error('Missing CONN_STRING environment variable. Exiting.');
  process.exit(1);
}

mongoose.connect(connString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
