const express = require("express");
const router = express.Router();
const {
  AdminRegistion,
  AdminLogin,
  getAllAdmin,
  delAdminbyId,
  getAdminById 
} = require("../controllers/adminRegController"); // Adjust the path as necessary

router.post("/register", AdminRegistion);
router.post("/login", AdminLogin); // Changed from adminRouter.login
router.get("/getAllAdmin", getAllAdmin); // Changed from adminRouter.login
router.delete("/delAdminbyId/:id", delAdminbyId);
router.get('/admin/:id',  getAdminById);//

module.exports = router;
