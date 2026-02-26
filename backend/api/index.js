const app = require('../server');
const connectDB = require('../config/db');

module.exports = async (req, res) => {
    // Ensure database is connected before handling the request
    await connectDB();

    // Pass the request to the Express app
    return app(req, res);
};
