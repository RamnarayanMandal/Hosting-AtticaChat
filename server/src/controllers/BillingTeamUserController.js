const BillingTeamUser = require("../model/BillingTeamUser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const billingTeamRegistration = async (req, res, next) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    branch_name,
    branch_state,
    branch_city,
    branch_pincode,
  } = req.body;

  // Logging input for debugging purposes
  console.log(
    name,
    email,
    password,
    branch_name,
    branch_state,
    branch_city,
    branch_pincode
  );

  // Check for missing fields
  if (
    !name ||
    !email ||
    !password ||
    !phone ||
    !address ||
    !branch_name ||
    !branch_state ||
    !branch_city ||
    !branch_pincode
  ) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  try {
    // Check if the user already exists
    const isUserAvailable = await BillingTeamUser.findOne({ email });
    if (isUserAvailable) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user instance
    const newUser = new BillingTeamUser({
      name,
      email,
      password,
      phone,
      address,
      branch_name,
      branch_state,
      branch_city,
      branch_pincode,
    });

    // Save the new user to the database
    const result = await newUser.save();
    const { password: userPassword, ...userWithoutPassword } = result._doc;

    // Respond with success message
    res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    // Respond with an error message
    res.status(500).json({ message: "An error occurred during registration" });
  }
};

const billingTeamLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Find the user by email
    const user = await BillingTeamUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Check if the password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a token
    const token = generateToken(user._id);
    const { password: userPassword, ...userWithoutPassword } = user._doc;

    // Respond with token and user details
    res.status(200).json({
      message: "Admin logged in successfully",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during login",
      error: error.message,
    });
  }
};

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await BillingTeamUser.find();
    const usersWithoutPasswords = users.map(({ _doc: { password, ...userWithoutPassword } }) => userWithoutPassword);
    res.status(200).json({ message: "Successfully fetched all users", users: usersWithoutPasswords });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching users",
      error: error.message,
    });
  }
};

const delUserbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await BillingTeamUser.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    await BillingTeamUser.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting user",
      error: error.message,
    });
  }
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    password,
    phone,
    address,
    branch_name,
    branch_state,
    branch_city,
    branch_pincode,
  } = req.body;

  try {
    const updatedUser = await BillingTeamUser.findByIdAndUpdate(
      id,
      {
        name,
        email,
        password,
        phone,
        address,
        branch_name,
        branch_state,
        branch_city,
        branch_pincode,
      },
      { new: true }
    );
    const { password: userPassword, ...userWithoutPassword } = updatedUser._doc;
    res.status(200).json({ message: "User updated successfully", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating user",
      error: error.message,
    });
  }
};

const logoutBillingTeam = async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Billing team logged out successfully" });
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await BillingTeamUser.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user._doc;
    res.status(200).json({ message: "User fetched successfully", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching user",
      error: error.message,
    });
  }
};

module.exports = {
  billingTeamRegistration,
  billingTeamLogin,
  logoutBillingTeam,
  getUserById,
  updateUserById,
  delUserbyId,
  getAllUsers,
};
