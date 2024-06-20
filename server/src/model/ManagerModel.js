const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const managerSchema = new mongoose.Schema(
  {
    manager_Id: {
      type: String,
      required: true,
      unique: true, // Ensure the email is unique
    },
    manager_name: {
      type: String,
      required: true,
    },
    manager_email: {
      type: String,
      required: true,
      unique: true, // Ensure the email is unique
    },
    manager_password: {
      type: String,
      required: true,
    },
    manager_phone: {
      type: String,
      required: true,
    },
    manager_address: {
      type: String,
      required: true,
    },
    branch_name: {
      type: String,
      required: true,
    },
    branch_state: {
      type: String,
      required: true,
    },
    branch_city: {
      type: String,
      required: true,
    },
    branch_pincode: {
      type: String,
      required: true,
    },
    branch_address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

managerSchema.pre("save", async function (next) {
  if (!this.isModified("manager_password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.manager_password = await bcrypt.hash(this.manager_password, salt);
  next();
});

managerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.manager_password);
};

module.exports = mongoose.model("ManagerDetails", managerSchema);
