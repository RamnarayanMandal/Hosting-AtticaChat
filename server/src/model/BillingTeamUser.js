const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const billingTeamSchema = new mongoose.Schema(
  {
    name: { type: "string", required: [true, "name is required"] },
    email: {
      type: "string",
      unique: true,
      required: [true, "email is required"],
    },
    password: { type: "string", required: [true, "password is required"] },
    phone: { type: "string", required: [true, "phone is required"] },

    address: { type: "string", required: [true, "address is required"] },

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
  },
  {
    timestamps: true,
  }
);

billingTeamSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

billingTeamSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("BillingTeamUser", billingTeamSchema);
