const express = require("express");
const router = express.Router();
const {
  billingTeamRegistration, billingTeamLogin,logoutBillingTeam, getUserById, updateUserById,delUserbyId,getAllUsers
} = require("../controllers/BillingTeamUserController");

router
  .post("/register", billingTeamRegistration)
  .post("/login", billingTeamLogin)
  .post("/logout", logoutBillingTeam)
  .get("/getUserById/:id", getUserById)
  .put("/updateUserById/:id", updateUserById)
  .delete("/delUserbyId/:id", delUserbyId)
  .get("/getAllUsers", getAllUsers);


module.exports = router;
