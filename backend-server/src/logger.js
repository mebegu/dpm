// src/logger.js

const winston = require('winston');

// Define custom formats
const customFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
  // Prettify the log message
  const formattedMeta = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 2)}` : '';
  return `${timestamp} [${level.toUpperCase()}]: ${message}${formattedMeta}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(), // Add color to log levels
    customFormat // Use the custom format for prettified output
  ),
  transports: [
    new winston.transports.Console(), // Console transport for prettified output
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: './logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],
});

module.exports = { logger };
