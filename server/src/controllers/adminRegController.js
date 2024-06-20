const Admin = require("../model/adminRegModel");
const mongoose = require("mongoose");

const AdminRegistion = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new Admin({ email, password });
    const adminresp = await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: adminresp,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const AdminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Admin logged in successfully" ,data:admin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const delAdminbyId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Admin id is required" });
    }
    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: "Admin deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is provided
    if (!id) {
      return res.status(400).json({ message: "Admin id is required" });
    }

    // Validate if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Admin id" });
    }

    // Query for admin by id
    const admin = await Admin.findById(id);

    // Check if admin is found
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Send admin data in response
    res.status(200).json(admin);
  } catch (error) {
    // Handle any errors
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { AdminRegistion, AdminLogin, getAllAdmin, delAdminbyId,getAdminById };
