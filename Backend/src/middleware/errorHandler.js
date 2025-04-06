const fs = require('fs');
const path = require('path');

function errorHandler(err, req, res, next) {
  const logFilePath = path.join(__dirname, '../../logs/error.log');
  const logMessage = `${new Date().toISOString()} - ${err.stack}\n Original request: ${req}`;

  // Log the error to the console
  console.error(err.stack);

  // Append the error to the log file
  fs.appendFile(logFilePath, logMessage, (fsErr) => {
    if (fsErr) {
      console.error('Failed to write to log file:', fsErr);
    }
  });

  res.status(500).send('Internal Server Error');
}

module.exports = errorHandler;