const ManagerDetails = require("../model/ManagerModel");
const jwt = require("jsonwebtoken");

const registerManager = async (req, res) => {
  const {
    manager_Id,
    manager_name,
    manager_email,
    manager_password,
    manager_phone,
    manager_address,
    branch_city,
    branch_state,
    branch_pincode,
    branch_name,
    branch_address,
  } = req.body;

  try {
    if (
      !manager_Id ||
      !manager_name ||
      !manager_email ||
      !manager_password ||
      !manager_phone ||
      !manager_address ||
      !branch_state ||
      !branch_pincode ||
      !branch_city ||
      !branch_name ||
      !branch_address
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const manager = await ManagerDetails.findOne({ manager_email });
    if (manager) {
      return res.status(400).json({ message: "Manager already exists" });
    }

    const newManager = new ManagerDetails({
      manager_Id,
      manager_name,
      manager_email,
      manager_password,
      manager_phone,
      manager_address,
      branch_city,
      branch_state,
      branch_pincode,
      branch_name,
      branch_address,
    });

    const managerresp = await newManager.save();
    res.status(201).json({
      success: true,
      message: "Manager registered successfully",
      manager: managerresp,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const loginManager = async (req, res) => {
  const { manager_email, manager_password } = req.body;

  try {
    if (!manager_email || !manager_password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const manager = await ManagerDetails.findOne({ manager_email });
    if (!manager) {
      return res.status(400).json({ message: "Manager not found" });
    }

    const isMatch = await manager.matchPassword(manager_password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        manager: {
          id: manager._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      id: manager._id,
      accessToken,
      message: "Manager logged in successfully"
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const logoutManager = async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Manager logged out successfully" });
};

const getAllManagers = async (req, res) => {
  try {
    const managers = await ManagerDetails.find();
    res.status(200).json(managers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getManagerById = async (req, res) => {
  const { id } = req.params;
  try {
    const manager = await ManagerDetails.findById(id);
    res.status(200).json(manager);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteManagerById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedManager = await ManagerDetails.findByIdAndDelete(id);
    res.status(200).json({ message: "Manager deleted", deletedManager });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateManagerById = async (req, res) => {
  const { id } = req.params;
  const {
    manager_name,
    manager_email,
    manager_password,
    manager_phone,
    manager_address,
    branch_city,
    branch_state,
    branch_pincode,
    branch_name,
  } = req.body;
  try {
    const updatedManager = await ManagerDetails.findByIdAndUpdate(
      id,
      {
        manager_name,
        manager_email,
        manager_password,
        manager_phone,
        manager_address,
        branch_city,
        branch_state,
        branch_pincode,
        branch_name,
      },
      { new: true }
    );
    res.status(200).json({ message: "Manager updated", updatedManager });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const currentManager = async (req, res) => {
  try {
    const manager = await ManagerDetails.findById(req.manager.id);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    res.status(200).json(manager);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerManager,
  loginManager,
  logoutManager,
  getAllManagers,
  getManagerById,
  deleteManagerById,
  updateManagerById,
  currentManager,
};
