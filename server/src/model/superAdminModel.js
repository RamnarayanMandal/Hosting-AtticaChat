const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
