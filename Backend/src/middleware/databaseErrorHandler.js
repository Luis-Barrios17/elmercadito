const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../logs/database.log');

const databaseErrorHandler = (error, req, res, next) => {
  const logMessage = `${new Date().toISOString()} - ${error.stack}\n`;
  console.error(error.stack);
  fs.appendFile(logFilePath, logMessage, (fsErr) => {
    if (fsErr) {
      console.error('Failed to write to log file:', fsErr);
    }
  });

  res.status(500).send('Internal Server Error');
  next();
};

module.exports = databaseErrorHandler;
