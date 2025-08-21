const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const dbconfig = require('./config/dbConfig');
const server = require('./app');

// Use Render's PORT if available, otherwise fall back to PORT_NUMBER or 3000
const port = process.env.PORT || process.env.PORT_NUMBER || 3000;

server.listen(port, () => {
    console.log('Listening to requests on PORT: ' + port);
});
