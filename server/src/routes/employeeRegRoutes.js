const express = require("express");
const router = express.Router();
const {
  registerEmployee,
  loginUser,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  getTotalMemberAccordingToGroup,
  getEmployeeById,
} = require("../controllers/employeeRegController");

// Register
router.post("/register", registerEmployee);

// Login
router.post("/login", loginUser);

// Get all employees
router.get("/", getAllEmployees);

// Update employee details
router.put("/:employeeId", updateEmployee);

// Delete employee
router.delete("/:employeeId", deleteEmployee);
router.get("/getTotalMember", getTotalMemberAccordingToGroup);
router.get("/a/:id", getEmployeeById);

module.exports = router;
