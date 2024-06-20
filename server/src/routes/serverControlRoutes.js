const express = require("express");
const router = express.Router();

// Route to crash the server
router.get("/crash", (req, res) => {
  console.log("Crashing the server...");
  process.exit(1); // This will cause the Node.js process to exit
});

// Route to restart the server (requires PM2 or similar)
router.get("/restart", (req, res) => {
  console.log("Restarting the server...");
  // PM2 will automatically restart the process if configured correctly
  process.exit(0); // Exit with a success code which will trigger PM2 to restart
});

module.exports = router;
