const express = require("express");
const router = express.Router();
const {
  superAdminRegistration,
  superAdminLogin,
} = require("../controllers/superAdminController");

// Registration route
router.post("/register", superAdminRegistration);

// Login route
router.post("/login", superAdminLogin);

module.exports = router;
