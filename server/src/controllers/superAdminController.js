const SuperAdmin = require("../model/superAdminModel");

const superAdminRegistration = async (req, res) => {
  const { login } = req.body;

  try {
    if (!login) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const superAdmin = await SuperAdmin.findOne({ login });

    if (superAdmin) {
      return res.status(200).json({ message: "Super admin already exists" });
    }

    const newSuperAdmin = new SuperAdmin({ login });
    await newSuperAdmin.save();

    res.status(201).json({
      success: true,
      message: "Super admin registered successfully",
      superadmin: {
        id: newSuperAdmin._id,
        login: newSuperAdmin.login,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const superAdminLogin = async (req, res) => {
  const { login } = req.body;

  try {
    if (!login) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const superAdmin = await SuperAdmin.findOne({ login });

    if (!superAdmin) {
      return res.status(404).json({ message: "Super admin not found" });
    }

    // Perform authentication logic here...

    // For now, let's just return a success message
    res.status(200).json({ message: "Super admin logged in successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  superAdminRegistration,
  superAdminLogin,
};
