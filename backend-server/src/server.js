// src/server.js

const { logger } = require("./logger");
const { app } = require("./app");
const { initializeDatabase } = require('./audioProcessor/model');

const PORT = process.env.PORT || 8080;

// Start server
const server = app.listen(PORT, async () => {
  await initializeDatabase(); // Ensure the database is initialized
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = server;
