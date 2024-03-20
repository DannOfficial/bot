const path = require("path");
const fs = require("fs");
const moment = require("moment");

function handleUnhandledRejection(reason, promise) {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);

  const now = moment().format("YYYY-MM-DD_HH-mm-ss");
  const logFileName = `unhandled_rejection_log_${now}.txt`;
  const logFilePath = path.join(__dirname, logFileName);

  const logContent = `
    ===== Unhandled Rejection Log - ${now} =====
    Reason: ${reason}
    Promise: ${promise}
    ===============================
  `;

  fs.writeFile(logFilePath, logContent, (err) => {
    if (err) console.error("Error writing log file:", err);
    console.log("Unhandled rejection log saved to:", logFileName);
  });
}

function handleUncaughtException(error) {
  console.error("Uncaught Exception:", error);

  const now = moment().format("YYYY-MM-DD_HH-mm-ss");
  const logFileName = `uncaught_exception_log_${now}.txt`;
  const logFilePath = path.join(__dirname, logFileName);

  const logContent = `
    ===== Uncaught Exception Log - ${now} =====
    Error: ${error.stack || "No error stack available"}
    ===============================
  `;

  fs.writeFile(logFilePath, logContent, (err) => {
    if (err) console.error("Error writing log file:", err);
    console.log("Uncaught exception log saved to:", logFileName);
  });
}

module.exports = {
  handleUnhandledRejection,
  handleUncaughtException,
};