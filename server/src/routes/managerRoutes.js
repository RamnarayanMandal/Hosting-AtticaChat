const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const {
  registerManager,
  loginManager,
  logoutManager,
  getAllManagers,
  getManagerById,
  deleteManagerById,
  updateManagerById,
  currentManager,
} = require("../controllers/managerController");

router.post("/register", registerManager);
router.post("/login", loginManager);
router.post("/logout", authenticateToken, logoutManager);
router.get("/getAllManagers", getAllManagers);
router.get("/getManagerById/:id", getManagerById);
router.delete("/deleteManagerById/:id", deleteManagerById);
router.put("/updateManagerById/:id", updateManagerById);
router.get("/currentManager", authenticateToken, currentManager);

module.exports = router;
