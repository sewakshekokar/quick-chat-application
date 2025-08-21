const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const dbconfig = require('./config/dbConfig');
const server = require('./app');

// Use Render's injected PORT first, then .env PORT_NUMBER, then fallback 3000
const port = process.env.PORT || process.env.PORT_NUMBER || 3000;

server.listen(port, () => {
  console.log('Listening to requests on PORT: ' + port);
});
