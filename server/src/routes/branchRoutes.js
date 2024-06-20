const express = require("express");
const router = express.Router();

const { branchRegistration, getAllBranch, getbranchById, updateBranch, deleteBranch } = require("../controllers/branchController")

 router.post("/register",branchRegistration)
 router.get("/getAllBranch",getAllBranch)
 router.get("/getAllBranchById/:id",getbranchById)
 router.put("/updateBranchById/:id",updateBranch)
 router.delete("/deleteBranchById/:id",deleteBranch)

 module.exports = router;