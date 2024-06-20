const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Manager",
  },
  locations: [{
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
